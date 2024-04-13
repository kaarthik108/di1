import "server-only";

import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";

import { runOpenAICompletion } from "@/lib/utils";
import { Code } from "bright";

import { Chart } from "@/components/llm-charts";
import AreaSkeleton from "@/components/llm-charts/AreaSkeleton";
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage,
} from "@/components/message";
import { spinner } from "@/components/ui/spinner";
import { getContext } from "@/lib/context";
import { nanoid } from "@/lib/utils";
import { querySchema } from "@/lib/validation";
import { OpenAI } from "@ai-sdk/openai";
import { Message, experimental_streamText } from "ai";
import { format as sql_format } from "sql-formatter";
import { z } from "zod";
import { Chat, executeD1, saveChat } from "./actions";

type WokersAIQueryResponse = z.infer<typeof querySchema>;

export interface QueryResult {
  columns: string[];
  data: Array<{ [key: string]: any }>;
}

const openai = new OpenAI({
  // baseUrl: `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_TAG}/snowbrain/openai`,
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
        model: openai.chat("gpt-4-turbo"),
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

          aiState.update({
            ...aiState.get(),
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
            console.log("Query data tool call", args);

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

            const format_query = sql_format(query, { language: "sql" });

            const res = await executeD1(format_query);
            const columns = Object.keys(res[0]);
            const data = res.map((row) => Object.values(row));

            const compatibleQueryResult: QueryResult = {
              columns: columns,
              data: data,
            };

            uiStream.update(
              <BotCard>
                <div>
                  <Chart
                    chartType={format}
                    queryResult={compatibleQueryResult}
                    title={title}
                    timeField={timeField}
                    categories={categories || []}
                    index={index}
                    yaxis={yaxis}
                    size={size}
                  />
                  <div className="py-4 whitespace-pre-line">
                    <Code lang="sql" className="text-xs md:text-md">
                      {format_query}
                    </Code>
                  </div>
                </div>
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
                  content: `[Sqlite query results for code: ${query} and chart format: ${format} with categories: ${categories} and data ${columns} ${data}]`,
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
  unstable_onSetAIState: async ({ state }) => {
    "use server";

    const { chatId, messages } = state;

    const title = messages[0].content.substring(0, 100);
    const path = `/chat/${chatId}`;
    const chat: Chat = {
      id: chatId,
      title,
      messages,
      path,
      userId: "test",
    };
    await saveChat(chat);
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "assistant" /** @ts-ignore */ ? (
          message.display?.name === "query_data" ? (
            <BotCard>
              {/* @ts-ignore */}
              <Chart {...message.display.props} />
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
