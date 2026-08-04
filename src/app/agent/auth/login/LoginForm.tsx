'use client'

import AuthInput from "@/components/AuthInput";
import login from "../_components/actions";
import GoogleSigInButton from "@/components/GoogleSigInButton";

function LoginForm() {
  return (
    <div>
      <div className="mb-12 text-center md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 font-sans md:text-[40px] drop-shadow-md">
          Agent Login
        </h1>
      </div>

      <form
        action={login}
        className="flex flex-col w-full max-w-[440px] mx-auto pb-4"
      >
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          showPasswordToggle
        />

        <div className="mb-6 flex items-center justify-between text-sm md:text-[15px]"></div>

        <button
          type="submit"
          className="h-[52px] md:h-[56px] w-full rounded-md bg-[#1ed760] text-base md:text-[17px] font-semibold text-white shadow-lg transition hover:bg-[#1db954] active:scale-[0.98] mt-2 mb-8"
        >
          Login
        </button>

        <div className="mb-8 flex items-center gap-4 px-2">
          <div className="h-[1px] flex-1 bg-white/20" />
          <span className="text-[13px] md:text-[15px] font-medium text-white/90 px-1 font-sans">
            Or login with
          </span>
          <div className="h-[1px] flex-1 bg-white/20" />
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-20 md:mb-24">
          <GoogleSigInButton
            onError={(error) => console.log("Error", error)}
            onSuccess={(result) => console.log("Result", result)}
          />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;