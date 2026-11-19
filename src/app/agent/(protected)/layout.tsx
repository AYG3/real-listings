import type { ReactNode } from "react";
import AgentNav from "./components/AgentNav";
import { requireAgent } from "@/lib/auth/guards";

interface AgentLayoutProps {
  children: ReactNode;
}

export default async function AgentLayout({ children }: AgentLayoutProps) {
  const session = await requireAgent();

  return (
    <div className="flex min-h-screen bg-surface">
      <AgentNav user={{ name: session.user.name, email: session.user.email }} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
