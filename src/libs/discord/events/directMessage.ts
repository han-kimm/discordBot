import { Events, type Message } from "discord.js";
import { chatRouter } from "../../../route";

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;

    const response = await chatRouter(message.content);

    console.log(response);
    await message.reply(response);
  },
};
