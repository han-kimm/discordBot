"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confluenceMultiQueryRetriever = confluenceMultiQueryRetriever;
exports.confluenceMultiQueryEvaluator = confluenceMultiQueryEvaluator;
exports.multiQueryRAG = multiQueryRAG;
const prompts_1 = require("@langchain/core/prompts");
const pinecone_1 = require("@langchain/pinecone");
const pinecone_2 = require("@pinecone-database/pinecone");
const dotenv_1 = require("dotenv");
const multi_query_1 = require("langchain/retrievers/multi_query");
const openai_1 = require("../../../libs/openai");
const evaluator_1 = require("../../evaluator");
(0, dotenv_1.config)();
async function confluenceMultiQueryRetriever(query, index, namespace) {
    const llm = (0, openai_1.chatOpenai)("gpt-4o-mini");
    const pc = new pinecone_2.Pinecone();
    const pineconeIndex = pc.index(index);
    const vectorStore = await pinecone_1.PineconeStore.fromExistingIndex((0, openai_1.embedOpenai)("text-embedding-3-large"), {
        pineconeIndex,
        namespace,
    });
    const retriever = vectorStore.asRetriever({
        k: 1,
    });
    const multiQueryRetriever = multi_query_1.MultiQueryRetriever.fromLLM({
        retriever,
        // @ts-expect-error
        llm,
        queryCount: 5,
        prompt: new prompts_1.PromptTemplate({
            inputVariables: ["question", "queryCount"],
            template: `
You are a query generator.
Given that you need to make accurate and relevant query, Generate {queryCount} sentences which are related the given context.
Your answer is for retrieving relevant documents from vector database.

Provide these alternative sentences separated by newlines between XML tags of 'questions'.

For example:
<context>
연차
</context>
<questions>
연차 신청 방법
연차 가이드
연차 사용
연차 기준
반차와 연차 차이
</questions>

context:{question}`,
        }),
    });
    const documents = await multiQueryRetriever.invoke(query);
    return documents.reduce((acc, doc, idx) => acc +
        "\n" +
        `document ${idx + 1}: ${doc.pageContent}
       url: ${doc.metadata.url}
    `, "");
}
async function confluenceMultiQueryEvaluator(query, index, namespace) {
    const relatedDocs = await confluenceMultiQueryRetriever(query, index, namespace);
    if (relatedDocs === "") {
        return ["", "retrieve"];
    }
    const passOrRetrieve = await (0, evaluator_1.evaluateDocument)(query, relatedDocs);
    return [relatedDocs, passOrRetrieve];
}
async function multiQueryRAG(query, index, namespace, retryNamespace = "all") {
    let [relatedDocs, passOrRetrieve] = await confluenceMultiQueryEvaluator(query, index, namespace);
    if (passOrRetrieve === "retrieve") {
        [relatedDocs, passOrRetrieve] = await confluenceMultiQueryEvaluator(query, index, retryNamespace);
    }
    return [relatedDocs, passOrRetrieve];
}
