import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { appendFile, readFile } from "fs/promises";
import { join } from "path";
import { chatOpenai } from "../../../libs/openai";

export async function makeMetadata() {
  const llm = chatOpenai("gpt-3.5-turbo");

  const templates = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You're a strict and perfect developer. "relatedTechnology" means a relevant library or framework of the document if it is not, it is empty "". "keyword" is what the document is described for. "isDeprecated" is a value of whether the document is deprecated. You must always return JSON format like this <example> "relatedTechnology": <list>, "keyword": <list>, "isDeprecated": <boolean> </example>. Ensure all result must be english.`,
    ],
    ["user", "given document: {document}"],
  ]);

  const jsonParser = new JsonOutputParser();

  const chain = templates.pipe(llm).pipe(jsonParser);

  const jsonfiles: { pageContent: string; url: string }[] = JSON.parse(
    await readFile(
      join(__dirname, "./assets/confluencePageContents-40271993.json"),
      "utf-8"
    )
  ).filter((json: any) => json.pageContent.length > 100);

  console.log("AI response start.");
  let index = 55;
  while (index < jsonfiles.length) {
    console.log(`| current Index : ${index}`);
    const current = jsonfiles.slice(index, index + 5);
    index += 5;

    const result = await chain.batch(
      current.map((json) => ({ document: json.pageContent }))
    );

    await appendFile(
      join(__dirname, "./assets/confluenceDocuments-40271993.json"),
      JSON.stringify(
        result.map((r, i) => ({
          pageCotent: current[i].pageContent,
          metadata: { url: current[i].url, ...r },
        })),
        null,
        2
      )
    );
  }
}
