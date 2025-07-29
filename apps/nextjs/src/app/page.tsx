"use client";

import { DisplayToolData } from "@/components/tools/tools";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="stretch mx-auto flex w-full max-w-xl flex-col gap-4 px-2 pb-24 pt-12">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("whitespace-pre-wrap", {
            "max-w-3/4 self-end": message.role === "user",
          })}
        >
          <div
            className={cn({
              "rounded-md border border-border px-4 py-2":
                message.role === "user",
            })}
          >
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
                case "tool-invocation":
                  return (
                    <DisplayToolData
                      key={`${message.id}-${i}`}
                      toolInvocation={part.toolInvocation}
                    />
                  );
              }
            })}
          </div>
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-1/2 mb-8 w-full max-w-xl -translate-x-1/2 transform px-2"
      >
        <Input
          className="w-full resize-none rounded-2xl shadow-xl"
          value={input}
          type="text"
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
