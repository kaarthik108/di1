import "server-only";

import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";

import { ChartWrapper } from "@/components/ChartWrapper";
import { BotCard, BotMessage, UserMessage } from "@/components/message";
import { spinner } from "@/components/ui/spinner";
import { getContext } from "@/lib/context";
import { nanoid } from "@/lib/utils";
import { querySchema } from "@/lib/validation";
import { OpenAI } from "@ai-sdk/openai";
import { Message, experimental_streamText } from "ai";
import { z } from "zod";
import { Chat, saveChat } from "./actions";

type WokersAIQueryResponse = z.infer<typeof querySchema>;
function isMessage(obj: any): obj is Message {
  return (
    obj &&
    typeof obj.id === "string" &&
    (obj.role === "user" || obj.role === "assistant") &&
    typeof obj.content === "string"
  );
}
export interface QueryResult {
  columns: string[];
  data: Array<{ [key: string]: any }>;
}
interface _Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}
const openai = new OpenAI({
  baseUrl: `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/cfd/openai`,
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(content: string) {
  "use server";
  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: `${aiState.get().interactions.join("\n\n")}\n\n${content}`,
      },
    ],
  });

  const history = aiState.get().messages.map((message: any) => ({
    role: message.role,
    content: message.content,
  }));

  const textStream = createStreamableValue("");
  const spinnerStream = createStreamableUI(<BotCard>{spinner}</BotCard>);
  // const skeletonStream = createStreamableUI(<AreaSkeleton />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  const getDDL = await getContext(content);

  (async () => {
    try {
      const result = await experimental_streamText({
        model: openai.chat("gpt-4o"),
        temperature: 0,
        tools: {
          query_data: {
            description:
              "Query the data from the sqlite database and return the results.",
            parameters: querySchema,
          },
        },
        system: `
You are a Sqlite data analytics assistant. You can help users with sql queries and you can help users query their data with only using Sqlite sql syntax. Based on the context provided about Sqlite DDL schema details, you can help users with their queries.
You and the user can discuss their events and the user can request to create new queries or refine existing ones, in the UI.

Always use proper aliases for the columns and tables in the queries. For example, instead of using "select * from table_name", use "select column_name as alias_name from table_name as alias_name".

Messages inside [] means that it's a UI element or a user event. For example:
- "[Results for query: query with format: format and title: title and description: description. with data" means that a chart/table/number card is shown to that user.

Context: (DDL schema details) \n

${getDDL}

\n

If the user requests to fetch or query data, call \`query_data\` to query the data from the Sqlite database and return the results.

Besides that, you can also chat with users and do some calculations if needed.
      `,
        messages: [...history],
      });

      let textContent = "";
      spinnerStream.done(null);

      for await (const delta of result.fullStream) {
        const { type } = delta;

        if (type === "text-delta") {
          const { textDelta } = delta;

          textContent += textDelta;

          messageStream.update(<BotMessage content={textContent} />);

          // aiState.update({
          //   ...aiState.get(),
          //   messages: [
          //     ...aiState.get().messages,
          //     {
          //       id: "1",
          //       role: "assistant",
          //       content: textContent,
          //     },
          //   ],
          // });

          aiState.done({
            ...aiState.get(),
            interactions: [],
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: textContent,
              },
            ],
          });
        } else if (type === "tool-call") {
          const { toolName, args } = delta;

          if (toolName === "query_data") {
            const {
              format,
              title,
              timeField,
              categories,
              index,
              yaxis,
              size,
              query,
            } = args;
            console.log("args", args);

            uiStream.update(
              <BotCard>
                <ChartWrapper props={args} />
              </BotCard>
            );

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "assistant",
                  content: `[Sqlite query results for code: ${query} and chart format: ${format} with categories: ${categories} and data index: ${index} and yaxis: ${yaxis} and size: ${size}]`,
                  display: {
                    name: "query_data",
                    props: args,
                  },
                },
              ],
            });
          }
        }
      }
      const ms = aiState.get().messages;
      const id = aiState.get().chatId;
      // @ts-ignore
      const latestMessages: _Message[] = Array.from(
        new Map(
          ms.filter(isMessage).map((msg: Message) => [msg.role, msg])
        ).values()
      );

      let title = "";
      if (ms.length > 0 && ms[0].content) {
        title = ms[0].content.substring(0, 100);
      }

      await saveChat({
        id,
        title,
        messages: latestMessages,
        path: `/chat/${id}`,
        userId: "test",
      });

      uiStream.done();
      textStream.done();
      messageStream.done();
    } catch (e) {
      console.error(e);

      const error = new Error("The AI got into some problem.");
      uiStream.error(error);
      textStream.error(error);
      messageStream.error(error);
      // @ts-ignore
      aiState.done();
    }
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value,
  };
}

// export type Message = {
//   role: "user" | "assistant" | "system" | "function" | "data" | "tool";
//   content: string;
//   id?: string;
//   name?: string;
//   display?: {
//     name: string;
//     props: Record<string, any>;
//   };
// };

export type AIState = {
  chatId: string;
  interactions?: string[];
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] },
  unstable_onGetUIState: async () => {
    "use server";

    const aiState = getAIState();

    if (aiState) {
      const uiState = getUIStateFromAIState(aiState);

      return uiState;
    }
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message: any, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "assistant" /** @ts-ignore */ ? (
          message.display?.name === "query_data" ? (
            <BotCard>
              <ChartWrapper props={message.display.props} />
            </BotCard>
          ) : (
            <BotMessage content={message.content} />
          )
        ) : message.role === "user" ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        ),
    }));
};
