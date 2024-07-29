import { confluenceMultiqueryRetriever } from "../components/retriever/multiqueryRetriever/confluence";
import { chatOpenai } from "../libs/openai";

export default {
  "how-to": {
    async route(input: string) {
      const relatedDocs = await confluenceMultiqueryRetriever(
        input,
        "ecubelabs-knowledge",
        "how-to"
      );

      const llm = chatOpenai("gpt-4o");
      const response = await llm.invoke([
        [
          "system",
          `You are a kind guide bot. You should help the user to answer how to do something.`,
        ],
        [
          "user",
          `
          <instruction>
          Answer the question with <relatedDocs>.
          When you can answer with <relatedDocs>, you must leave a url of the document.
          When you think <relatedDocs> is unrelated, you can request another related document, just answer "retrieve".
          Should answer in markdown format of discord. Answer must be less than 500 characters.
          </instruction>

          <example>
          <relatedDocs>
          document: "연차 신청 가이드\n\n3일 이상 휴가를 가거나 당일에 긴급하게 휴가를 사용하는 경우 SW팀 디스코드 채널에도 공지한다.\n\n\n\n * 연차 지급 기준\n * 연차 신청\n * 반차 사용에 대한 QnA\n * 연차 신청 상세\n * 개인별 연차일수\n * 병가\n * 대체 근무/휴무\n * 연차 촉진 제도의 이해\n\n\n연차 지급 기준\n\n이큐브랩은 회계연도를 기준으로 연차를 지급/집계하고 있습니다.\n\n기준에 관해\n\n입사일 기준은 입사일을 기준으로 만 1년씩 근속년수가 증가할 때 마다 연차를 지급하는 것이고, 회계연도 기준은 다음해 1월 1일날 일괄적으로\n연차를 지급하는 방식입니다.\n\n\n연차 신청\n\n * 이큐브랩 정책대로, 자신에게 지급된 잔여 연차일수 만큼 사용할 수 있습니다.\n\n * 팀원 및 협업 인원들에게 관련하여 사전에 공유하고, 스케줄 확인/조정 후 신청.\n\n * 연차는 1일 차감, 반차는 0.5일 차감.\n\n * 반차 사용시 4시간 근무가 기준이 되며, 기본적으로 오전 반차는 15시 퇴근, 오후 반차는 15시 출근입니다.\n   \n   * 시간 조정이 필요한 경우, 팀과 HR\n     [https://ecubelabs.atlassian.net/people/team/b46e3d9f-dc20-4bd7-9cb4-3e0ac85aa092]에\n     보고 필수.\n\n\n반차 사용에 대한 QNA\n\n[https://ecubelabs.atlassian.net/wiki/download/attachments/143589389/%E3%85%8E%E3%85%8E.jpg?api=v2]\n\n * 현재(2021. 7. 1. )까지 각 팀별 미리 합의가 되어 있던 경우, 스웍을 하여 9시 출근하였을 때 점심을 먹지 않고 1시까지 근무\n   후 퇴근이 가능하였습니다. 하지만 이는, 4시간 마다 30분의 휴게 시간을 보장해야 함 + 점심시간에 근무를 시켜서는 안된다는 근로기준법에\n   저촉된다는 사실을 간과한 경우였습니다. * 저희의 점심시간은 12시 30분 ~ 1시 30분이니까요..\n\n * 하여 앞으로는 9시 출근 시, 14시 퇴근 / 10시 출근 시, 15시 퇴근을 확실하게 정해두고자 합니다.\n\n * 3번 질문에 대한 답변은, 8시간 내리 근무를 한다면 휴게 시간을 지급하지 않은 결과를 초래하기 때문에 사용자가 처벌을 받게 되므로\n   불가함을 알려드립니다.\n\n * [Q&A] 경영지원\n   [https://ecubelabs.atlassian.net/wiki/spaces/EL/pages/204440420/Q+A]\n\n\n연차 신청 상세\n\n * 2021. 7. 1. 부로 커먼스페이스로 연차를 신청합니다.\n\n * 근태 관리 시스템 도입 - 원티드 스페이스 사용 매뉴얼\n   [https://ecubelabs.atlassian.net/wiki/spaces/HR/pages/1930493982/-]\n   \n   * 참고하여 연차를 신청해주세요!\n\n\n개인별 연차일수\n\n * 자신의 연차일수가 궁금하시면 HR\n   [https://ecubelabs.atlassian.net/people/team/b46e3d9f-dc20-4bd7-9cb4-3e0ac85aa092]으로\n   문의주시기 바랍니다.\n\n\n병가\n\n * 연차로 사용하는 병가는 연차에서 차감됩니다. 유급 휴가로 적용.\n\n * 병가의 경우, 1년 중 30일 이내로 병가를 신청할 수 있으며, 이는 무급 휴가로 적용된다. 무급 휴가의 신청은 입원 증빙, 전문의 진단서\n   제출(사후 제출 가능) 필요.\n\n * 이외의 병가는 통상적으로 연차를 먼저 소진하며, 병가가 연차 일수를 초과하게 될 경우엔 무급휴가(병가)로 적용합니다.\n\n * 팀장 및 HR\n   [https://ecubelabs.atlassian.net/people/team/b46e3d9f-dc20-4bd7-9cb4-3e0ac85aa092]과\n   사전 상의 필요.\n\n\n대체 근무/휴무\n\n * 공휴일, 주말 등 휴일에 자발적인 사유가 아닌 일정(회사의 공식일정, 전시회 등)으로 근무를 하게 될 경우, 사전에 협의한 부분에 대해서\n   대체 휴무를 지급합니다.\n\n * 이 때 근무해야하는 일정에 앞서, HR\n   [https://ecubelabs.atlassian.net/people/team/b46e3d9f-dc20-4bd7-9cb4-3e0ac85aa092]과 상의하여\n   인정되는 대체 휴무의 일수를 논의해야 합니다.\n\n * 사전에 상의 후 대체 휴가 지급이 가능하기 때문에, 먼저 꼭 논의 부탁드립니다.\n   \n   * 논의 된 대체 휴가는 커먼스페이스 - 연차 신청(대체휴가)로 신청합니다.\n     \n\n\n연차 촉진 제도의 이해\n\n 제61조(연차 유급휴가의 사용 촉진) ① 사용자가 제60조제1항ㆍ제2항 및 제4항에 따른 유급휴가(계속하여 근로한 기간이 1년 미만인\n근로자의 제60조제2항에 따른 유급휴가는 제외한다)의 사용을 촉진하기 위하여 다음 각 호의 조치를 하였음에도 불구하고 근로자가 휴가를 사용하지\n아니하여 제60조제7항 본문에 따라 소멸된 경우에는 사용자는 그 사용하지 아니한 휴가에 대하여 보상할 의무가 없고, 제60조제7항 단서에 따른\n사용자의 귀책사유에 해당하지 아니하는 것으로 본다.  <개정 2012. 2. 1., 2017. 11. 28., 2020. 3. 31.>\n\n 1. 제60조제7항 본문에 따른 기간이 끝나기 6개월 전을 기준으로 10일 이내에 사용자가 근로자별로 사용하지 아니한 휴가 일수를 알려주고,\n    근로자가 그 사용 시기를 정하여 사용자에게 통보하도록 서면으로 촉구할 것\n\n 1. 제1호에 따른 촉구에도 불구하고 근로자가 촉구를 받은 때부터 10일 이내에 사용하지 아니한 휴가의 전부 또는 일부의 사용 시기를 정하여\n    사용자에게 통보하지 아니하면 제60조제7항 본문에 따른 기간이 끝나기 2개월 전까지 사용자가 사용하지 아니한 휴가의 사용 시기를 정하여\n    근로자에게 서면으로 통보할 것\n\n② 사용자가 계속하여 근로한 기간이 1년 미만인 근로자의 제60조제2항에 따른 유급휴가의 사용을 촉진하기 위하여 다음 각 호의 조치를 하였음에도\n불구하고 근로자가 휴가를 사용하지 아니하여 제60조제7항 본문에 따라 소멸된 경우에는 사용자는 그 사용하지 아니한 휴가에 대하여 보상할 의무가\n없고, 같은 항 단서에 따른 사용자의 귀책사유에 해당하지 아니하는 것으로 본다.  <신설 2020. 3. 31.>\n\n 1. 최초 1년의 근로기간이 끝나기 3개월 전을 기준으로 10일 이내에 사용자가 근로자별로 사용하지 아니한 휴가 일수를 알려주고, 근로자가 그\n    사용 시기를 정하여 사용자에게 통보하도록 서면으로 촉구할 것. 다만, 사용자가 서면 촉구한 후 발생한 휴가에 대해서는 최초 1년의\n    근로기간이 끝나기 1개월 전을 기준으로 5일 이내에 촉구하여야 한다.\n\n 1. 제1호에 따른 촉구에도 불구하고 근로자가 촉구를 받은 때부터 10일 이내에 사용하지 아니한 휴가의 전부 또는 일부의 사용 시기를 정하여\n    사용자에게 통보하지 아니하면 최초 1년의 근로기간이 끝나기 1개월 전까지 사용자가 사용하지 아니한 휴가의 사용 시기를 정하여 근로자에게\n    서면으로 통보할 것. 다만, 제1호 단서에 따라 촉구한 휴가에 대해서는 최초 1년의 근로기간이 끝나기 10일 전까지 서면으로 통보하여야\n    한다.\n\n"
          url: "https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/875135056"
          </relatedDocs>
          question: 연차 신청 방법
          answer: 원티드 커먼스페이스에서 신청해 주세요.\n
          반차 신청시 출퇴근 기준은 15시입니다. 오전 반차는 15시 퇴근, 오후 반차는 15시 출근.\n
          개인별 연차 일수 및 시간 조정은 [HR팀]('https://ecubelabs.atlassian.net/people/team/b46e3d9f-dc20-4bd7-9cb4-3e0ac85aa092')에 문의해 주세요.\n\n
          [관련 Confluence 문서]('https://ecubelabs.atlassian.net/wiki/spaces/SW/pages/875135056')
          </example>

          <relatedDocs>
          ${relatedDocs}
          </relatedDocs>
          question: ${input}`,
        ],
      ]);

      if (response.content === "retrieve") {
        const newRelatedDocs = await confluenceMultiqueryRetriever(
          input,
          "ecubelabs-knowledge"
        );
        const response = await llm.invoke([
          ["system", `You are a kind guide bot.`],
          [
            "user",
            `
          <instruction>
          Answer the question with <relatedDocs>.
          When you think <relatedDocs> is unrelated, you can request another related document, just answer "retrieve".
          Should answer in markdown format of discord. Answer must be less than 500 characters.
          </instruction>
          <relatedDocs>
          ${newRelatedDocs}
          </relatedDocs>

          question: ${input}`,
          ],
        ]);

        return response;
      }

      return response;
    },
    description: "how to do something",
  },
};
