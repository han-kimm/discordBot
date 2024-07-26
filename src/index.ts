import { tool } from "@langchain/core/tools";
import { chatOpenai } from "./libs/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import z from "zod";

// NOTE: router Tool module
// Add routes here
const ROUTE_PATHS = {
  "how-to": {
    route: function llmHowTo() {},
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

const ROUTE_PATHS_KEYS = Object.keys(ROUTE_PATHS) as [keyof typeof ROUTE_PATHS];

const router = tool(
  async ({ intent }) => {
    console.info("\x1b[36m%s\x1b[0m", `Routing | to ${intent}`);

    if (intent in ROUTE_PATHS) {
      const next = ROUTE_PATHS[intent];
      next.route();
      return "";
    }

    throw new Error("intent not found");
  },
  {
    name: "router",
    description: "link the question to the appropriate LLM",
    schema: z.object({
      intent: z.enum(ROUTE_PATHS_KEYS),
    }),
  }
);

// NOTE: Prompt for the router LLM
const PROMPT = ChatPromptTemplate.fromMessages([
  ["system", `You are a keen supervisor.`],
  [
    "user",
    `<instruction>
      Find the intent of the user question.
      And use the tool to sort the question.
      </instruction>

      <tool>
      router: when the question is given to the router, appropriate LLM for giving answer will be selected.
      this tool is used like this: router[<intent>]. intent will be one of the following:
      {routerDescription}
      </tool>

      <example>
      <user>
      22년도 매출과 23년도 매출 비교하기
      </user>
      router['infer-from-value']
      <user>
      SW팀 R&R의 구조적 특징
      </user>
      router['infer-from-value']
      </example>
      
      here is the question : 
      <user>
      {userInput}
      </user>`,
  ],
]);

// NOTE: router LLM module
const fm = chatOpenai("gpt-4o-mini");
const tools = [router];
const routerLLM = fm.bindTools(tools);

const routerDescription = Object.entries(ROUTE_PATHS)
  .map(([key, value]) => `${key}: ${value.description}`)
  .join("\n");

async function chat(input: string) {
  const chain = PROMPT.pipe(routerLLM);
  const aiMessage = await chain.invoke({ routerDescription, userInput: input });

  if (!aiMessage.tool_calls) {
    throw new Error("Please give a question another way.");
  }

  for (const toolCall of aiMessage.tool_calls) {
    await router.invoke(toolCall.args as any);
  }
}

chat("dd");
