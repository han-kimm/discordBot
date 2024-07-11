import { AttributeInfo } from "langchain/chains/query_constructor";
import { chatOpenai, embedOpenai } from "../../../libs/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { ChromaTranslator } from "@langchain/community/structured_query/chroma";

const attributeInfo: AttributeInfo[] = [
  {
    name: "relatedTechnology",
    type: "string",
    description: "a relevant library or framework of the document",
  },
  {
    name: "keyword",
    type: "string",
    description: "what the document is described for",
  },
  {
    name: "isDeprecated",
    type: "boolean",
    description: "whether the document is deprecated",
  },
];

export async function confluenceSelfqueryRetriever(query: string) {
  console.log("|");
  console.log("| Start Confluence Selfquery Retrieving...");
  console.log("|");

  const llm = chatOpenai("gpt-3.5-turbo");
  const embeddings = embedOpenai("text-embedding-3-large");
  const documentContents =
    "Documents of software and code convention both for code review";
  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName: "ecubelabs-selfquery-2",
    url: "http://localhost:8000",
  });

  const selfqueryRetriever = SelfQueryRetriever.fromLLM({
    llm,
    vectorStore,
    documentContents,
    attributeInfo,
    structuredQueryTranslator: new ChromaTranslator(),
  });

  return selfqueryRetriever.invoke(query);
}
