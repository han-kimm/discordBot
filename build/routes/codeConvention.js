"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const confluence_1 = require("../components/retriever/multiqueryRetriever/confluence");
const openai_1 = require("../libs/openai");
const codeConvention_1 = require("../prompts/codeConvention");
exports.default = {
    codeConvention: {
        async route(ctx) {
            const { query, route, onRetrieveStart, onLLMStart, onRetrieveFail } = ctx;
            onRetrieveStart();
            const [relatedDocs, passOrRetrieve] = await (0, confluence_1.multiQueryRAG)(query, "ecubelabs-knowledge", route);
            if (passOrRetrieve === "pass") {
                onLLMStart();
                const llm = (0, openai_1.chatOpenai)("gpt-4o");
                //@ts-expect-error
                const chain = codeConvention_1.codeConventionPrompt.pipe(llm);
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
        description: "when the user don't know how to write code in a certain way. e.g. code convention, code style, and best practice and use case.",
    },
};
