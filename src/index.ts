import * as fs from "fs/promises";
import path from "path";
import { getAllPageContentsFromJSON } from "./libs/confluence";
import { chatOpenai } from "./libs/openai";
import { embeddingPrompt } from "./prompts/embedding";

async function main() {
  const docs = await getAllPageContentsFromJSON(
    "confluenceDocuments-3571866.json"
  );
  console.log(docs.forEach((doc) => console.log(doc.metadata.category)));
  //   const newDocs = docs.map((doc) => {
  //     const category: string = doc.metadata.category;
  //     if (category.startsWith("<document>") || category.startsWith("<tool>")) {
  //       return {
  //         ...doc,
  //         metadata: {
  //           ...doc.metadata,
  //           category: category.split("\n").at(-1),
  //         },
  //       };
  //     }
  //     return doc;
  //   });

  //   await fs.writeFile(
  //     path.join(__dirname, "/assets/confluenceDocuments-3571866.json"),
  //     JSON.stringify(newDocs, null, 2)
  //   );
}

main();
