import { confluenceMultiqueryRetriever } from "./components/retriever/multiqueryRetriever/confluence";
import { confluenceSelfqueryRetriever } from "./components/retriever/selfqueryRetriever/confluence";

async function main() {
  const relatedDocs = await confluenceSelfqueryRetriever(
    "I want documents about 'component'"
  );
  console.log(relatedDocs);
}

main();

async function query() {
  const relatedDocs = await confluenceMultiqueryRetriever(``);
  console.log(relatedDocs);
}
