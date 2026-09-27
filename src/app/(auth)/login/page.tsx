"use client";

import { useState } from "react";
import Link from "next/link";
import AuthInput from "../../../components/AuthInput";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import { authClient } from "@/lib/auth/authClient";
import GoogleSigInButton from "../../../components/GoogleSigInButton";
import { toast } from 'sonner';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event?.preventDefault();
    setLoading(true);

    const result = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    });

    console.log("results: ", result);

    if (result.error) {
      setError(result.error);
      // toast.error(result.error.message ?? "Invalid email and password")z

    }
    setLoading(false);
  };

  return (
    <>
      <div className="mb-12 text-center md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 font-sans md:text-[40px] drop-shadow-md">
          Login
        </h1>
      </div>

      <form
        className="flex flex-col w-full max-w-[440px] mx-auto pb-4"
        onSubmit={handleSubmit}
      >
        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <AuthInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="current-password"
          showPasswordToggle
          showPassword={showPassword}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <div className="mb-6 flex items-center justify-between text-sm md:text-[15px]">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 bg-white/30 rounded-full shadow-inner transition-colors ${rememberMe ? "bg-[#1ed760]" : ""}`}
              ></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform top-0.5 left-0.5 ${rememberMe ? "translate-x-4" : ""}`}
              ></div>
            </div>
            <span className="text-white/80 group-hover:text-white/100 transition-colors">
              Remember me
            </span>
          </label>

          <Link
            href="/forgot-password"
            className="text-white/60 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-[52px] md:h-[56px] w-full rounded-md bg-[#1ed760] text-base md:text-[17px] font-semibold text-white shadow-lg transition hover:bg-[#1db954] active:scale-[0.98] mt-2 mb-8"
        >
          {loading ? "Signing in..." : "Login"}
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
          onError={(error)=> console.log("Error", error)} 
          onSuccess={(result) => console.log("Result", result)}  
          />

          <button
            type="button"
            className="flex h-12 md:h-14 items-center justify-center rounded-[10px] bg-[#424242] text-white transition hover:bg-[#525252] shadow-sm"
          >
            <FaApple size={22} className="mb-1" />
          </button>

          <button
            type="button"
            className="flex h-12 md:h-14 items-center justify-center rounded-[10px] bg-[#424242] text-white transition hover:bg-[#525252] shadow-sm"
          >
            <FaFacebookF size={20} />
          </button>
        </div>

        <p className="mt-auto md:mb-4 text-center text-sm md:text-[15px] text-white/80">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#1ed760] hover:text-[#1db954] transition-colors ml-1"
          >
            Signup
          </Link>
        </p>
      </form>
    </>
  );
}
