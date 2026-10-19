import { Suspense } from "react";
import { AuctionPage } from "@/components/auction";
import { Loader } from "@/components/ui/Loader";

export default function MyAuctionsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center">
          <Loader label="Loading auctions..." />
        </main>
      }
    >
      <AuctionPage />
    </Suspense>
  );
}
