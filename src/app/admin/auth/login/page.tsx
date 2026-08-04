"use client";

import { useActionState, useEffect } from "react";
import { AdminLoginForm } from "./AdminLoginForm";
import { login, type LoginState } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";



export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    login,
    null as LoginState,
  );

  const router = useRouter();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
      router.push('/admin/overview');
    }
  }, [state, router]);

  return (
    <>
      <div className="mb-12 text-center md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 font-sans md:text-[40px] drop-shadow-md">
          Admin Login
        </h1>
      </div>
      <AdminLoginForm action={formAction} isPending={isPending} />
    </>
  );
}
