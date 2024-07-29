import { confluenceMultiqueryRetriever } from "../components/retriever/multiqueryRetriever/confluence";
import { chatOpenai } from "../libs/openai";
import { howToPrompt } from "../prompts/how-to";

export default {
  "how-to": {
    async route(input: string) {
      const relatedDocs = await confluenceMultiqueryRetriever(
        input,
        "ecubelabs-knowledge",
        "how-to"
      );

      const llm = chatOpenai("gpt-4o");

      //@ts-expect-error
      const chain = howToPrompt.pipe(llm);
      const response = await chain.invoke({
        userInput: input,
        relatedDocs,
      });

      if (response.content === "retrieve") {
        const newRelatedDocs = await confluenceMultiqueryRetriever(
          input,
          "ecubelabs-knowledge",
          "reference"
        );
        const newResponse = await chain.invoke({
          userInput: input,
          relatedDocs: newRelatedDocs,
        });

        return newResponse;
      }

      return response;
    },
    description: "how to do something",
  },
};
