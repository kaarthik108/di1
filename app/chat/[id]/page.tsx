import { ChatBar } from "@/components/ChatBar";
import { ChatMessages } from "@/components/ChatMessages";

export const runtime = "edge";
export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  return (
    <div className="h-screen">
      <div className="px-8 md:px-12 pt-20 md:pt-16 pb-32 md:pb-40 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-6 overflow-y-auto">
        <ChatMessages />
      </div>
      <ChatBar />
    </div>
  );
}
