"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildrenPageIds = getChildrenPageIds;
exports.getAllChildrenPageIds = getAllChildrenPageIds;
exports.savePageIds = savePageIds;
exports.loadPageIds = loadPageIds;
exports.getContentById = getContentById;
exports.getAllPageContents = getAllPageContents;
exports.getAllPageContentsWithJSON = getAllPageContentsWithJSON;
exports.saveAllPageContents = saveAllPageContents;
exports.getAllPageContentsFromJSON = getAllPageContentsFromJSON;
exports.categorizeAllPageContents = categorizeAllPageContents;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
const promises_1 = require("fs/promises");
const html_to_text_1 = require("html-to-text");
const openai_1 = require("./openai");
const embedding_1 = require("../prompts/embedding");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)();
const username = process.env.ATLASSIAN_USERNAME;
const accessToken = process.env.ATLASSIAN_API_KEY;
const baseUrl = "https://ecubelabs.atlassian.net";
const spaceKey = "SW";
axios_1.default.defaults.baseURL = baseUrl;
axios_1.default.defaults.headers.common["Authorization"] = `Basic ${Buffer.from(`${username}:${accessToken}`).toString("base64")}`;
axios_1.default.defaults.headers.common["Accept"] = "application/json";
axios_1.default.defaults.headers.common["Content-Type"] = "application/json";
// NOTE: Confluence의 특정 페이지의 자식 페이지들의 ID를 가져오는 함수
// ID를 먼저 가져오고, 이후에 페이지의 내용을 가져오는 방식으로 사용
async function getChildrenPageIds(pageId) {
    const response = await axios_1.default.get(`/wiki/api/v2/pages/${pageId}/children?limit=250`);
    const results = response.data.results;
    return results.map((result) => result.id);
}
async function getAllChildrenPageIds(pageId) {
    let result = [];
    const childrenPageIds = await getChildrenPageIds(pageId);
    if (childrenPageIds.length === 0) {
        return result;
    }
    result = [...result, ...childrenPageIds];
    for (const childPageId of childrenPageIds) {
        const res = await getAllChildrenPageIds(childPageId);
        result = [...result, ...res];
    }
    return result;
}
async function savePageIds(id) {
    const ids = await getAllChildrenPageIds(id);
    ids.unshift(id);
    await (0, promises_1.writeFile)(__dirname.replace("libs", "assets") + `/confluencePageIds-${id}.json`, JSON.stringify(ids, null, 2));
}
async function loadPageIds(filePath) {
    const data = await (0, promises_1.readFile)(filePath, "utf-8");
    return JSON.parse(data);
}
async function getContentById(id) {
    const response = await axios_1.default.get(`/wiki/api/v2/pages/${id}?body-format=export_view`);
    const title = response.data.title;
    const value = response.data.body.export_view.value;
    return {
        pageContent: (0, html_to_text_1.htmlToText)(title + value),
        metaData: {
            url: `${baseUrl}/wiki/spaces/${spaceKey}/pages/${id}`,
        },
    };
}
async function getAllPageContents(parentPageId) {
    const ids = await getAllChildrenPageIds(parentPageId);
    const contents = await Promise.all(ids.map((id) => getContentById(id)));
    return contents;
}
async function getAllPageContentsWithJSON(filePath) {
    const ids = await loadPageIds(filePath);
    const contents = await Promise.all(ids.map((id) => getContentById(id)));
    return contents;
}
async function saveAllPageContents(parentPageId) {
    const contents = await getAllPageContents(parentPageId);
    await (0, promises_1.writeFile)(__dirname.replace("libs", "assets") +
        `/confluenceContents-${parentPageId}.json`, JSON.stringify(contents, null, 2));
}
async function getAllPageContentsFromJSON(filePath) {
    const data = await (0, promises_1.readFile)(__dirname.replace("libs", "assets") + `/${filePath}`, "utf-8");
    return JSON.parse(data);
}
// 새로운 데이터를 추가하는 함수
async function addData(newData) {
    try {
        // 파일을 읽고 기존 데이터를 파싱
        const filePath = path_1.default.join(__dirname, "/assets/confluenceDocuments-3571866.json");
        const data = await (0, promises_1.readFile)(filePath, "utf8");
        let jsonData = [];
        if (data) {
            jsonData = JSON.parse(data);
        }
        // 새로운 데이터를 기존 데이터에 추가
        jsonData = [...jsonData, ...newData];
        // 수정된 데이터를 JSON 문자열로 변환
        const updatedData = JSON.stringify(jsonData, null, 2);
        // 파일에 데이터를 덮어쓰기 없이 추가
        await (0, promises_1.writeFile)(filePath, updatedData, "utf8");
        console.log("새로운 데이터가 성공적으로 추가되었습니다.");
    }
    catch (err) {
        console.error("오류 발생:", err);
    }
}
async function categorizeAllPageContents() {
    const docs = await getAllPageContentsFromJSON("confluenceContents-3571866.json");
    const llm = (0, openai_1.chatOpenai)("gpt-4o-mini");
    // @ts-expect-error, langchain.js 업데이트를 기다려야 함
    const chain = embedding_1.embeddingPrompt.pipe(llm);
    let index = 1;
    const concurrency = 10;
    while (index < docs.length) {
        try {
            const currentDoc = docs.slice(index, index + concurrency);
            const results = await Promise.allSettled(currentDoc.map((doc) => chain
                .invoke({ userInput: doc.pageContent })
                .then((res) => res.content)));
            const categorizedDocs = currentDoc.map((doc, i) => {
                const result = results[i];
                if ("url" in doc && result.status === "fulfilled") {
                    return {
                        pageContent: doc.pageContent,
                        metadata: {
                            url: doc.url,
                            category: result.value,
                        },
                    };
                }
            });
            await addData(categorizedDocs);
            console.log("처리된 문서 수:", index + concurrency);
            console.log("progress:", ((index + concurrency) / docs.length) * 100);
            index += concurrency;
        }
        catch {
            console.error("오류 발생:", index);
        }
    }
}
