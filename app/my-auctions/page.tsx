import { Suspense } from "react";
import { Auction } from "@/components/auction";
import { Loader } from "@/components/ui/Loader";

export default function MyAuctionsPage() {
  return (
    <Suspense fallback={<Loader label="Loading my auctions..." />}>
      <Auction />
    </Suspense>
  );
}
