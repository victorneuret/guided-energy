import type { ExaSearchResult, ExaWebSearchSchema } from "@/app/api/chat/exa";
import type { ToolInvocation } from "ai";
import type { JSX } from "react";
import type z from "zod";
import { Skeleton } from "@/components/ui/skeleton";

export function ExaToolData(toolInvocation: ToolInvocation): {
  args: JSX.Element;
  result: JSX.Element;
} {
  const args = toolInvocation.args as z.infer<typeof ExaWebSearchSchema>;

  switch (toolInvocation.state) {
    case "partial-call":
      return {
        args: <Skeleton className="h-4 w-full" />,
        result: <Skeleton className="h-10 w-full" />,
      };
    case "call":
      return {
        args: <p>Searching for: {args.query}</p>,
        result: <Skeleton className="h-10 w-full" />,
      };
    case "result":
      return {
        args: <p>Searching for: {args.query}</p>,
        result: (
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            {(toolInvocation.result as ExaSearchResult[]).map((result) => (
              <li key={result.url}>
                <a href={result.url} className="underline">
                  {result.title}
                </a>
              </li>
            ))}
          </ul>
        ),
      };
  }
}
