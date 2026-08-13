import type { ReactNode } from "react";
import { Toaster } from "sonner";
import AgentNav from "./components/AgentNav";
import { requireAgent } from "@/lib/auth/guards";

interface AgentLayoutProps {
  children: ReactNode;
}

export default async function AgentLayout({ children }: AgentLayoutProps) {
  await requireAgent();

  return (
    <div className="flex min-h-screen bg-[#f7faf8]">
      <AgentNav />
      <main className="flex-1">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}