"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/FormField";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  auctionDefaultValues,
  auctionSchema,
  getAuctionFormValues,
  type AuctionFormValues,
} from "@/lib/validationSchema/auctionSchema";
import {
  useCreateAuction,
  useUpdateAuction,
} from "@/services/hooks/AuctionServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type AuctionFormProps = {
  auction?: Auction;
  onBack: () => void;
};

export function AuctionForm({ auction, onBack }: AuctionFormProps) {
  const isEdit = Boolean(auction);
  const { mutate: createAuction, isPending: isCreating } = useCreateAuction();
  const { mutate: updateAuction, isPending: isUpdating } = useUpdateAuction();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionFormValues>({
    resolver: zodResolver(auctionSchema),
    defaultValues: auction
      ? getAuctionFormValues(auction)
      : auctionDefaultValues,
  });

  function handleCreateAuction(values: AuctionFormValues) {
    createAuction(
      {
        title: values.title,
        description: values.description,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      },
      { onSuccess: onBack },
    );
  }

  function handleUpdateAuction(values: AuctionFormValues) {
    if (!auction) return;

    updateAuction(
      {
        id: auction.id,
        title: values.title,
        description: values.description,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      },
      { onSuccess: onBack },
    );
  }

  function handleSubmitAuction(values: AuctionFormValues) {
    if (isEdit) {
      handleUpdateAuction(values);
      return;
    }

    handleCreateAuction(values);
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitAuction)}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-5">
        <Field
          label="Title"
          placeholder="e.g. Spring estate auction"
          autoComplete="off"
          disabled={isPending}
          error={errors.title}
          {...register("title")}
        />

        <div className="space-y-1.5 text-left">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe what this auction covers"
            disabled={isPending}
            aria-invalid={!!errors.description}
            className={cn(
              "w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30",
            )}
            {...register("description")}
          />
          {errors.description?.message ? (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Start time"
            type="datetime-local"
            disabled={isPending}
            error={errors.startTime}
            {...register("startTime")}
          />
          <Field
            label="End time"
            type="datetime-local"
            disabled={isPending}
            error={errors.endTime}
            {...register("endTime")}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save changes"
              : "Create auction"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
