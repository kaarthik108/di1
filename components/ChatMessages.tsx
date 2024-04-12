"use client";

import type { AI } from "@/app/action";
import { Message } from "ai";
import { useUIState } from "ai/rsc";
import { useEffect, useRef } from "react";

export function ChatMessages() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log(messages);

  return (
    <>
      {messages.map((message) => (
        <div key={message.id} className="text-white/80 gap-2">
          {message.display}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}
