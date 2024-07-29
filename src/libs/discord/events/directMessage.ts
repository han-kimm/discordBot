import { Events, type Message } from "discord.js";
import { chatBot } from "../../../routes";

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;

    const initialResponse = await message.reply("응답을 생성 중입니다...");

    const response = await chatBot(message.content);

    await initialResponse.edit(response.content);
    // let responseContent = "";
    // let lastEditTime = Date.now();

    // for await (const chunk of response) {
    //   responseContent += chunk.content;

    //   // Discord.js는 websocket 연결이 안되어서, stream 방식 대신 0.250ms 간격으로 응답을 업데이트합니다.
    //   if (Date.now() - lastEditTime > 250) {
    //     await initialResponse.edit(responseContent || "...");
    //     lastEditTime = Date.now();
    //   }
    // }

    // // 스트림이 완료되면 최종 응답 전송
    // await initialResponse.edit(responseContent);
  },
};
