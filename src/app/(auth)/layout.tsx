import type { ReactNode } from "react";
import { Toaster } from "sonner";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Auth Card */}
      <section className="relative z-10 w-full max-w-sm overflow-hidden rounded-[34px] border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/60" />

        <div className="relative z-10 min-h-[720px] px-6 py-10 sm:px-8 md:px-10">
          {children}
          <Toaster richColors position="top-right" />
        </div>
      </section>
    </main>
  );
}