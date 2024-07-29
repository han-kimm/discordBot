"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerRouter = triggerRouter;
const openai_1 = require("../libs/openai");
const route_1 = require("../prompts/route");
const codeConvention_1 = __importDefault(require("./codeConvention"));
const howTo_1 = __importDefault(require("./howTo"));
const reference_1 = __importDefault(require("./reference"));
const errorSolution_1 = __importDefault(require("./errorSolution"));
const archive_1 = __importDefault(require("./archive"));
// NOTE: router Tool module
// Add routes here
const indexRouter = {
    ...howTo_1.default,
    ...codeConvention_1.default,
    ...reference_1.default,
    ...errorSolution_1.default,
    ...archive_1.default,
};
const routerDescription = Object.entries(indexRouter)
    .map(([key, value]) => `${key}: ${value.description}`)
    .join("\n");
async function triggerRouter(ctx) {
    const { query, onRouteSuccess } = ctx;
    const routerLLM = (0, openai_1.chatOpenai)("gpt-4o-mini");
    // @ts-expect-error, langchain.js 업데이트를 기다려야 함
    const chain = route_1.routerPrompt.pipe(routerLLM);
    const response = await chain.invoke({
        routerDescription,
        userInput: query,
    });
    const route = response.content;
    ctx.route = route;
    onRouteSuccess();
    return indexRouter[route].route(ctx);
}
