import type { ReactNode } from "react";

/**
 * Auth pages render their own AuthShell, so the group layout only needs to
 * keep the shared toast host available.
 */
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
