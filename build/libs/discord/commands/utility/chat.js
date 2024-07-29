"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const openai_1 = require("../../../openai");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("chat")
        .setDescription("talk with the chatGPT")
        .addStringOption((option) => option
        .setName("질문")
        .setDescription("chatGPT에게 물어볼 질문을 입력해주세요.")
        .setRequired(true)),
    async execute(interaction) {
        const userQuestion = interaction.options.get("질문");
        const llm = (0, openai_1.chatOpenai)("gpt-4o-mini");
        const stream = await llm.invoke(`SHOULD ANSWER SIMPLY.${userQuestion?.value}`);
        await interaction.reply(stream.content);
    },
};
