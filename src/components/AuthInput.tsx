"use client";

import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function AuthInput({
  label,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  className = "",
  ...props
}: AuthInputProps) {
  return (
    <div className="mb-6">
      <label className="mb-1.5 block text-[15px] font-semibold text-white tracking-wide">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          className={`h-[52px] md:h-[56px] w-full rounded-md border-transparent bg-[#e5e5e5]/90 px-4 pr-12 text-[15px] md:text-base text-black placeholder:text-black/40 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#1ed760] disabled:opacity-50 ${className}`}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 transition hover:text-black/60 focus:outline-none p-1"
          >
            {showPassword ? (
              <Eye size={20} strokeWidth={2} />
            ) : (
              <EyeOff size={20} strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
