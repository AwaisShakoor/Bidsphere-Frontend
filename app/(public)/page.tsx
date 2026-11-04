import { PublicActiveItems } from "@/components/public/PublicActiveItems";

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative py-6 sm:py-8">
        <h1 className="sr-only">Live auctions</h1>
        <PublicActiveItems />
      </div>
    </main>
  );
}
