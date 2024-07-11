import { Chroma } from "@langchain/community/vectorstores/chroma";
import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { type Document } from "langchain/document";

export async function confluenceEmbedder({
  documents,
  collectionName,
  embeddings,
}: {
  documents: Document[];
  collectionName: string;
  embeddings: EmbeddingsInterface;
}) {
  console.log("|");
  console.log(`| Start Embedding...`);
  console.log("|");
  await Chroma.fromDocuments(documents, embeddings, {
    collectionName,
    url: "http://localhost:8000",
  }).then(() => console.log("| Embedding Done!"));
}
