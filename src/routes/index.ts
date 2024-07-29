import { chatOpenai } from "../libs/openai";
import { routerPrompt } from "../prompts/route";
import codeConventionRouter from "./codeConvention";
import howToRouter from "./howTo";
import referenceRouter from "./reference";
import errorSolutionRouter from "./errorSolution";
import archiveRouter from "./archive";

// NOTE: router Tool module
// Add routes here
const indexRouter: { [key: string]: any } = {
  ...howToRouter,
  ...codeConventionRouter,
  ...referenceRouter,
  ...errorSolutionRouter,
  ...archiveRouter,
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

export async function triggerRouter(ctx: ChatBotContext) {
  const { query, onRouteSuccess } = ctx;
  const routerLLM = chatOpenai("gpt-4o-mini");
  // @ts-expect-error, langchain.js 업데이트를 기다려야 함
  const chain = routerPrompt.pipe(routerLLM);
  const response = await chain.invoke({
    routerDescription,
    userInput: query,
  });
  const route = response.content as string;

  ctx.route = route;
  onRouteSuccess();
  return indexRouter[route].route(ctx);
}
