import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
import { getAllPageContentsFromJSON } from "../../libs/confluence";
import { confluenceSplitter } from "../splitter/confluence";
import { embedOpenai } from "../../libs/openai";

config();

export async function categorizedConfluenceEmbedder(
  filename: string,
  namespace: string
) {
  const docs = await getAllPageContentsFromJSON(filename);

  const filetedDocs = docs.filter((doc) => doc.metadata.category === namespace);

  const splittedDocs = await confluenceSplitter({
    documents: filetedDocs,
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const pineconeIndex = pc.index("ecubelabs-knowledge");

  const vectorStore = await PineconeStore.fromDocuments(
    splittedDocs,
    embedOpenai("text-embedding-3-large"),
    {
      pineconeIndex,
      namespace,
    }
  );

  console.log("Vector store created", vectorStore);
}
