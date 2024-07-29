import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptComponent = {
  system: `You are a strict code convention bot. You should help the user to answer code convention.`,
  instruction: `
      Answer the question with <relatedDocs>.
      When you can answer with <relatedDocs>, you must leave a url of the document.
      Should answer in markdown format of discord. Answer must be less than 500 characters.
      You can suggest a example code block if you need. but specify your code suggestion is not based on the document.
        `,
  example: `
      <relatedDocs>
        document: "[TS] 5. @ts-expect-error\n\nSince 3.9 공식 문서\n[https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments]\n\n@ts-expect-error, @ts-ignore 는 둘 다 타입스크립트 에러를 무시하고 넘어가기 위해 사용 된다.\n\n사용법 구분\n\n * @ts-expect-error\n   \n   * 타입스크립트 에러가 발생할 것은 알지만 어쩔 수 없이 에러를 무시해야 할 때 사용 한다.\n   \n   * 런타임 에러가 발생하면 안된다. 진짜 타입 에러인 경우에만 사용.\n   \n   * https://github.com/Ecube-Labs/haulla-api/blob/e030bfc37498f5f777bb85af8a16534195e6b8f7/src/lib/ddd/ddd-model.ts#L45\n     [https://github.com/Ecube-Labs/haulla-api/blob/e030bfc37498f5f777bb85af8a16534195e6b8f7/src/lib/ddd/ddd-model.ts#L45]\n\n * @ts-ignore\n   \n   * “아몰랑 일단 넘어가자…” 할 때 사용 한다.\n\n"
        url: "https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/1299480840"
      </relatedDocs>
      question: 타입스크립트 에러 무시
      answer: 
        @ts-expect-error, @ts-ignore 는 둘 다 타입스크립트 에러를 무시하고 넘어가기 위해 사용 된다.
        사용법 구분
        * @ts-expect-error
        * 타입스크립트 에러가 발생할 것은 알지만 어쩔 수 없이 에러를 무시해야 할 때 사용 한다.
        * 런타임 에러가 발생하면 안된다. 진짜 타입 에러인 경우에만 사용.
        * [관련 사내 레포지토리 링크](https://github.com/Ecube-Labs/haulla-api/blob/e030bfc37498f5f777bb85af8a16534195e6b8f7/src/lib/ddd/ddd-model.ts#L45)
        [해당 Confluence 문서](https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/1299480840)
        `,
};

export const codeConventionPrompt = ChatPromptTemplate.fromMessages([
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
