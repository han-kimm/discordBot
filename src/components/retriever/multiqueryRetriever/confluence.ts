import { Chroma } from "@langchain/community/vectorstores/chroma";
import { chatOpenai, embedOpenai } from "../../../libs/openai";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";

export async function confluenceMultiqueryRetriever(query: string) {
  const llm = chatOpenai("gpt-3.5-turbo");

  const retriever = await Chroma.fromExistingCollection(
    embedOpenai("text-embedding-3-small"),
    {
      collectionName: "ecubelabs-multiquery",
      url: "http://localhost:8000",
    }
  ).then((chroma) =>
    chroma.asRetriever({
      k: 1,
    })
  );

  const multiqueryRetriever = MultiQueryRetriever.fromLLM({
    retriever,
    llm,
  });

  return multiqueryRetriever.invoke(query);
}
