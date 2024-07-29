import { Message } from "discord.js";
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

export type ChatBotContext = {
  query: string;
  route: string;
  onRouteSuccess: () => void;
  onRetrieveStart: () => void;
  onLLMStart: () => void;
  onRetrieveFail: () => void;
};

export async function chatBot(ctx: ChatBotContext) {
  const { query, onRouteSuccess } = ctx;
  const llm = chatOpenai("gpt-4o-mini");
  // @ts-expect-error, langchain.js 업데이트를 기다려야 함
  const chain = routerPrompt.pipe(llm);
  const response = await chain.invoke({
    routerDescription,
    userInput: query,
  });
  const route = response.content as string;

  ctx.route = route;
  onRouteSuccess();
  return indexRouter[route].route(ctx);
}
