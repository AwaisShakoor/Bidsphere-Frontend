import Link from "next/link";
import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BidSphereCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  className?: string;
};

export function BidSphereCard({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerHref,
  className,
}: BidSphereCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-110 gap-0 border-0 py-0 shadow-lg ring-1 ring-border/70",
        className
      )}
    >
      <CardHeader className="gap-2 px-8 pt-8 pb-0 text-center">
        <p className="text-sm font-medium tracking-tight text-muted-foreground">
          BidSphere
        </p>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-balance leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pt-7">{children}</CardContent>

      <CardFooter className="flex flex-col gap-1 border-0 bg-transparent px-8 pb-8 pt-6">
        <p className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerHref}
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
