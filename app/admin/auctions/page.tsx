import { Suspense } from "react";
import { AdminAuctionsPage } from "@/components/admin";
import { Loader } from "@/components/ui/Loader";

export default function AdminAuctionsRoutePage() {
  return (
    <Suspense fallback={<Loader />}>
      <AdminAuctionsPage />
    </Suspense>
  );
}
