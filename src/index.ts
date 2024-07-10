import { confluenceEnsembleRetriever } from "./components/retriever/ensembleRetriever/confluence";
import { confluenceMultiqueryRetriever } from "./components/retriever/multiqueryRetriever/confluence";

async function main() {
  const multiquery = await confluenceMultiqueryRetriever("frontend components");
  console.log(multiquery);
}

main();
