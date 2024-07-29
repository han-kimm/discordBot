import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
import { embedOpenai } from "./libs/openai";
import { getAllPageContentsFromJSON } from "./libs/confluence";
import { confluenceSplitter } from "./components/splitter/confluence";

config();

async function main() {
  const docs = await getAllPageContentsFromJSON(
    "confluenceDocuments-3571866.json"
  );

  const filetedDocs = docs.filter((doc) => doc.metadata.category === "archive");

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
      namespace: "archive",
    }
  );

  console.log("Vector store created", vectorStore);
}
