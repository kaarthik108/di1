import { Ai } from "@cloudflare/ai";
import { getRequestContext } from "@cloudflare/next-on-pages";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const apiToken = process.env.CLOUDFLARE_API_TOKEN!;

const devAI = {
  async run(
    modelId: string,
    options: {
      prompt?: string;
      messages?: Array<any>;
      text?: string;
      stream?: boolean;
    }
  ): Promise<any> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelId}`;
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify(options);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};

// const prodAI = () => {
//   const aiInstance = new Ai(getRequestContext().env.AI);
//   return aiInstance;
// };

export const ai = devAI;

// -- prompt

// {
//     "result": {
//         "response": "Hello there! I'm glad you're interested in learning more about the origins of the phrase \"Hello World.\"\nThe term \"Hello World\" has its roots in the early days of computer programming. In the late 1960s and early 1970s, computer scientists and programmers were experimenting with different ways to write and test code. One of the most common programs they wrote was a simple \"hello world\" program, which would print the words \"Hello, World!\" on the screen.\nThe term \"Hello World\" became a sort of shorthand for this basic program, and it was often used as a way to test the functionality of a new computer or programming language. Over time, the phrase became a sort of inside joke among programmers, and it has since become a common greeting in the tech industry.\nSo, the next time you hear someone say \"Hello World,\" you'll know that they're not just being polite – they're actually referencing a piece of computer programming history! 😊"
//     },
//     "success": true,
//     "errors": [],
//     "messages": []
// }

// -- text

// {
//     "result": {
//         "shape": [
//             1,
//             768
//         ],
//         "data": [
//             [
//                 0.018773017451167107,
//                 0.0387987457215786,
//                 0.021945253014564514,

//                 0.0005791907897219062,

//                 -0.03062792308628559
//             ]
//         ]
//     },
//     "success": true,
//     "errors": [],
//     "messages": []
// }
