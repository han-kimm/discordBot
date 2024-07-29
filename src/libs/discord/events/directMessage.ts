import { Events, type Message } from "discord.js";
import { triggerRouter } from "../../../routes";

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.author.bot) return;

    let initialResponse = await message.reply("답변 중입니다...");
    const ctx = {
      query: message.content,
      route: "",
      onRouteSuccess: async () => {
        initialResponse = await initialResponse.edit(
          `질문을 \`${ctx.route}\`로 분류하고 있습니다.`
        );
      },
      onRetrieveStart: () => {
        initialResponse.edit("관련 문서를 찾는 중입니다...");
      },
      onLLMStart: () => {
        initialResponse.edit("문서를 토대로 답변을 생성 중입니다...");
      },
      onRetrieveFail: () => {
        const errorMessage = {
          content: `관련 문서가 발견되지 않았습니다.\n관련 문서가 없으면 답변이 불가능합니다.\n\n\`영어로 질문을 입력\`하는 것도 좋은 방법입니다.`,
        };
        return new ReadableStream({
          start(controller) {
            controller.enqueue(errorMessage);
            controller.close();
          },
        });
      },
    };

    try {
      const response = await triggerRouter(ctx);

      let responseContent = "";
      let lastEditTime = Date.now();

      for await (const chunk of response) {
        responseContent += chunk.content;

        // Discord.js는 websocket 연결이 안되어서, stream 방식 대신 0.250ms 간격으로 응답을 업데이트합니다.
        if (Date.now() - lastEditTime > 250) {
          await initialResponse.edit(responseContent || "...");
          lastEditTime = Date.now();
        }
      }

      // 스트림이 완료되면 최종 응답 전송
      await initialResponse.edit(responseContent);
    } catch (e) {
      console.error(e);
    }
  },
};
