interface RequestBody {
  modelId: string;
  options: {
    stream: boolean;
    messages: Array<any>;
  };
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const apiToken = process.env.CLOUDFLARE_API_TOKEN!;

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const { modelId, options } = (await req.json()) as RequestBody;
  console.log("modelId:", modelId);
  console.log("options:", options);
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelId}`;
  const headers = {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(options);

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    return new Response(`HTTP error! status: ${response.status}`, {
      status: response.status,
    });
  }

  // Create a TransformStream to process the response
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Start streaming the response
  streamResponse(response, writer);

  return new Response(readable, {
    headers: {
      "content-type": "text/plain",
    },
  });
}

async function streamResponse(
  response: Response,
  writer: WritableStreamDefaultWriter
) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();

        if (data === "[DONE]") {
          // End of stream
          break;
        }

        try {
          const parsedData = JSON.parse(data);
          await writer.write(parsedData.response);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
  }

  await writer.close();
}
