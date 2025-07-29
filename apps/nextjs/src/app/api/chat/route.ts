import type { Message } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";

import { ExaSearchTool } from "./exa";
import { FirecrawlScrapeTool } from "./firecrawl";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };

  const result = streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    system: `You are a helpful assistant that can answer questions about weather data.\n
      You can use the tools provided to search the web for information.\n
      Any temperature data must be in Celsius.`,
    messages: convertToCoreMessages(messages),

    tools: { ExaSearchTool, FirecrawlScrapeTool },
    maxSteps: 5,
    toolCallStreaming: true,
  });

  return result.toDataStreamResponse();
}
