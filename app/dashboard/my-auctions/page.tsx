import { SellerRoute } from "@/components/auth/seller-route";
import { AuctionPage } from "@/components/auction/auctionPage";

export default function MyAuctionsRoutePage() {
  return (
    <SellerRoute>
      <AuctionPage />
    </SellerRoute>
  );
}
