import { ChatBar } from "@/components/ChatBar";
import { nanoid } from "@/lib/utils";
import { AI } from "./action";

export const runtime = "edge";

export default async function IndexPage() {
  const id = nanoid();

  return (
    <AI
      initialAIState={{
        chatId: id,
        messages: [],
        interactions: [],
      }}
    >
      <div className="h-screen">
        <ChatBar id={id} />
      </div>
    </AI>
  );
}
