import type {
  FirecrawlBatchScrapeURLSchema,
  FirecrawlScrapeResult,
} from "@/app/api/chat/firecrawl";
import type { ToolInvocation } from "ai";
import type { JSX } from "react";
import type z from "zod";
import { Skeleton } from "@/components/ui/skeleton";

export function FirecrawlToolData(toolInvocation: ToolInvocation): {
  args: JSX.Element;
  result: JSX.Element;
} {
  const args = toolInvocation.args as z.infer<
    typeof FirecrawlBatchScrapeURLSchema
  >;

  switch (toolInvocation.state) {
    case "partial-call":
      return {
        args: <Skeleton className="h-4 w-full" />,
        result: <Skeleton className="h-10 w-full" />,
      };
    case "call":
      return {
        args: (
          <div>
            <p>Scraping:</p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {args.urls.map((url) => (
                <li key={url} className="break-all text-sm">
                  {url}
                </li>
              ))}
            </ul>
          </div>
        ),
        result: <Skeleton className="h-10 w-full" />,
      };
    case "result":
      return {
        args: (
          <div>
            <p>Scraping:</p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              {args.urls.map((url) => (
                <li key={url} className="break-all text-sm">
                  {url}
                </li>
              ))}
            </ul>
          </div>
        ),
        result: (
          <div className="[&>*:not(:last-child)]:border-b">
            {(toolInvocation.result as FirecrawlScrapeResult[]).map(
              (result) => (
                <div key={result.url}>
                  <a href={result.url} className="underline">
                    {result.title}
                  </a>
                  <p className="break-all bg-muted text-sm">
                    {result.markdown}
                  </p>
                </div>
              ),
            )}
          </div>
        ),
      };
  }
}
