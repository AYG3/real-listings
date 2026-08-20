"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "./LoginForm";
import { login, type LoginState } from "../_components/actions";

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
      router.push("/agent/dashboard");
    }
  }, [state, router]);

  return (
    <>
      <div className="mb-12 text-center md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 font-sans md:text-[40px] drop-shadow-md">
          Agent Login
        </h1>
      </div>

      <LoginForm action={formAction} isPending={isPending} />
    </>
  );
}
