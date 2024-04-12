import { redirect } from "next/navigation";
import { ai } from "./ai";

export const runtime = "edge";

export default async function Home() {
  // const res = await ai.run("@hf/nousresearch/hermes-2-pro-mistral-7b", {
  //   prompt: "What is the most complex sql ?",
  // });
  // const res = await ai.run("@hf/nousresearch/hermes-2-pro-mistral-7b", {
  //   messages: [
  //     {
  //       role: "system",
  //       content: `
  //         You are a data analytics assistant specialized in SQLITE database. You can help users with sql queries
  //       `,
  //     },
  //   ],
  //   stream: true,
  // });

  // console.log(res);

  // const res = await createEmbeddings("Hello, world!");
  // console.log(res);
  // const { results } = await db.prepare("SELECT count(*) FROM companies").all();

  // console.log(results);

  redirect("/chat");
}
