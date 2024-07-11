import { Chroma } from "@langchain/community/vectorstores/chroma";
import { chatOpenai, embedOpenai } from "../../../libs/openai";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { PromptTemplate } from "@langchain/core/prompts";

export async function confluenceMultiqueryRetriever(query: string) {
  const llm = chatOpenai("gpt-3.5-turbo");

  const vertorStore = await Chroma.fromExistingCollection(
    embedOpenai("text-embedding-3-large"),
    {
      collectionName: "ecubelabs-selfquery-2",
      url: "http://localhost:8000",
    }
  );

  const retriever = vertorStore.asRetriever({
    k: 1,
  });

  const multiqueryRetriever = MultiQueryRetriever.fromLLM({
    retriever,
    llm,
    prompt: new PromptTemplate({
      inputVariables: ["question", "queryCount"],
      template: `
You are a good AI developer. Answer must always be based on given context. you can't lie.
Generate 5 phrase which summarize the given context. the phrases will be used for searching relevant documents in company's database.

Provide these alternative phrases separated by newlines between XML tags of 'questions'. For example:

<questions>
phrase 1
phrase 2
phrase 3
</questions>

context:{question}`,
    }),
  });

  return multiqueryRetriever.invoke(query);
}
