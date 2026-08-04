import AuthInput from "@/components/AuthInput";
import GoogleSigInButton from "@/components/GoogleSigInButton";
import Link from "next/link";

export function AdminLoginForm({
  action,
  isPending,
}: {
  action: (payload: FormData) => void;
  isPending?: boolean;
}) {
  return (
    <form
      action={action}
      className="flex flex-col w-full max-w-[440px] mx-auto pb-4"
    >
      <AuthInput
        label="Email"
        type="text"
        name="email"
        placeholder="Email Address"
        autoComplete="email"
      />

      <AuthInput
        label="Password"
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        showPasswordToggle
      />

      <div className="mb-6 flex items-center justify-between text-sm md:text-[15px]">
        <Link
          href="/forgot-password"
          className="text-white/60 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white underline-offset-4"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-[52px] md:h-[56px] w-full rounded-md bg-[#1ed760] text-base md:text-[17px] font-semibold text-white shadow-lg transition hover:bg-[#1db954] active:scale-[0.98] mt-2 mb-8 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Signing in..." : "Admin Login"}
      </button>

      <div className="mb-8 flex items-center gap-4 px-2">
        <div className="h-[1px] flex-1 bg-white/20" />
        <span className="text-[13px] md:text-[15px] font-medium text-white/90 px-1 font-sans">
          Or login with
        </span>
        <div className="h-[1px] flex-1 bg-white/20" />
      </div>

      <div className="grid gap-3 md:gap-4 mb-20 md:mb-24">
        <GoogleSigInButton callbackURL="/admin/overview" />
      </div>
    </form>
  );
}
