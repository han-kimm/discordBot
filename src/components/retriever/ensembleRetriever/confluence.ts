import { Chroma } from "@langchain/community/vectorstores/chroma";
import { BaseRetriever, BaseRetrieverInput } from "@langchain/core/retrievers";
import { Document } from "langchain/document";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { embedOpenai } from "../../../libs/openai";
import { confluencePrepLoader } from "../../loader/confluence";

class SimpleCustomRetriever extends BaseRetriever {
  lc_namespace = [];

  documents: Document[];

  constructor(fields: { documents: Document[] } & BaseRetrieverInput) {
    super(fields);
    this.documents = fields.documents;
  }

  async _getRelevantDocuments(query: string): Promise<Document[]> {
    return this.documents.filter((document) =>
      document.pageContent.includes(query)
    );
  }
}

export async function confluenceEnsembleRetriever(
  query: string,
  collectionName: string,
  filePath: string
) {
  const documents = await confluencePrepLoader(filePath);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const splitedDocs = await splitter.splitDocuments(documents);

  const sparseRetriever = new SimpleCustomRetriever({
    documents: splitedDocs,
  });

  const vectorStore = await Chroma.fromExistingCollection(
    embedOpenai("text-embedding-3-small"),
    {
      collectionName,
      url: "http://localhost:8000",
    }
  );

  const denseRetriever = vectorStore.asRetriever();

  const retriever = new EnsembleRetriever({
    retrievers: [denseRetriever, sparseRetriever],
    weights: [0.8, 0.5],
  });

  console.log("=".repeat(100));
  console.log("start finding related Docs...");
  return retriever.invoke(query);
}
