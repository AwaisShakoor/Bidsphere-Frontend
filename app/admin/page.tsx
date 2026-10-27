import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminPage() {
  return (
    <>
      <AdminPageHeader />
      <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
        <p className="text-sm font-medium text-foreground">
          Platform summary coming soon
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Stats and quick actions will appear here.
        </p>
      </div>
    </>
  );
}
