"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const confluence_1 = require("../components/retriever/multiqueryRetriever/confluence");
const openai_1 = require("../libs/openai");
const reference_1 = require("../prompts/reference");
exports.default = {
    reference: {
        async route(ctx) {
            const { query, route, onRetrieveStart, onLLMStart, onRetrieveFail } = ctx;
            onRetrieveStart();
            const [relatedDocs, passOrRetrieve] = await (0, confluence_1.multiQueryRAG)(query, "ecubelabs-knowledge", route);
            if (passOrRetrieve === "pass") {
                onLLMStart();
                const llm = (0, openai_1.chatOpenai)("gpt-4o");
                //@ts-expect-error
                const chain = reference_1.referencePrompt.pipe(llm);
                const response = await chain.stream({
                    userInput: query,
                    relatedDocs,
                });
                return response;
            }
            else {
                return onRetrieveFail();
            }
        },
        description: "when the user find a reference for studying the topic or having a deep understanding.",
    },
};
