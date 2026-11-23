"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TruncatedTextProps = {
  text: string;
  limit?: number;
  lines?: 1 | 2;
  className?: string;
  as?: "p" | "span";
};

export function TruncatedText({
  text,
  limit = 48,
  lines = 1,
  className,
  as: Comp = "p",
}: TruncatedTextProps) {
  const content = (
    <Comp
      className={cn(
        "min-w-0",
        lines === 1 ? "truncate" : "line-clamp-2",
        className,
      )}
    >
      {text}
    </Comp>
  );

  if (text.length <= limit) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent className="max-w-sm wrap-break-word whitespace-pre-wrap">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
