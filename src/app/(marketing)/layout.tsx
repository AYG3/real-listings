import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import FooterSection from "./components/FooterSection";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <FooterSection />
    </>
  );
}
