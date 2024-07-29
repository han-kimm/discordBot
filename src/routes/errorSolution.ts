import { ChatBotContext } from ".";
import { multiQueryRAG } from "../components/retriever/multiqueryRetriever/confluence";
import { chatOpenai } from "../libs/openai";
import { howToPrompt } from "../prompts/howTo";

export default {
  errorSolution: {
    async route(ctx: ChatBotContext) {
      const { query, route, onRetrieveStart, onLLMStart, onRetrieveFail } = ctx;

      onRetrieveStart();
      const [relatedDocs, passOrRetrieve] = await multiQueryRAG(
        query,
        "ecubelabs-knowledge",
        route
      );

      if (passOrRetrieve === "pass") {
        onLLMStart();
        const llm = chatOpenai("gpt-4o");
        //@ts-expect-error
        const chain = howToPrompt.pipe(llm);
        const response = await chain.stream({
          userInput: query,
          relatedDocs,
        });

        return response;
      } else {
        return onRetrieveFail();
      }
    },
    description:
      "when the user is finding a solution for the error. or having a problem with the code or software.",
  },
};
