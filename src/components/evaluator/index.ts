import { chatOpenai } from "../../libs/openai";
import { evaluatorPrompt } from "../../prompts/evaluator";

export async function evaluateDocument(userInput: string, relatedDocs: string) {
  const llm = chatOpenai("gpt-4o");
  // @ts-expect-error
  const chain = evaluatorPrompt.pipe(llm);
  const response = await chain.invoke({
    userInput,
    relatedDocs,
  });

  return response.content;
}
