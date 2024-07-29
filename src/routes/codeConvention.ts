import { ChatBotContext } from ".";
import { multiQueryRAG } from "../components/retriever/multiqueryRetriever/confluence";
import { chatOpenai } from "../libs/openai";
import { codeConventionPrompt } from "../prompts/codeConvention";

export default {
  codeConvention: {
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
        const chain = codeConventionPrompt.pipe(llm);
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
      "when the user don't know how to write code in a certain way. e.g. code convention, code style, and best practice and use case.",
  },
};
