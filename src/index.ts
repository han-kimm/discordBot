import { confluenceEnsembleRetriever } from "./components/retriever/ensembleRetriever/confluence";

async function main() {
  const relatedDocs = await confluenceEnsembleRetriever(
    "데이터 베이스 변경",
    "ecubelabs-test4",
    "confluencePageContents-40271993.json"
  );
  console.log(relatedDocs);
}

main();
