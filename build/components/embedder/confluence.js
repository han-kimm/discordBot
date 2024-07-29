"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confluenceEmbedder = confluenceEmbedder;
const chroma_1 = require("@langchain/community/vectorstores/chroma");
async function confluenceEmbedder({ documents, collectionName, embeddings, }) {
    console.log("|");
    console.log(`| Start Embedding...`);
    console.log("|");
    await chroma_1.Chroma.fromDocuments(documents, embeddings, {
        collectionName,
        url: "http://localhost:8000",
    }).then(() => console.log("| Embedding Done!"));
}
