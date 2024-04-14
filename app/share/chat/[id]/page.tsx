import { AI } from "@/app/action";
import { getChat } from "@/app/actions";
import { ChatBar } from "@/components/ChatBar";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

interface SharePageProps {
  params: {
    id: string;
  };
}
export const dynamicParams = false;
export const runtime = "edge";

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const chat = await getChat(params.id);
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://di1-iyr.pages.dev";

  return {
    title: chat?.title.slice(0, 50) ?? "AI Chat",
    keywords: "share, chat, ai, cloudflare, d1, di1, gpt4",
    twitter: {
      card: "summary_large_image",
      site: "@kaarthikcodes",
      creator: "@kaarthikcodes",
      images: [`${baseURL}/share/chat/${params.id}/opengraph-image`],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const chat = await getChat(params.id);

  if (!chat) {
    redirect("/");
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages,
        interactions: [],
      }}
    >
      <div className="h-screen">
        <ChatBar id={chat.id} isShared />
      </div>
    </AI>
  );
}
