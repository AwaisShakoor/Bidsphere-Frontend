import { Suspense } from "react";
import { AuctionPage } from "@/components/auction/AuctionPage";

export default function MyAuctionsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </main>
      }
    >
      <AuctionPage />
    </Suspense>
  );
}
