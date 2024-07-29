"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerPrompt = void 0;
const prompts_1 = require("@langchain/core/prompts");
const promptComponent = {
    system: `You are a keen supervisor.`,
    instruction: `
        Find the intent of the user question.
        And use the tool to sort the question.
        Your answer must be one word from the following tool intent list.
        `,
    tool: `
        router: when the question is given to the router, appropriate LLM for giving answer will be selected.
        this tool is used like this: <intent>. intent will be one of the following:
        {routerDescription}
        `,
    example: `
        <user>
        22년도 매출과 23년도 매출 비교하기
        </user>
        inferFromValue
        
        <user>
        타입스크립트 에러 무시할 때 필요한 것
        </user>
        codeConvention
        `,
};
exports.routerPrompt = prompts_1.ChatPromptTemplate.fromMessages([
    ["system", promptComponent.system],
    [
        "user",
        `<instruction>
        ${promptComponent.instruction}
        </instruction>
  
        <tool>
        ${promptComponent.tool}
        </tool>
  
        <example>
        ${promptComponent.example}
        </example>
        
        here is the question : 
        <user>
        {userInput}
        </user>`,
    ],
]);
