import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MyBids } from "@/components/dashboard/MyBids";
import { Button } from "@/components/ui/button";

export default function MyBidsPage() {
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

        <header className="space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My bids
          </h1>
          <p className="text-sm text-muted-foreground">
            Active means you hold the high bid until the auction ends.
          </p>
        </header>

        <MyBids />
      </div>
    </main>
  );
}
