import { AI } from "@/app/action";
import { getChat } from "@/app/actions";
import { ChatBar } from "@/components/ChatBar";
import { notFound, redirect } from "next/navigation";

export const runtime = "edge";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
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
        <ChatBar id={chat.id} initialMessages={chat.messages} />
      </div>
    </AI>
  );
}
