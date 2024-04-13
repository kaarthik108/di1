"use client";

import type { AI, UIState } from "@/app/action";
import { useUIState } from "ai/rsc";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export interface ChatMessages {
  // messages: UIState;
  isShared?: boolean;
}

export function ChatMessages({ isShared }: ChatMessages) {
  const [messages] = useUIState<typeof AI>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const path = usePathname();

  // useEffect(() => {
  //   if (!path.includes("chat") && messages.length === 0) {
  //     window.history.replaceState({}, "", `/`);
  //   }
  // }, [path, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {messages.length
        ? messages.map((message) => (
            <div key={message.id} className="text-white/80 gap-2">
              {message.spinner}
              {message.display}
              {message.attachments}
            </div>
          ))
        : null}
      <div ref={messagesEndRef} />
    </>
  );
}
