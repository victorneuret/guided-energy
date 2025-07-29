"use client";

import React from "react";
import {
  GoogleCalendarConnector,
  GoogleCalendarConnectorButton,
} from "@/components/tools/googleCalendar";
import { DisplayToolData } from "@/components/tools/tools";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Settings2 } from "lucide-react";

export default function Chat() {
  const [isGoogleCalendarDialogOpen, setIsGoogleCalendarDialogOpen] =
    React.useState(false);
  const [googleRefreshToken, setGoogleRefreshToken] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    setGoogleRefreshToken(localStorage.getItem("google_refresh_token"));
  }, []);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    headers: {
      "Google-Calendar-Refresh-Token": googleRefreshToken ?? "",
    },
  });

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="stretch mx-auto flex w-full max-w-xl flex-col gap-4 px-2 pb-24 pt-12">
      <GoogleCalendarConnector
        open={isGoogleCalendarDialogOpen}
        onOpenChange={setIsGoogleCalendarDialogOpen}
      />

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
      <div className="h-48" />

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-2 left-1/2 w-full max-w-xl -translate-x-1/2 rounded-2xl border border-border bg-background p-2 shadow-sm"
      >
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you today?"
            className="placeholder:text-gray-400 max-h-[300px] min-h-[40px] w-full resize-none border-0 p-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Bottom controls */}
        <div className="mt-2 flex items-center justify-between">
          {/* Left side buttons */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Settings2 className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Connectors</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsGoogleCalendarDialogOpen(true)}
                >
                  <GoogleCalendarConnectorButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Send button */}
            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              variant="default"
              size="icon"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
