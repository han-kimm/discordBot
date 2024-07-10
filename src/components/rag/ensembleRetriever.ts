import { readFile } from "fs/promises";
import { Document } from "langchain/document";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { embedOpenai } from "../../libs/openai";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { BaseRetriever, BaseRetrieverInput } from "@langchain/core/retrievers";

const EMBED_MODEL = "text-embedding-3-large";
const collectionName = "ecubelabs-test7";

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

export async function ensembleRetriever(filePath: string, query: string) {
  console.log("=".repeat(100));
  console.log("start file reading...");
  const data = await readFile(filePath, "utf-8");
  const jsonfiles: { pageContent: string; url: string }[] = JSON.parse(data);
  const documents = jsonfiles.map((embed) => {
    return new Document({
      pageContent: embed.pageContent,
      metadata: {
        url: embed.url,
      },
    });
  });
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const splitedDocs = await splitter.splitDocuments(documents);

  const sparseRetriever = new SimpleCustomRetriever({
    documents: splitedDocs,
  });

  console.log("=".repeat(100));
  console.log(`start file embedding by model ${EMBED_MODEL}...`);
  const vectorStore = await Chroma.fromDocuments(
    splitedDocs,
    embedOpenai(EMBED_MODEL),
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
