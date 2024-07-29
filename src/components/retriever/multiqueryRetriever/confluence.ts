import { PromptTemplate } from "@langchain/core/prompts";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { chatOpenai, embedOpenai } from "../../../libs/openai";
import { evaluateDocument } from "../../evaluator";

config();

export async function confluenceMultiQueryRetriever(
  query: string,
  index: string,
  namespace?: string
) {
  const llm = chatOpenai("gpt-4o-mini");

  const pc = new Pinecone();

  const pineconeIndex = pc.index(index);

  const vertorStore = await PineconeStore.fromExistingIndex(
    embedOpenai("text-embedding-3-large"),
    {
      pineconeIndex,
      namespace,
    }
  );

  const retriever = vertorStore.asRetriever({
    k: 1,
  });

  const multiqueryRetriever = MultiQueryRetriever.fromLLM({
    retriever,
    // @ts-expect-error
    llm,
    queryCount: 3,
    prompt: new PromptTemplate({
      inputVariables: ["question", "queryCount"],
      template: `
You are a query generator.
Given that you need to make accurate and relevant query, Generate {queryCount} sentences which are related the given context.
Your answer is for retrieving relevant documents from vector database.

Provide these alternative sentences separated by newlines between XML tags of 'questions'.

For example:
<context>
연차
</context>
<questions>
1. 연차 신청 방법
2. 연차 가이드
3. 연차 사용
</questions>

context:{question}`,
    }),
  });

  const documents = await multiqueryRetriever.invoke(query);

  return documents.reduce(
    (acc, doc, idx) =>
      acc +
      "\n" +
      `document ${idx + 1}: ${doc.pageContent}
       url: ${doc.metadata.url}
    `,
    ""
  );
}

export async function confluenceMultiQueryEvaluator(
  query: string,
  index: string,
  namespace?: string
) {
  const relatedDocs = await confluenceMultiQueryRetriever(
    query,
    index,
    namespace
  );
  const passOrRetrieve = await evaluateDocument(query, relatedDocs);

  return [relatedDocs, passOrRetrieve];
}

export async function multiQueryRAG(
  query: string,
  index: string,
  namespace?: string,
  retryNamespace: string = "all"
) {
  let [relatedDocs, passOrRetrieve] = await confluenceMultiQueryEvaluator(
    query,
    index,
    namespace
  );

  if (passOrRetrieve === "retrieve" && retryNamespace) {
    [relatedDocs, passOrRetrieve] = await confluenceMultiQueryEvaluator(
      query,
      index,
      retryNamespace
    );
  }

  return [relatedDocs, passOrRetrieve];
}
