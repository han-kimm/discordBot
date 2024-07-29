import { Message } from "discord.js";
import { chatOpenai } from "../libs/openai";
import { routerPrompt } from "../prompts/route";
import howToRouter from "./howTo";
import codeConventionRouter from "./codeConvention";

// NOTE: router Tool module
// Add routes here
const indexRouter: { [key: string]: any } = {
  ...howToRouter,
  ...codeConventionRouter,
  errorSolution: {
    route: function llmErrorSolution() {},
    description: "solve an error",
  },
  findSimpleValue: {
    route: function llmFindSimpleValue() {},
    description: "find simple values from confluence pages",
  },
  inferFromValue: {
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
  const routerLLM = chatOpenai("gpt-4o-mini");
  // @ts-expect-error, langchain.js 업데이트를 기다려야 함
  const chain = routerPrompt.pipe(routerLLM);
  const response = await chain.invoke({
    routerDescription,
    userInput: query,
  });
  const route = response.content as string;

  console.log(route);
  ctx.route = route;
  onRouteSuccess();
  return indexRouter[route].route(ctx);
}
