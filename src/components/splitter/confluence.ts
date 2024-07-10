import { type Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function confluenceSplitter({
  documents,
  chunkSize,
  chunkOverlap,
}: {
  documents: Document[];
  chunkSize: number;
  chunkOverlap: number;
}) {
  console.log("|");
  console.log("| Start Splitting...");
  console.log("|");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  return splitter.splitDocuments(documents);
}
