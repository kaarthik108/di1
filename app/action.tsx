import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";

import { runWorkersAICompletion } from "@/lib/utils";
import { Code } from "bright";

import { Chart } from "@/components/llm-charts";
import AreaSkeleton from "@/components/llm-charts/AreaSkeleton";
import { BotCard } from "@/components/message";
import { spinner } from "@/components/ui/spinner";
import { getContext } from "@/lib/context";
import { nanoid } from "@/lib/utils";
import { querySchema } from "@/lib/validation";
import { format as sql_format } from "sql-formatter";
import { z } from "zod";
import { executeD1, saveChat } from "./actions";

type WokersAIQueryResponse = z.infer<typeof querySchema>;

export interface QueryResult {
  columns: string[];
  data: Array<{ [key: string]: any }>;
}

async function submitUserMessage(content: string) {
  "use server";
  const aiState = getMutableAIState();
  const uiStream = createStreamableUI();

  //   aiState.update([
  //     ...aiState.get(),
  //     {
  //       role: "user",
  //       content,
  //     },
  //   ]);
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
  const history = aiState.get().messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  const reply = createStreamableUI(<BotCard>{spinner}</BotCard>);

  const getDDL = await getContext(content);

  const completion = runWorkersAICompletion({
    model: "@hf/nousresearch/hermes-2-pro-mistral-7b",
    messages: [
      {
        role: "system",
        content: `\\ You are a data analytics assistant specialized in SQLITE database. You can help users with sql queries and you can help users query their data with only using sqlite sql syntax. Based on the context provided about sqlite DDL schema details, you can help users with their queries. You and the user can discuss their events and the user can request to create new queries or refine existing ones, in the UI. Always use proper aliases for the columns and tables in the queries. For example, instead of using "select \* from table\_name", use "select column\_name as alias\_name from table\_name as alias\_name". Messages inside \[\] means that it's a UI element or a user event. For example: - "\[Results for query: query with format: format and title: title and description: description. with data" means that a chart/table/number card is shown to that user. Context: (DDL schema details) \\n ${getDDL} \\n If the user requests to fetch or query data, call \\\`query\_data\\\` to query the data from the sqlite database and return the results. Besides that, you can also chat with users and do some calculations if needed.`,
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
  });

  completion.onTextContent((content: string, isFinal: boolean) => {
    console.log(content);
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "assistant",
          content: content,
        },
      ],
    });
    reply.update(<BotCard>{content}</BotCard>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  completion.onFunctionCall(
    "query_data",
    async (input: WokersAIQueryResponse) => {
      console.log("onFunctionCall", input);

      reply.update(
        <BotCard>
          <AreaSkeleton />
        </BotCard>
      );
      const {
        format,
        title,
        timeField,
        categories,
        index,
        yaxis,
        size,
        query,
      } = input;

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
              categories={categories}
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
            content: `Snowflake query results for code: ${query} and chart format: ${format} with categories: ${categories}. \n\n ${input}.`,
            display: {
              name: "query_data",
              props: input,
            },
          },
        ],
      });
      reply.done(
        <BotCard>
          <div>
            <Chart
              chartType={format}
              queryResult={compatibleQueryResult}
              title={title}
              timeField={timeField}
              categories={categories}
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

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "query_data",
          content: `[Snowflake query results for code: ${query} and chart format: ${format} with categories: ${categories} and data ${columns} ${data}]`,
        },
      ]);
    }
  );
  uiStream.done();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    display: reply.value,
  };
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

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
  unstable_onSetAIState: async ({ state }) => {
    "use server";
    const { chatId, messages } = state;

    console.log(messages, chatId);

    //  await saveChat(messages);
  },
});
