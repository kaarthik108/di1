import { ai } from "@/app/ai";
import { OpenAIStream } from "ai";
import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import type OpenAI from "openai";
import { twMerge } from "tailwind-merge";
import zodToJsonSchema from "zod-to-json-schema";
import { system } from "./prompt";
import { ToolDefinition } from "./tool-definition";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
);

const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
};

export function runOpenAICompletion<
  T extends Omit<
    Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
    "functions"
  > & {
    functions: ToolDefinition<any, any>[];
  }
>(openai: OpenAI, params: T) {
  let text = "";
  let hasFunction = false;

  type FunctionNames = T["functions"] extends Array<any>
    ? T["functions"][number]["name"]
    : never;

  let onTextContent: (text: string, isFinal: boolean) => void = () => {};

  let onFunctionCall: Record<string, (args: Record<string, any>) => void> = {};

  const { functions, ...rest } = params;

  (async () => {
    consumeStream(
      OpenAIStream(
        (await openai.chat.completions.create({
          ...rest,
          stream: true,
          functions: functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters) as Record<
              string,
              unknown
            >,
          })),
        })) as any,
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;
            onFunctionCall[
              functionCallPayload.name as keyof typeof onFunctionCall
            ]?.(functionCallPayload.arguments as Record<string, any>);
          },
          onToken(token) {
            text += token;
            if (text.startsWith("{")) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        }
      )
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: (
      name: FunctionNames,
      callback: (args: any) => void | Promise<void>
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// export function runWorkersAICompletion<
//   T extends Omit<
//     Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
//     "functions"
//   > & { functions: ToolDefinition<any, any>[] }
// >(openai: OpenAI, params: T) {
//   let text = "";
//   let hasFunction = false;
//   type FunctionNames = T["functions"] extends Array<any>
//     ? T["functions"][number]["name"]
//     : never;
//   let onTextContent: (text: string, isFinal: boolean) => void = () => {};
//   let onFunctionCall: Record<string, (args: Record<string, any>) => void> = {};

//   const { functions, ...rest } = params;

//   const fetchStream = async () => {
//     const res = await fetch("http://localhost:3000/api/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         modelId: "@hf/nousresearch/hermes-2-pro-mistral-7b",
//         options: {
//           messages: [
//             {
//               role: "system",
//               content: `
// You are a data analytics assistant specialized in SQLITE database. You can help users with sql queries or chat normally. REPLY IN JSON FORMAT only for the following function calls for normal chat you can reply with text content.

// Function parameters for query_data:
// {
//   "query": "Creates a sqlite SQL query based on the context and given query.",
//   "format": "The format of the result, which determines the type of chart to generate. Possible values: 'area', 'number', 'table', 'bar', 'line', 'donut', 'scatter'.",
//   "title": "The title for the chart, which is displayed prominently above the chart.",
//   "timeField": "Used for time series data, designating the column that represents the time dimension. This field is used as the x-axis in charts like area and bar (if the bar chart is time-based), and potentially as the x-axis in scatter charts.",
//   "categories": "An array of strings that represent the numerical data series names to be visualized on the chart for 'area', 'bar', and 'line' charts. These should correspond to fields in the data that contain numerical values to plot.",
//   "index": "For 'bar' and 'scatter' charts, this denotes the primary categorical axis or the x-axis labels. For time series bar charts, this can often be the same as timeField.",
//   "category": "The category field for scatter charts, defining how data points are grouped.",
//   "yaxis": "The field representing the y-axis value in scatter charts. (THIS IS REQUIRED FOR SCATTER CHARTS)",
//   "size": "The field representing the size of the data points in scatter charts. (THIS IS REQUIRED FOR SCATTER CHARTS)"
// }

// Always reply in the following format:

// If you want to show charts and tables: then use the following 'Schema1' format (do not give any explanation just reply with the json schema):

// Here's the json schema you must adhere to: (only one of the following schemas should be used)

// Schema1:

//   {
//   "onFunctionCall": "query_data",
//   "arguments": {
//     "query": "SELECT * FROM table_name",
//     "format": "table",
//     "title": "Chart Title",
//     "timeField": "date",
//     "categories": ["category1", "category2"],
//     "index": "index_field",
//     "category": "category_field",
//     "yaxis": "y_axis_field",
//     "size": "size_field"
//     }
//   }

// if you want to reply with text content, then use the following format:

// For text content just reply with the text: without any JSON schema.

// Schema2:

//  "Your text response goes here."

// For example, if user says "How are you", you can reply with the following text content STRING FORMAT:

//   "I'm doing great! How can I help you today?"

// For example, if the user asks to fetch data or display charts or graphs or if you think you can make any visuals, you should reply in this format without any other explanations STRICTLY JSON FORMAT:
// reply

//   {
//   "onFunctionCall": "query_data",
//   "arguments": {
//     "query": "SELECT * FROM table_name",
//     "format": "table",
//     "title": "Chart Title",
//     "timeField": "date",
//     "categories": ["category1", "category2"],
//     "index": "index_field",
//     "category": "category_field",
//     "yaxis": "y_axis_field",
//     "size": "size_field"
//     }
//   }

// If the user requests to fetch or query data, call \`query_data\` to query the data from the sqlite database and return the results. Besides that, you can also chat with users and do some calculations if needed.
// `,
//             },
//             ...rest.messages,
//           ],
//           stream: true,
//           functions: functions.map((fn) => ({
//             name: fn.name,
//             description: fn.description,
//             parameters: fn.parameters,
//           })),
//         },
//       }),
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! Status: ${res.status}`);
//     }

//     // Create a readable stream from the response body
//     const reader = res.body!.getReader();

//     // Create a function to read chunks from the stream
//     let jsonBuffer = "";

//     const readChunk = async () => {
//       const { done, value } = await reader.read();
//       if (done) {
//         // Streaming finished
//         if (!hasFunction) {
//           onTextContent(text, true);
//         }
//         return;
//       }

//       // Decode the chunk as text
//       const chunk = new TextDecoder("utf-8").decode(value);

//       // Accumulate the chunk in the JSON buffer
//       jsonBuffer += chunk;
//       console.log("jsonBuffer", jsonBuffer);

//       // remove the <|im_end|> tag from the end of the text
//       let newbuff = jsonBuffer.replace(/<\|im_end\|>$/, "");

//       // Check if the JSON buffer contains a complete JSON  object
//       try {
//         if (newbuff.startsWith("{")) {
//           const parsedData = JSON.parse(newbuff);
//           console.log("parsedData", parsedData);

//           if (parsedData.onFunctionCall) {
//             hasFunction = true;
//             onFunctionCall[
//               parsedData.onFunctionCall as keyof typeof onFunctionCall
//             ]?.(parsedData.arguments as Record<string, any>);
//             jsonBuffer = ""; // Reset the JSON buffer
//             return;
//           }
//         } else {
//           text += newbuff;
//           onTextContent(text, false);
//           jsonBuffer = ""; // Reset the JSON buffer
//         }
//       } catch (error) {
//         // Incomplete JSON, check if it's a function call
//         if (newbuff.includes('"onFunctionCall":')) {
//           // Skip appending the chunk to the text variable
//         } else {
//           // Accumulate as text content
//           text += newbuff;

//           // Remove the <|im_end|> tag from the end of the text
//           text = text.replace(/<\|im_end\|>$/, "");
//           onTextContent(text, false);
//           jsonBuffer = ""; // Reset the JSON buffer
//         }
//       }

//       // Read the next chunk
//       await readChunk();
//     };
//     // Start reading chunks from the stream
//     await readChunk();
//   };

//   (async () => {
//     await fetchStream();
//   })();

//   return {
//     onTextContent: (
//       callback: (text: string, isFinal: boolean) => void | Promise<void>
//     ) => {
//       onTextContent = callback;
//     },
//     onFunctionCall: (
//       name: FunctionNames,
//       callback: (args: any) => void | Promise<void>
//     ) => {
//       onFunctionCall[name] = callback;
//     },
//   };
// }
