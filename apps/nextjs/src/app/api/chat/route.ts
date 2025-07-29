import type { Message } from "ai";
import type { NextRequest } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";

import { DateTools } from "./date";
import { ExaSearchTool } from "./exa";
import { FirecrawlScrapeTool } from "./firecrawl";
import { GoogleCalendarTool } from "./googleCalendar";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as {
    messages: Message[];
    headers: Headers;
  };

  const googleCalendarRefreshToken = req.headers.get(
    "Google-Calendar-Refresh-Token",
  );

  const result = streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    system: `You are a helpful assistant that can answer questions about weather data. You have access to tools that can search the web for information to help you answer questions accurately.\n
      All temperature data must be converted to Celsius before presenting it to the user.\n
      When presenting date and time information, always convert UTC times to Paris timezone. You should use the tool to-local-datetime provided to convert the time.\n
      When creating or updating events in the Google Calendar, the user will provide the date and time in the local timezone. You should use the tool to-utc-datetime provided to convert the time to UTC.`,
    messages: convertToCoreMessages(messages),

    tools: {
      ExaSearchTool,
      FirecrawlScrapeTool,
      ...DateTools,
      ...(googleCalendarRefreshToken
        ? await GoogleCalendarTool({ refreshToken: googleCalendarRefreshToken })
        : {}),
    },
    maxSteps: 5,
    toolCallStreaming: true,
  });

  return result.toDataStreamResponse();
}
