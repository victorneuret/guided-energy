import { env } from "@/env";
import { tool } from "ai";
import Exa from "exa-js";
import { z } from "zod";

const exa = new Exa(env.EXA_API_KEY);

export const ExaWebSearchSchema = z.object({
  query: z.string().min(1).max(100).describe("The search query"),
});

export interface ExaSearchResult {
  title: string | null;
  url: string;
  publishedDate: string | undefined;
}

export const ExaSearchTool = tool({
  description: "Search the web for up-to-date information",
  parameters: ExaWebSearchSchema,
  execute: async ({
    query,
  }: z.infer<typeof ExaWebSearchSchema>): Promise<ExaSearchResult[]> => {
    const { results } = await exa.search(query, {
      includeDomains: ["weather.com"],
      numResults: 10,
    });
    return results.map((result) => ({
      title: result.title,
      url: result.url,
      publishedDate: result.publishedDate,
    }));
  },
});
