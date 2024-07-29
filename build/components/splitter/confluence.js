"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confluenceSplitter = confluenceSplitter;
const text_splitter_1 = require("langchain/text_splitter");
async function confluenceSplitter({ documents, chunkSize, chunkOverlap, }) {
    console.log("|");
    console.log("| Start Splitting...");
    console.log("|");
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });
    return splitter.splitDocuments(documents);
}
