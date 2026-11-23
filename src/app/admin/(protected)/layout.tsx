import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { requireAdmin } from "@/lib/auth/guards";
import { isDemoSessionUser } from "@/lib/demo/guard";
import { maskEmail } from "@/lib/demo/mask";


interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await requireAdmin();
  const user = session.user as {
    name: string;
    email: string;
    role?: string | null;
    isDemo?: boolean | null;
  };

  const redact = isDemoSessionUser(user);

  return (
    <PortalShell
      portal="admin"
      user={{
        name: user.name,
        email: redact ? (maskEmail(user.email) ?? user.email) : user.email,
        role: user.role,
        isDemo: user.isDemo,
      }}
    >
      {children}
    </PortalShell>
  );
}
