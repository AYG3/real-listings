import type { ReactNode } from "react";
import { Toaster } from "sonner";
import AgentNav from "./components/AgentNav";

interface AgentLayoutProps {
  children: ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f7faf8]">
      <AgentNav />
      <main className="flex-1">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}