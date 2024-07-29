import { ChatPromptTemplate } from "@langchain/core/prompts";

const promptComponent = {
  system: `You are a kind guide bot. You should help the user to answer how to do something.`,
  instruction: `
      Answer the question with <relatedDocs>.
      When you can answer with <relatedDocs>, you must leave a url of the document.
      Should answer in markdown format of discord. Answer must be less than 500 characters.
        `,
  example: `
      <relatedDocs>
      document: "연차 신청 가이드\n\n3일 이상 휴가를 가거나 당일에 긴급하게 휴가를 사용하는 경우 SW팀 디스코드 채널에도 공지한다.\n\n\n\n"
      url: "https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/875135056"
      </relatedDocs>
      question: 연차 신청 방법
      answer: 원티드 커먼스페이스에서 신청해 주세요.\n
      반차 신청시 출퇴근 기준은 15시입니다. 오전 반차는 15시 퇴근, 오후 반차는 15시 출근.\n
      개인별 연차 일수 및 시간 조정은 [HR팀]('https://ecubelabs.atlassian.net/people/team/b46e3d9f-dc20-4bd7-9cb4-3e0ac85aa092')에 문의해 주세요.\n\n
      [관련 Confluence 문서]('https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/875135056')
        `,
};

export const howToPrompt = ChatPromptTemplate.fromMessages([
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
