import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";

config();

const openAIApiKey = process.env.OPENAI_API_KEY;

export const chatOpenai = (modelName: string) =>
  new ChatOpenAI({
    openAIApiKey,
    modelName,
  });

export const embedOpenai = (modelName: string) =>
  new OpenAIEmbeddings({
    openAIApiKey,
    modelName,
  });
