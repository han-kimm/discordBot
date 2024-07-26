import { PromptTemplate } from "@langchain/core/prompts";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { chatOpenai, embedOpenai } from "../../../libs/openai";

config();

export async function confluenceMultiqueryRetriever(query: string) {
  const llm = chatOpenai("gpt-3.5-turbo");

  const pc = new Pinecone();

  const pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME ?? "");

  const vertorStore = await PineconeStore.fromExistingIndex(
    embedOpenai("text-embedding-3-large"),
    {
      pineconeIndex,
      namespace: process.env.PINECONE_NAMESPACE ?? "",
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
You are a code convention checker.
Given that you need to make good quality code or refactor related code, Generate 5 sentences which are related the given context.
Your answer is for retrieving relevant documents from vector database.

Provide these alternative sentences separated by newlines between XML tags of 'questions'.

For example:
<context>
react
</context>
<questions>
1. code convention of react
2. front-end code convention
3. front-end component code convention
</questions>

context:{question}`,
    }),
  });

  return multiqueryRetriever.invoke(query);
}
