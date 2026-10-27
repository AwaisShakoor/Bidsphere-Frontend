import { Suspense } from "react";
import { AuctionPage } from "@/components/auction";
import { Loader } from "@/components/ui/Loader";

export default function MyAuctionsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AuctionPage />
    </Suspense>
  );
}
