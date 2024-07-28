import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptComponent = {
  system: `You are a keen supervisor.`,
  instruction: `
        Find the intent of the user question.
        And use the tool to sort the question.
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
        infer-from-value
        <user>
        SW팀 R&R의 구조적 특징
        </user>
        infer-from-value
        `,
};

export const prompt = ChatPromptTemplate.fromMessages([
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
