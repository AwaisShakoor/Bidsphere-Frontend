import { SellerRoute } from "@/components/auth/seller-route";
import { MyAuctionsPage } from "@/components/auction/my-auctions-page";

export default function MyAuctionsRoutePage() {
  return (
    <SellerRoute>
      <MyAuctionsPage />
    </SellerRoute>
  );
}
