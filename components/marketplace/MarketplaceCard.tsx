import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MarketplaceCardProps = {
  href: string;
  title: string;
  imageUrl?: string | null;
  imageAlt?: string;
  imagePending?: boolean;
  badge: string;
  badgeClassName?: string;
  chip?: ReactNode;
  footer: ReactNode;
};

export function MarketplaceCard({
  href,
  title,
  imageUrl,
  imageAlt,
  imagePending = false,
  badge,
  badgeClassName,
  chip,
  footer,
}: MarketplaceCardProps) {
  return (
    <li>
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm shadow-primary/10 ring-1 ring-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary/45 hover:shadow-lg hover:shadow-primary/15"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {imagePending ? (
            <div className="size-full animate-pulse bg-muted" />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <span className="flex size-full items-center justify-center bg-primary/5 text-primary/45">
              <ImageIcon className="size-6" aria-hidden />
            </span>
          )}
          <span
            className={cn(
              "absolute top-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground uppercase shadow-sm",
              badgeClassName,
            )}
          >
            {badge}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 border-t border-primary/15 bg-linear-to-b from-accent/80 to-card p-3">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
            {title || "Untitled"}
          </h3>
          {chip}
          <div className="mt-auto space-y-1 border-t border-primary/15 pt-2">
            {footer}
          </div>
        </div>
      </Link>
    </li>
  );
}
