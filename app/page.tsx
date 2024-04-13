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
        {/* <div className="px-8 md:px-12 pt-20 md:pt-16 pb-32 md:pb-40 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-6 overflow-y-auto">
          <ChatMessages />
        </div> */}
        <ChatBar id={id} />
      </div>
    </AI>
  );
}
