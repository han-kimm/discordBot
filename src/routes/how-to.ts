import { chatOpenai } from "../libs/openai";

export default {
  "how-to": {
    async route(input: string) {
      const llm = chatOpenai("gpt-4o");
      const response = await llm.stream([
        [
          "system",
          "You are a kind guide bot. Should answer in markdown format of discord. Answer must be less than 500 characters.",
        ],
        ["user", input],
      ]);

      return response;
    },
    description: "how to do something",
  },
};
