import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptComponent = {
  system: `You are a precise evaluator who validate relevance of the document.`,
  instruction: `
      Evaluate the relevance of the document to the question.
      You must answer one word of "pass" or "retrieve".
      If you can answer based on <relatedDocs>, you can answer "pass".
      Else, answer "retrieve"
        `,
  example: `
      <relatedDocs>
      document: "연차 신청 가이드\n\n3일 이상 휴가를 가거나 당일에 긴급하게 휴가를 사용하는 경우 SW팀 디스코드 채널에도 공지한다.\n\n\n\n"
      url: "https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/875135056"
      </relatedDocs>
      question: 연차 신청 방법
      answer: pass
        `,
};

export const evaluatorPrompt = ChatPromptTemplate.fromMessages([
  ["system", promptComponent.system],
  [
    "user",
    `
      <instruction>
      ${promptComponent.instruction}
      </instruction>

      <example>
      ${promptComponent.example}
      </example>

      <relatedDocs>
      {relatedDocs}
      </relatedDocs>
      question: {userInput}`,
  ],
]);
