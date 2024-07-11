import { confluenceMultiqueryRetriever } from "./components/retriever/multiqueryRetriever/confluence";
import { chatOpenai } from "./libs/openai";

async function main() {
  const relatedDocs = await confluenceMultiqueryRetriever(
    `file name : apps/back-office-front/src/app/components/AddStatementOfAccountInvoiceDialog/AddStatementOfAccountInvoiceDialog.tsx`
  );
  console.log(relatedDocs);
}

main();

async function chat() {
  const llm = chatOpenai("gpt-3.5-turbo");
  const response = await llm.invoke([
    [
      "system",
      `You are a good AI developer. Answer must always be based on given file name. you can't lie.
    Generate 3 keyword based on the given file name. the keywords will be used for searching relevant documents in company's database.`,
    ],
    [
      "user",
      `file name : apps/back-office-front/src/app/components/AddStatementOfAccountInvoiceDialog/AddStatementOfAccountInvoiceDialog.tsx`,
    ],
  ]);
  console.log(response.content);
}
