import type { ToolInvocation } from "ai";
import type { JSX } from "react";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

function GoogleCalendarIcon({ size = 20 }: { size?: number }) {
  return (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
      alt="Google Calendar"
      width={size}
      height={size}
    />
  );
}

export function GoogleCalendarConnectorButton() {
  return (
    <>
      <GoogleCalendarIcon size={20} />
      Google Calendar
      <ArrowRight className="size-4" />
    </>
  );
}

export function GoogleCalendarConnector({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/google-calendar");
      return (await response.json()) as { authorizeUrl: string };
    },
    onSuccess: (data) => {
      window.location.href = data.authorizeUrl;
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-row gap-4">
          <GoogleCalendarIcon size={42} />
          <div className="flex flex-col gap-1">
            <DialogTitle>Google Calendar</DialogTitle>
            <DialogDescription>
              Connect your Google Calendar to your AI assistant.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Connecting..." : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function GoogleCalendarToolData(toolInvocation: ToolInvocation): {
  args: JSX.Element;
  result: JSX.Element;
} {
  console.log("args", toolInvocation.args);
  console.log(
    "result",
    toolInvocation.state === "result" ? toolInvocation.result : "",
  );
  // const args = toolInvocation.args as z.infer<typeof ExaWebSearchSchema>;

  switch (toolInvocation.state) {
    case "partial-call":
      return {
        args: <Skeleton className="h-4 w-full" />,
        result: <Skeleton className="h-10 w-full" />,
      };
    case "call":
      return {
        args: <Skeleton className="h-4 w-full" />,
        result: <Skeleton className="h-10 w-full" />,
      };
    case "result":
      return {
        args: <Skeleton className="h-4 w-full" />,
        result: <Skeleton className="h-10 w-full" />,
      };
  }
}
