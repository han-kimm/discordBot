import { Document } from "langchain/document";
import {
  getAllPageContents,
  getAllPageContentsFromJSON,
} from "../../libs/confluence";

export async function confluenceLoader(parentPageId: string) {
  console.log("|");
  console.log("| Start Confluence Page Loading...");
  console.log("|");
  const pageContents = await getAllPageContents(parentPageId);
  const documents = pageContents.map((embed) => {
    return new Document({
      pageContent: embed.pageContent,
      metadata: {
        url: embed.url,
      },
    });
  });

  return documents;
}

export async function confluencePrepLoader(fileName: string) {
  const pageContents = await getAllPageContentsFromJSON(fileName);
  const documents = pageContents.map((embed) => {
    return new Document({
      pageContent: embed.pageContent,
      metadata: {
        url: embed.url,
      },
    });
  });

  return documents;
}
