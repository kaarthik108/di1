import "server-only";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";

import { runOpenAICompletion } from "@/lib/utils";
import { Code } from "bright";

import { Chart } from "@/components/llm-charts";
import AreaSkeleton from "@/components/llm-charts/AreaSkeleton";
import { BotCard } from "@/components/message";
import { spinner } from "@/components/ui/spinner";
import { getContext } from "@/lib/context";
import { nanoid } from "@/lib/utils";
import { querySchema } from "@/lib/validation";
import OpenAI from "openai";
import { format as sql_format } from "sql-formatter";
import { z } from "zod";
import { executeD1, saveChat } from "./actions";

type WokersAIQueryResponse = z.infer<typeof querySchema>;

export interface QueryResult {
  columns: string[];
  data: Array<{ [key: string]: any }>;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  //   baseURL: `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_TAG}/snowbrain/openai`,
});

async function submitUserMessage(content: string) {
  "use server";
  const aiState = getMutableAIState<typeof AI>();

  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(<BotCard>{spinner}</BotCard>);

  const getDDL = await getContext(content);

  const completion = runOpenAICompletion(openai, {
    model: "gpt-3.5-turbo",
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
    stream: true,
    functions: [
      {
        name: "query_data",
        description:
          "Query the data from the sqlite database and return the results.",
        parameters: querySchema,
      },
    ],
    temperature: 0,
  });
  completion.onTextContent((content: string, isFinal: boolean) => {
    reply.update(<BotCard>{content}</BotCard>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  completion.onFunctionCall(
    "query_data",
    async (input: WokersAIQueryResponse) => {
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

  return {
    id: nanoid(),
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

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
  unstable_onSetAIState: async ({ state }) => {
    "use server";
    const lastMessage = state[state.length - 1];
    await saveChat(lastMessage);
  },
});
