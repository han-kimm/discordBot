"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referencePrompt = void 0;
const prompts_1 = require("@langchain/core/prompts");
const promptComponent = {
    system: `You are a fine reference docent. You should help the user to understand with reference.`,
    instruction: `
      Make a explanation of the question with <relatedDocs>.
      Should answer in markdown format of discord. Answer must be less than 500 characters.
      you must leave a url in <relatedDocs>.
      You can suggest additional url that doesn't exist in <relatedDocs> if you need, but specify your url suggestion is not based on the document in markdown format.
        `,
    example: `
      <relatedDocs>
      document: "ARIA\n\nhttps://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA\n[https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA]\n\n\n스크립트 처리된 위젯을 위한 ARIA\n\n> <input>, <button> 등 내장 요소는 기본적으로 키보드를 지원합니다. <div>와 ARIA로 특정 요소를 흉내 낸다면, 그 위젯도\n> 키보드를 지원하도록 해야 합니다.\n\nARIA 어트리뷰트는 스크린 리더기에 특정 의미를 암시 할 수 있지만 실제 동작을 구현해주는건 아니므로 자바스크립트로 직접 구현해야 한다.\n\n * https://stackblitz.com/edit/react-ts-zbvhnk?file=App.tsx\n   [https://stackblitz.com/edit/react-ts-zbvhnk?file=App.tsx]\n   키보드로 제어 가능한 체크 리스트는 위와 같이 구현할 수 있다.\n\n * https://nuli.navercorp.com/community/article/1133011\n   [https://nuli.navercorp.com/community/article/1133011]\n   자동완성의 경우에 실제로는 검색 입력창에만 포커스가 있지만, 자동 완성 선택창에도 포커스가 있는것을 알려야 하기 때문에\n   aria-activedescendant 와 같은 속성을 이용해 특정 요소에 포커스가 이동한것 처럼 표시해줘야 한다.\n\n\n\n",
      url: "https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/2457862177"
      </relatedDocs>
      question: ARIA란 무엇인가요?
      answer: <input>, <button> 등 내장 요소는 기본적으로 키보드를 지원합니다. <div>와 ARIA로 특정 요소를 흉내 낸다면, 그 위젯도 키보드를 지원하도록 해야 합니다.
      [WAI-ARIA 바르게 사용하기 8부 - 자동완성 편집창의 올바른 구현방법](https://nuli.navercorp.com/community/article/1133011)

      [해당 Confluence 문서](https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/2457862177)
        `,
};
exports.referencePrompt = prompts_1.ChatPromptTemplate.fromMessages([
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
