"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confluenceLoader = confluenceLoader;
exports.confluencePrepLoader = confluencePrepLoader;
const document_1 = require("langchain/document");
const confluence_1 = require("../../libs/confluence");
async function confluenceLoader(parentPageId) {
    console.log("|");
    console.log("| Start Confluence Page Loading...");
    console.log("|");
    const pageContents = await (0, confluence_1.getAllPageContents)(parentPageId);
    const documents = pageContents.map((embed) => {
        return new document_1.Document(embed);
    });
    return documents;
}
async function confluencePrepLoader(fileName) {
    const pageContents = await (0, confluence_1.getAllPageContentsFromJSON)(fileName);
    const documents = pageContents.map((embed) => new document_1.Document(embed));
    return documents;
}
