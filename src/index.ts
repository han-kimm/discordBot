import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
import { embedOpenai } from "./libs/openai";
import { getAllPageContentsFromJSON } from "./libs/confluence";
import { confluenceSplitter } from "./components/splitter/confluence";
import { confluenceMultiqueryRetriever } from "./components/retriever/multiqueryRetriever/confluence";

config();

async function main() {
  const docs = await confluenceMultiqueryRetriever(
    "연차",
    "ecubelabs-knowledge",
    "reference"
  );
  console.log(docs);
}
