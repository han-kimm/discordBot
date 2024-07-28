import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import { chatOpenai } from "../../../openai";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("talk with the chatGPT")
    .addStringOption((option) =>
      option
        .setName("질문")
        .setDescription("chatGPT에게 물어볼 질문을 입력해주세요.")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const userQuestion = interaction.options.get("질문");

    const llm = chatOpenai("gpt-4o-mini");

    const stream = await llm.invoke(
      `SHOULD ANSWER SIMPLY.${userQuestion?.value}`
    );

    await interaction.reply(stream.content as string);
  },
};
