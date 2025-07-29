import { env } from "@/env";
import FirecrawlApp from "@mendable/firecrawl-js";
import { tool } from "ai";
import z from "zod";

const app = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

export const FirecrawlBatchScrapeURLSchema = z.object({
  urls: z.array(z.string()).min(1).max(100).describe("The URLs to scrape"),
});

export interface FirecrawlScrapeResult {
  title?: string;
  url?: string;
  markdown?: string;
}

export const FirecrawlScrapeTool = tool({
  description: "Scrape a list of URLs",
  parameters: FirecrawlBatchScrapeURLSchema,
  execute: async ({
    urls,
  }: z.infer<typeof FirecrawlBatchScrapeURLSchema>): Promise<
    FirecrawlScrapeResult[]
  > => {
    const batchScrapeResult = await app.batchScrapeUrls(urls, {
      formats: ["markdown"],
      onlyMainContent: true,
      blockAds: true,
    });

    if (!batchScrapeResult.success) {
      throw new Error(`Failed to scrape: ${batchScrapeResult.error}`);
    }

    return batchScrapeResult.data.map((result) => ({
      title: result.title,
      url: result.url,
      markdown: result.markdown,
    }));
  },
});
