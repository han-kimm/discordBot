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
      document: "[OJT][RDB] N+1 Query Problem\n\n\n\n\nN+1 QUERY PROBLEM\n\n * 쿼리 1번으로 N건의 데이터를 가져오고 각 N건으로 부터 속성 값을 얻기 위해 다시 N번 쿼리를 반복하여 수행하는 문제.\n\n * DB 쿼리 수행 비용이 크므로(빈번한 I/O 발생) eager 로딩 등으로 해결하는 것이 권장.\n\n\nEAGER LOADING\n\n * 로딩 시 참조해야하는 정보를 미리 명시하는 일\n\n * ORM 활용 시 흔히 발생할 수 있는 N+1 문제 해결 가능\n\n * Lazy Loading의 반대 개념\n\n\n문제 상황\n\n/* \n두 모델\ncat { id, kind, name }\ncatColor { kind, color }\n로부터, result {id, kind, name, color }[] 를 쿼리하려고 한다. \n*/\n\nconst cats = await this.catRepository.findByIds(catIds); // SELECT * FROM Cat WHERE catId IN (catIds);\n\n// N+1 Query Problem 상황\nconst colors = cats.map((cat) => \n  // N건의 고양이 데이터에 대해 N번의 쿼리를 반복한다\n  this.catColorRepository.findByKinds(cat.kind); // SELECT * FROM CatColor WHERE kind = 'Russian Blue';\n    \n)\n\n\nEAGER LOADING 적용\n\nSELECT Cat.*, CatColor.* from Cat WHERE catId IN (catIds)\nJOIN CatColor\nON Cat.kind == CatColor.kind \n\n\n하지만 EAGER LOADING을 사용할 수 없는 경우에는 어떻게 해결해야 할까?\n\n * Map나 lodash의 keyBy를 사용해 아래처럼 해결할 수도 있다.\n\n// Map을 사용하는 경우\nconst cats = await this.catRepository.findByIds(catIds);\n                                    \nconst catColorsMap = await this.catColorRepository.findAll()\n                                                  .then((catColors)=> new Map(catColors.map((catColor)=> [catColor.kind], catColor)));\n\nconst result = cats.map((cat)=> {\n                                return {\n                                    ...cat, \n                                    color: catColorsMap.get(cat.kind).color\n                                });\n                \n// lodash를 사용하는 경우\nconst cats = await this.catRepository.findByIds(catIds);\n\nconst catColorKindOf = _.keyBy(await this.catColorRepository.findAll(),'kind');\n\nconst result = cats.map((cat)=> {\n                                return {\n                                    ...cat, \n                                    color: catColorKindOf[cat.kind].color\n                                });\n\n\n\n참고 문서\n\n * https://zetawiki.com/wiki/N%2B1_쿼리_문제\n   [https://zetawiki.com/wiki/N%2B1_%EC%BF%BC%EB%A6%AC_%EB%AC%B8%EC%A0%9C]\n\n * https://zetawiki.com/wiki/이른_로딩\n   [https://zetawiki.com/wiki/%EC%9D%B4%EB%A5%B8_%EB%A1%9C%EB%94%A9]"
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
