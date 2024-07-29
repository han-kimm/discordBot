import { ChatBotContext } from ".";
import { multiQueryRAG } from "../components/retriever/multiqueryRetriever/confluence";
import { chatOpenai } from "../libs/openai";
import { howToPrompt } from "../prompts/how-to";

export default {
  "how-to": {
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
    description: "how to do something",
  },
};
