import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MyPayments } from "@/components/dashboard/MyPayments";
import { Button } from "@/components/ui/button";

export default function MyPaymentsPage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-4 py-8 sm:py-10">
        <Button
          type="button"
          variant="ghost"
          asChild
          className="w-fit text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard">
            <ArrowLeft data-icon="inline-start" />
            Back to dashboard
          </Link>
        </Button>

        <header className="space-y-1">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Buyer
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My payments
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Paid checkouts first. Unpaid wins still need Pay now before the
            deadline.
          </p>
        </header>

        <MyPayments />
      </div>
    </main>
  );
}
