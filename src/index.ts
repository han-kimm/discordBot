import { ensembleRetriever } from "./components/rag/ensembleRetriever";
import { chatOpenai } from "./libs/openai";

async function main() {
  const retrivedDocs = await ensembleRetriever(
    __dirname.split("components")[0] +
      "/assets/confluencePageContents-40271993.json",
    "CRUD convention in frontend development"
  );

  console.log("=".repeat(100));

  console.log(retrivedDocs);
}
