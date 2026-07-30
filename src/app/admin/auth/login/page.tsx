"use client";

import { AdminLoginForm } from "./AdminLoginForm";

export default function LoginPage() {

  return (
    <>
      <div className="mb-12 text-center md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 font-sans md:text-[40px] drop-shadow-md">
          Admin Login
        </h1>
      </div>
      <AdminLoginForm />
    </>
  );
}