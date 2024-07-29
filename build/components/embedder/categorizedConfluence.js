"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizedConfluenceEmbedder = categorizedConfluenceEmbedder;
const pinecone_1 = require("@langchain/pinecone");
const pinecone_2 = require("@pinecone-database/pinecone");
const dotenv_1 = require("dotenv");
const confluence_1 = require("../../libs/confluence");
const confluence_2 = require("../splitter/confluence");
const openai_1 = require("../../libs/openai");
(0, dotenv_1.config)();
async function categorizedConfluenceEmbedder(filename, index, namespace) {
    const docs = await (0, confluence_1.getAllPageContentsFromJSON)(filename);
    const filetedDocs = docs.filter((doc) => doc.metadata.category === namespace);
    const splittedDocs = await (0, confluence_2.confluenceSplitter)({
        documents: filetedDocs,
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const pc = new pinecone_2.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pc.index(index);
    const vectorStore = await pinecone_1.PineconeStore.fromDocuments(splittedDocs, (0, openai_1.embedOpenai)("text-embedding-3-large"), {
        pineconeIndex,
        namespace,
    });
    console.log("Vector store created", vectorStore);
}
