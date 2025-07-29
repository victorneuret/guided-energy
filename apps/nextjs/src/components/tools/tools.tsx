import type { ToolInvocation } from "ai";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ExaToolData } from "./exa";
import { FirecrawlToolData } from "./firecrawl";

const toolDataMapping = {
  ExaSearchTool: ExaToolData,
  FirecrawlScrapeTool: FirecrawlToolData,
};

export function DisplayToolData({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  const toolData =
    toolDataMapping[toolInvocation.toolName as keyof typeof toolDataMapping](
      toolInvocation,
    );

  return (
    <Collapsible className="my-2">
      <CollapsibleTrigger asChild>
        <Button variant="secondary">
          <ChevronsUpDown />
          {toolInvocation.state !== "result" ? (
            <>Calling {toolInvocation.toolName}...</>
          ) : (
            <>
              Called {toolInvocation.toolName}
              <Check className="size-4" />
            </>
          )}

          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-xl bg-muted p-4 shadow-sm">
        {toolData.args}
        {toolData.result}
      </CollapsibleContent>
    </Collapsible>
  );
}
