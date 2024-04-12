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

// export function runOpenAICompletion<
//   T extends Omit<
//     Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
//     "functions"
//   > & {
//     functions: ToolDefinition<any, any>[];
//   }
// >(openai: OpenAI, params: T) {
//   let text = "";
//   let hasFunction = false;

//   type FunctionNames = T["functions"] extends Array<any>
//     ? T["functions"][number]["name"]
//     : never;

//   let onTextContent: (text: string, isFinal: boolean) => void = () => {};

//   let onFunctionCall: Record<string, (args: Record<string, any>) => void> = {};

//   const { functions, ...rest } = params;

//   (async () => {
//     consumeStream(
//       OpenAIStream(
//         (await openai.chat.completions.create({
//           ...rest,
//           stream: true,
//           functions: functions.map((fn) => ({
//             name: fn.name,
//             description: fn.description,
//             parameters: zodToJsonSchema(fn.parameters) as Record<
//               string,
//               unknown
//             >,
//           })),
//         })) as any,
//         {
//           async experimental_onFunctionCall(functionCallPayload) {
//             hasFunction = true;
//             onFunctionCall[
//               functionCallPayload.name as keyof typeof onFunctionCall
//             ]?.(functionCallPayload.arguments as Record<string, any>);
//           },
//           onToken(token) {
//             text += token;
//             if (text.startsWith("{")) return;
//             onTextContent(text, false);
//           },
//           onFinal() {
//             if (hasFunction) return;
//             onTextContent(text, true);
//           },
//         }
//       )
//     );
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

export function runWorkersAICompletion<
  T extends Omit<Parameters<typeof fetch>[1], "body"> & {
    model: string;
    messages: any[];
  }
>(params: T) {
  let text = "";
  let hasFunction = false;
  let onTextContent: (text: string, isFinal: boolean) => void = () => {};
  let onFunctionCall: Record<string, (args: Record<string, any>) => void> = {};

  const { model, messages, ...rest } = params;
  console.log("params", params);
  const fetchStream = async () => {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelId: params.model,
        options: {
          messages: [
            {
              role: "system",
              content: system,
            },
            ...messages,
          ],
          stream: true,
        },
      }),
      ...rest,
    });

    // Create a readable stream from the response body
    const reader = res.body!.getReader();

    // Create a function to read chunks from the stream
    let jsonBuffer = "";

    const readChunk = async () => {
      const { done, value } = await reader.read();
      if (done) {
        // Streaming finished
        if (!hasFunction) {
          onTextContent(text, true);
        }
        return;
      }

      // Decode the chunk as text
      const chunk = new TextDecoder("utf-8").decode(value);

      // Accumulate the chunk in the JSON buffer
      jsonBuffer += chunk;

      // Check if the JSON buffer contains a complete JSON object
      try {
        const parsedData = JSON.parse(jsonBuffer);
        if (parsedData.onFunctionCall) {
          hasFunction = true;
          onFunctionCall[
            parsedData.onFunctionCall as keyof typeof onFunctionCall
          ]?.(parsedData.arguments as Record<string, any>);
          jsonBuffer = ""; // Reset the JSON buffer
          return; // Return early to avoid further processing
        } else if (parsedData.onTextContent) {
          text += parsedData.onTextContent;
          onTextContent(text, false);
          jsonBuffer = ""; // Reset the JSON buffer
        }
      } catch (error) {
        // Incomplete JSON, continue accumulating chunks
      }

      // Read the next chunk
      await readChunk();
    };
    // Start reading chunks from the stream
    await readChunk();
  };

  (async () => {
    await fetchStream();
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: (
      name: string,
      callback: (args: any) => void | Promise<void>
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}

// export function runMockCompletion<
//   T extends Omit<
//     Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
//     "functions"
//   > & { functions: ToolDefinition<any, any>[] }
// >(openai: OpenAI, params: T) {
//   type FunctionNames = T["functions"] extends Array<any>
//     ? T["functions"][number]["name"]
//     : never;
//   let onFunctionCall: Record<string, (args: Record<string, any>) => void> = {};

//   const { functions } = params;

//   const mockFunctionCall = async () => {
//     const mockFunctionName = functions[0]?.name || "";
//     const mockFunctionArguments = { arg1: "value1", arg2: "value2" };

//     onFunctionCall[mockFunctionName as keyof typeof onFunctionCall]?.(
//       mockFunctionArguments as Record<string, any>
//     );
//   };

//   (async () => {
//     await mockFunctionCall();
//   })();

//   return {
//     onTextContent: (
//       callback: (text: string, isFinal: boolean) => void | Promise<void>
//     ) => {},
//     onFunctionCall: (
//       name: FunctionNames,
//       callback: (args: any) => void | Promise<void>
//     ) => {
//       onFunctionCall[name] = callback;
//     },
//   };
// }
