import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptComponent = {
  system: `You are a good problem solver. You should help the user to resolve the error.`,
  instruction: `
      Give a solution based on <relatedDocs>.
      When you can answer with <relatedDocs>, you must leave a url of the document.
      Should answer in markdown format of discord. Answer must be less than 500 characters.
      You can suggest another solution if you need. but specify your solution suggestion is not based on the document.
        `,
  example: `
      <relatedDocs>
      document: "[OJT][RDB] N+1 Query Problem\n\n\n\n\nN+1 QUERY PROBLEM\n\n * 쿼리 1번으로 N건의 데이터를 가져오고 각 N건으로 부터 속성 값을 얻기 위해 다시 N번 쿼리를 반복하여 수행하는 문제.\n\n * DB 쿼리 수행 비용이 크므로(빈번한 I/O 발생) eager 로딩 등으로 해결하는 것이 권장.\n\n\nEAGER LOADING\n\n * 로딩 시 참조해야하는 정보를 미리 명시하는 일"
      url: "https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/652968156"
      </relatedDocs>
      question: RDB Query problem
      answer: 
       eager 로딩 등으로 해결하는 것이 권장된다.
       Eager Loading: 로딩 시 참조해야하는 정보를 미리 명시하는 일
       \`\`\`js
       // 예시코드
       \`\`\`

       Eager Loading을 사용할 수 없는 경우 Map나 lodash의 keyBy를 사용해 해결할 수도 있다.
       \`\`\`js
       // 예시코드
       \`\`\`
       
       [해당 Confluence 문서](https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/652968156)
        `,
};

export const errorSolutionPrompt = ChatPromptTemplate.fromMessages([
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
