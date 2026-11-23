"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";
import { useCreateStripeWithdraw } from "@/services/hooks/StripeServicesHook";

type SellerWithdrawFormProps = {
  available: number;
  disabled?: boolean;
};

export function SellerWithdrawForm({
  available,
  disabled = false,
}: SellerWithdrawFormProps) {
  const [amountInput, setAmountInput] = useState("");
  const { mutate: withdraw, isPending } = useCreateStripeWithdraw();

  const amount = Number(amountInput);
  const isValid =
    Number.isFinite(amount) && amount > 0 && amount <= available + 1e-9;
  const showError = amountInput.trim() !== "" && !isValid;

  function handleWithdrawAll() {
    setAmountInput(available > 0 ? available.toFixed(2) : "");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || isPending || disabled) return;
    withdraw(Number(amount.toFixed(2)), {
      onSuccess: () => setAmountInput(""),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-2 rounded-xl bg-card/90 p-3.5 ring-1 ring-border"
    >
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="withdraw-amount"
          className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
        >
          Withdraw amount
        </label>
        <button
          type="button"
          onClick={handleWithdrawAll}
          disabled={disabled || available <= 0 || isPending}
          className="cursor-pointer text-[11px] font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Withdraw all ({formatMoney(available)})
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          id="withdraw-amount"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="0.00"
          value={amountInput}
          onChange={(event) => setAmountInput(event.target.value)}
          disabled={disabled || isPending}
          aria-invalid={showError || undefined}
          className="h-10"
        />
        <Button
          type="submit"
          className="h-10 shrink-0 px-4"
          disabled={disabled || isPending || !isValid}
        >
          {isPending ? "Withdrawing…" : "Withdraw to bank"}
        </Button>
      </div>

      {showError ? (
        <p className="text-xs text-destructive">
          {amount <= 0
            ? "Enter an amount greater than 0."
            : `Amount can’t exceed available (${formatMoney(available)}).`}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Funds usually arrive in 1–2 business days.
        </p>
      )}
    </form>
  );
}
