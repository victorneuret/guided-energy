import { env } from "@/env";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createSmitheryUrl } from "@smithery/sdk";
import { experimental_createMCPClient as createMCPClient } from "ai";

export const GoogleCalendarTool = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const serverUrl = createSmitheryUrl(
    "https://server.smithery.ai/@goldk3y/google-calendar-mcp",
    {
      apiKey: "66963829-1673-4a6d-be68-7abd793850c1",
      profile: "vicarious-albatross-8VPCZQ",
      config: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri: env.GOOGLE_REDIRECT_URI,
        refreshToken: refreshToken,
      },
    },
  );

  const client = await createMCPClient({
    transport: new StreamableHTTPClientTransport(serverUrl),
  });

  const tools = await client.tools();
  return tools;
};
