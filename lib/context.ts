import { createEmbeddings, queryCloudflare } from "@/app/actions";

import { db } from "@/app/bindings";

export async function getMatchesFromEmbeddings(embeddings: number[]) {
  try {
    const result = await queryCloudflare(embeddings);
    return result;
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

export async function getContext(query: string): Promise<string> {
  const queryEmbeddings = await createEmbeddings(query);
  const matches = (await getMatchesFromEmbeddings(queryEmbeddings!)) || [];

  const qualifyingDocs = matches.filter((match) => match.score > 0.6);

  const vecIds = qualifyingDocs.map((doc) => `'${doc.id}'`);

  let context: string[] = [];
  if (vecIds.length) {
    const query = `SELECT * FROM v_yc WHERE id IN (${vecIds.join(", ")})`;
    const { results } = await db.prepare(query).bind().all();
    if (results) {
      context = results.map((result) => result.text as string);
      // console.log("context", context);
    }
  }

  const contextMessage = context.length
    ? `\n${context.map((schema) => `- ${schema}`).join("\n")}`
    : "";

  return contextMessage;
}
