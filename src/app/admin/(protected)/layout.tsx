import type { ReactNode } from "react";
import AdminNavbar from "./components/AdminNavbar";
import { requireAdmin } from "@/lib/auth/guards";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminNavbar
        user={{ name: session.user.name, email: session.user.email }}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
