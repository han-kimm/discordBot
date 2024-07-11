import { confluenceMultiqueryRetriever } from "./components/retriever/multiqueryRetriever/confluence";

async function main() {}

async function query() {
  const relatedDocs = await confluenceMultiqueryRetriever(``);
  console.log(relatedDocs);
}
