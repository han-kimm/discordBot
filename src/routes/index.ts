import { chatOpenai } from "../libs/openai";
import { routerPrompt } from "../prompts/route";
import howToRouter from "./how-to";

// NOTE: router Tool module
// Add routes here
const indexRouter: { [key: string]: any } = {
  ...howToRouter,
  "code-convention": {
    route: function llmCodeConvention() {},
    description: "code convention",
  },
  "error-solution": {
    route: function llmErrorSolution() {},
    description: "solve an error",
  },
  "find-simple-value": {
    route: function llmFindSimpleValue() {},
    description: "find simple values from confluence pages",
  },
  "infer-from-value": {
    route: function llmInferFromValue() {},
    description: "infer something from values of confluence pages",
  },
};

const routerDescription = Object.entries(indexRouter)
  .map(([key, value]) => `${key}: ${value.description}`)
  .join("\n");

export async function chatBot(input: string) {
  const llm = chatOpenai("gpt-4o-mini");
  // @ts-expect-error, langchain.js 업데이트를 기다려야 함
  const chain = routerPrompt.pipe(llm);
  const route = await chain.invoke({
    routerDescription,
    userInput: input,
  });

  return indexRouter[route.content as string].route(input);
}
