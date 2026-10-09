import { GuestRoute } from "@/components/auth/guest-route";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <GuestRoute>
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-primary/10 blur-3xl"
        />
        <main className="relative flex w-full max-w-lg flex-col items-center gap-8 text-center">
          <div className="w-full">
            <LoginForm />
          </div>
        </main>
      </div>
    </GuestRoute>
  );
}
