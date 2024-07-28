import { chatOpenai } from "./libs/openai";

import { prompt } from "./prompts/router";

// NOTE: router Tool module
// Add routes here
const ROUTE_PATHS: { [key: string]: any } = {
  "how-to": {
    route: async function llmHowTo(input: string) {
      const llm = chatOpenai("gpt-4o");
      const response = await llm.invoke([
        [
          "system",
          "You are a kind guide bot. Should answer in markdown format of discord. Answer must be less than 500 characters.",
        ],
        ["user", input],
      ]);

      return response.content;
    },
    description: "how to do something",
  },
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

const routerDescription = Object.entries(ROUTE_PATHS)
  .map(([key, value]) => `${key}: ${value.description}`)
  .join("\n");

const fm = chatOpenai("gpt-4o-mini");

export async function chatRouter(input: string) {
  // @ts-expect-error, module 때문에 생긴 에러
  const chain = prompt.pipe(fm);
  const route = await chain.invoke({
    routerDescription,
    userInput: input,
  });

  const result = await ROUTE_PATHS[route.content as string].route(input);

  return result;
  // if (!aiMessage.tool_calls) {
  //   throw new Error("Please give a question another way.");
  // }

  // for (const toolCall of aiMessage.tool_calls) {
  //   // @ts-ignore, index signature와 zod.object간의 문제
  //   await router.invoke(toolCall.args);
  // }
}
