"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingPrompt = void 0;
const prompts_1 = require("@langchain/core/prompts");
const promptComponent = {
    system: `You are a accurate and precise supervisor.`,
    instruction: `
        Find the purpose of a document.
        You can use <tool> to categorize the document.
        just answer one word from the following categories.
        `,
    tool: `
        categorizer: when the document is given to the categorizer, it will categorize the document into one of the following categories:
        how-to: the document is a guidance for user who have not been familiar with the topic.
        code-convention: the document is a convention for making the code more readable and maintainable.
        error-solution: the document is a solution for the error.
        reference: the document is a reference for studying the topic or having a deep understanding.
        archive: the document is an archive for minutes of meeting and report of past events or projects.
        `,
    example: `
        example 1: "변수 명명 규칙\n * 케이스\n * Boolean\n * Date\n * Abbreviations\n * Opening or closing\n..."
        answer 1: code-convention
        example 2: "LLM\n\nhttps://www.salesforceairesearch.com/crm-benchmark\n[https://www.salesforceairesearch.com/crm-benchmark]"
        answer 2: reference
        example 3: "Tooling troubleshooting guide\n\n개발 환경에서 사용되는 도구에 공통적으로 발생하는 문제를 해결하기 위해 조치한 내용을 기록한다..."
        answer 3: error-solution
        `,
};
exports.embeddingPrompt = prompts_1.ChatPromptTemplate.fromMessages([
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
