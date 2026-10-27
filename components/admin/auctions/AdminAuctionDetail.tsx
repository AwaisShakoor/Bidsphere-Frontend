"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CalendarRange,
  Check,
  Clock3,
  X,
} from "lucide-react";
import { DetailRow, InfoCard, SectionHeading } from "./AdminAuctionInfoCard";
import { AdminAuctionSellerCard } from "./AdminAuctionSellerCard";
import { AdminAuctionDetailSkeleton } from "./AdminAuctionDetailSkeleton";
import { RejectAuctionDialog } from "./RejectAuctionDialog";
import { ImageLightbox } from "@/components/item/ImageLightbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { AuctionStatus } from "@/enums/auctionStatus";
import { getAuctionStatusClass } from "@/lib/constants/auctionStatus";
import { formatDate, formatMoney, formatSnakeCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  useAdminAuction,
  useApproveAdminAuction,
  useRejectAdminAuction,
} from "@/services/hooks/AdminServicesHook";

type AdminAuctionDetailProps = {
  auctionId: string;
  onBack: () => void;
};

export function AdminAuctionDetail({
  auctionId,
  onBack,
}: AdminAuctionDetailProps) {
  const {
    data: auction,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminAuction(auctionId);
  const { mutate: approveAuction, isPending: isApproving } =
    useApproveAdminAuction();
  const { mutate: rejectAuction, isPending: isRejecting } =
    useRejectAdminAuction();

  const [preview, setPreview] = useState<{ url: string; alt: string } | null>(
    null,
  );
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const isDeciding = isApproving || isRejecting;
  const canDecide = auction?.status === AuctionStatus.PENDING_APPROVAL;

  function handleApprove() {
    approveAuction(auctionId, {
      onSuccess: () => {
        setApproveOpen(false);
        onBack();
      },
    });
  }

  function handleReject(rejectionReason: string) {
    rejectAuction(
      { id: auctionId, rejectionReason },
      {
        onSuccess: () => {
          setRejectOpen(false);
          onBack();
        },
      },
    );
  }

  if (isPending) {
    return <AdminAuctionDetailSkeleton />;
  }

  if (isError || !auction) {
    return (
      <div className="relative flex flex-col gap-5">
        <div className="min-w-0 space-y-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft data-icon="inline-start" />
            Back to auctions
          </Button>
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Auction unavailable
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This auction could not be loaded for review.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-destructive/25 bg-destructive/5 px-6 py-16 text-center shadow-sm shadow-primary/5">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" aria-hidden />
          </span>
          <div className="space-y-1.5">
            <p className="text-base font-semibold tracking-tight text-foreground">
              Could not load this auction
            </p>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong while fetching the auction details."}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Retrying..." : "Try again"}
            </Button>
            <Button type="button" onClick={onBack}>
              Back to auctions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-5">
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft data-icon="inline-start" />
            Back to auctions
          </Button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {auction.title || "Untitled"}
            </h2>
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                getAuctionStatusClass(auction.status),
              )}
            >
              {formatSnakeCase(auction.status)}
            </span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {auction.description || "No description"}
          </p>
        </div>

        {canDecide ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              className="h-10"
              disabled={isDeciding}
              onClick={() => setApproveOpen(true)}
            >
              <Check data-icon="inline-start" />
              Approve
            </Button>
            <Button
              type="button"
              className="h-10 bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30"
              disabled={isDeciding}
              onClick={() => setRejectOpen(true)}
            >
              <X data-icon="inline-start" />
              Reject
            </Button>
          </div>
        ) : null}
      </div>

      <section className="relative">
        <SectionHeading>Auction details</SectionHeading>
        <div className="mt-3 overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm shadow-primary/5">
          <AdminAuctionSellerCard seller={auction.seller} />

          <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
            <InfoCard
              tone="primary"
              icon={<CalendarRange className="size-4" />}
              label="Starts"
              value={formatDate(auction.startTime)}
            />
            <InfoCard
              tone="accent"
              icon={<CalendarClock className="size-4" />}
              label="Ends"
              value={formatDate(auction.endTime)}
            />
            <InfoCard
              tone="muted"
              icon={<Clock3 className="size-4" />}
              label="Submitted"
              value={formatDate(auction.createdAt)}
            />
          </div>
        </div>
      </section>

      <section className="relative flex flex-col gap-4">
        <div>
          <SectionHeading>Items ({auction.items.length})</SectionHeading>
          <p className="mt-1.5 pl-3 text-sm text-muted-foreground">
            Review each lot before approving. Click a photo to enlarge it.
          </p>
        </div>

        {auction.items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-8 text-sm text-muted-foreground">
            No items in this auction.
          </p>
        ) : (
          <ul className="space-y-6">
            {auction.items.map((item, index) => {
              const cover = item.images[0]?.url;
              const shippingLabel = [
                formatSnakeCase(item.shippingType),
                item.shippingCost ? formatMoney(item.shippingCost) : null,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm shadow-primary/5"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-primary/10 bg-primary/8 px-4 py-2.5 sm:px-5">
                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                      Item {index + 1} of {auction.items.length}
                    </p>
                    {item.category?.name ? (
                      <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                        {item.category.name}
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
                    {cover ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          setPreview({ url: cover, alt: item.title })
                        }
                        className="h-auto overflow-hidden rounded-xl p-0 ring-1 ring-primary/20 hover:bg-transparent hover:ring-primary/50"
                      >
                        <img
                          src={cover}
                          alt={item.title}
                          className="aspect-square w-full object-cover"
                        />
                      </Button>
                    ) : (
                      <div className="flex aspect-square items-center justify-center rounded-xl bg-accent text-sm text-accent-foreground">
                        No photo
                      </div>
                    )}

                    <div className="min-w-0 space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold tracking-tight text-foreground">
                            {item.title || "Untitled"}
                          </h4>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {formatSnakeCase(item.itemCondition)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description || "No description"}
                        </p>
                      </div>

                      <dl className="rounded-xl bg-accent/60 px-3 sm:px-4">
                        <DetailRow
                          label="Starting price"
                          value={formatMoney(item.startingPrice)}
                          emphasize
                        />
                        <DetailRow
                          label="Reserve price"
                          value={formatMoney(item.reservePrice)}
                          emphasize
                        />
                        <DetailRow
                          label="Shipping"
                          value={shippingLabel || "—"}
                        />
                        <DetailRow
                          label="Est. delivery"
                          value={
                            item.shippingEstimatedDays != null
                              ? `${item.shippingEstimatedDays} day${item.shippingEstimatedDays === 1 ? "" : "s"}`
                              : "—"
                          }
                        />
                      </dl>
                    </div>
                  </div>

                  {item.images.length > 1 ? (
                    <div className="border-t border-primary/10 bg-muted/30 px-4 py-4 sm:px-5">
                      <p className="mb-3 text-xs font-semibold tracking-wide text-primary uppercase">
                        All photos ({item.images.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                        {item.images.map((image) => (
                          <Button
                            key={image.id}
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              setPreview({ url: image.url, alt: item.title })
                            }
                            className="h-auto overflow-hidden rounded-lg p-0 ring-1 ring-primary/15 hover:bg-transparent hover:ring-primary/45"
                          >
                            <img
                              src={image.url}
                              alt={item.title}
                              className="aspect-square w-full object-cover"
                            />
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <DeleteConfirmationDialog
        open={approveOpen}
        name={auction.title}
        title={`Approve “${auction.title.trim() || "Untitled"}”?`}
        description="This will make the auction go live. Buyers will be able to see and bid on it."
        confirmLabel="Approve"
        loadingLabel="Approving..."
        icon={<Check className="size-4" />}
        variant="default"
        isLoading={isApproving}
        onConfirm={handleApprove}
        onClose={() => {
          if (!isApproving) setApproveOpen(false);
        }}
      />

      <RejectAuctionDialog
        open={rejectOpen}
        title={auction.title}
        isLoading={isRejecting}
        onConfirm={handleReject}
        onClose={() => {
          if (!isRejecting) setRejectOpen(false);
        }}
      />

      <ImageLightbox
        src={preview?.url ?? null}
        alt={preview?.alt}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
