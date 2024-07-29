"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateDocument = evaluateDocument;
const openai_1 = require("../../libs/openai");
const evaluator_1 = require("../../prompts/evaluator");
async function evaluateDocument(userInput, relatedDocs) {
    const llm = (0, openai_1.chatOpenai)("gpt-4o-mini");
    // @ts-expect-error
    const chain = evaluator_1.evaluatorPrompt.pipe(llm);
    const response = await chain.invoke({
        userInput,
        relatedDocs,
    });
    return response.content;
}
