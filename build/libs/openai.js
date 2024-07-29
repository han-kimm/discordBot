"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedOpenai = exports.chatOpenai = void 0;
const openai_1 = require("@langchain/openai");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const openAIApiKey = process.env.OPENAI_API_KEY;
const chatOpenai = (modelName) => new openai_1.ChatOpenAI({
    openAIApiKey,
    modelName,
    topP: 1,
});
exports.chatOpenai = chatOpenai;
const embedOpenai = (modelName) => new openai_1.OpenAIEmbeddings({
    openAIApiKey,
    modelName,
});
exports.embedOpenai = embedOpenai;
