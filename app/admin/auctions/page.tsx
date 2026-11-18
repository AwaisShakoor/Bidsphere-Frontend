import { Suspense } from "react";
import { AdminAuctions } from "@/components/admin";
import { Loader } from "@/components/ui/Loader";

export default function AdminAuctionsRoutePage() {
  return (
    <Suspense fallback={<Loader />}>
      <AdminAuctions />
    </Suspense>
  );
}
