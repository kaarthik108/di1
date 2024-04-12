"use client";

import type { AI } from "@/app/action";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { cn, nanoid } from "@/lib/utils";
import { useActions, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserMessage } from "./message";
import { Button } from "./ui/button";
import { IconArrowElbow } from "./ui/icons";

export function ChatBar() {
  const [input, setInput] = useState("");
  const { submitUserMessage } = useActions();
  const [messages, setMessages] = useUIState<typeof AI>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { formRef, onKeyDown } = useEnterSubmit();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  return (
    <div
      className={cn(
        messages.length === 0
          ? "fixed bottom-1 left-0 right-0 top-10 mx-auto h-screen flex flex-col items-center justify-center"
          : "fixed bottom-10 md:bottom-12 left-0 right-0 flex justify-center items-center mx-auto pt-2 bg-[#2b2b27] w-full z-10"
      )}
    >
      <form
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault();
          const value = input.trim();
          setInput("");
          if (!value) return;
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: Date.now(),
              display: <UserMessage>{value}</UserMessage>,
            },
          ]);
          try {
            const responseMessage = await submitUserMessage(value);

            setMessages((currentMessages) => [
              ...currentMessages,
              responseMessage,
            ]);
          } catch (error) {
            console.error(error);
          }
        }}
        className="max-w-2xl w-full px-2"
      >
        <div className="relative flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            name="input"
            autoComplete="off"
            autoCorrect="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            placeholder="Ask a question..."
            autoFocus
            value={input}
            className="w-full pl-6 pr-10 h-14 rounded-full bg-[#393937] text-[#D4D4D4] focus-within:outline-none outline-none focus:ring-0 border-none backdrop-blur-lg shadow-lg"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <Button
            type="submit"
            size={"icon"}
            variant={"ghost"}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white dark:text-black rounded-lg hover:bg-white/25 focus:bg-white/25 w-8 h-8 aspect-square ring-0 outline-0 bg-transparent dark:bg-white/60"
            disabled={input.length === 0}
          >
            <IconArrowElbow />
          </Button>
        </div>
      </form>
    </div>
  );
}
