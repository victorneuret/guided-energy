"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-xl flex-col gap-4 pb-24 pt-12">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("whitespace-pre-wrap", {
            "max-w-3/4 self-end": message.role === "user",
          })}
        >
          <div
            className={cn({
              "bg-zinc-100 rounded-md p-2": message.role === "user",
            })}
          >
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <Input
          className="fixed bottom-0 mb-8 w-full max-w-xl resize-none rounded-2xl shadow-xl"
          value={input}
          type="text"
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
