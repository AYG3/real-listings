import type { ReactNode } from "react";
import { Toaster } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <Toaster richColors position="top-right" />
      {children}
    </>
  );
}