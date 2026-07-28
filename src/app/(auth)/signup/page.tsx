"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import AuthInput from "../../../components/AuthInput";
import { FaApple, FaFacebookF } from "react-icons/fa";
import { authClient } from "@/lib/auth/authClient";
import GoogleSigInButton from "../../../components/GoogleSigInButton";
import { ReactFormState } from "react-dom/client";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email, password } = form;

  const handleForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await authClient.signUp.email({
      name: "",
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mb-12 text-center md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 font-sans md:text-[40px] drop-shadow-md">
          Signup
        </h1>
      </div>

      <form
        className="flex flex-col w-full max-w-[440px] mx-auto pb-4"
        onSubmit={handleForm}
      >
        <AuthInput label="User Name" type="text" placeholder="User name" />

        <AuthInput
          label="Email"
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          value={password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <AuthInput
          label="Confirm password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <button
          type="submit"
          className="h-[52px] md:h-[56px] w-full rounded-md bg-[#1ed760] text-base md:text-[17px] font-semibold text-white shadow-lg transition hover:bg-[#1db954] active:scale-[0.98] mt-2 mb-8"
        >
          Signup
        </button>

        <div className="mb-8 flex items-center gap-4 px-2">
          <div className="h-[1px] flex-1 bg-white/20" />
          <span className="text-[13px] md:text-[15px] font-medium text-white/90 px-1 font-sans">
            Or signup with
          </span>
          <div className="h-[1px] flex-1 bg-white/20" />
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-20 md:mb-24">
          <GoogleSigInButton />

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
          Already have an account!{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1ed760] hover:text-[#1db954] transition-colors ml-1"
          >
            Login
          </Link>
        </p>
      </form>
    </>
  );
}
