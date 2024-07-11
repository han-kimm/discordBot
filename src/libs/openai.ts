import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";

config();

const openAIApiKey = process.env.OPENAI_API_KEY;

export const chatOpenai = (modelName: "gpt-3.5-turbo" | "gpt-4o") =>
  new ChatOpenAI({
    openAIApiKey,
    modelName,
    temperature: 0,
  });

export const embedOpenai = (
  modelName: "text-embedding-3-small" | "text-embedding-3-large"
) =>
  new OpenAIEmbeddings({
    openAIApiKey,
    modelName,
  });
