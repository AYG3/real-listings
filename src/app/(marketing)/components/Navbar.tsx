import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { brand } from "@/lib/brand";
import { buttonStyles } from "@/components/ui/button";

const links = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Land", href: "/land" },
  { label: "Agents", href: "/agents" },
  { label: "All properties", href: "/properties" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 w-full border-b border-ink-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-extrabold uppercase tracking-[0.12em] text-forest-900 md:text-xl"
        >
          {brand.name}
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-muted-500 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-forest-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Search className="hidden h-5 w-5 text-muted-500 sm:block" aria-hidden />
          <Heart className="hidden h-5 w-5 text-muted-500 sm:block" aria-hidden />
          <Link
            href="/login"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            Sign in
          </Link>
          <Link
            href="/agent/auth/register"
            className={buttonStyles({ size: "sm" })}
          >
            List property
          </Link>
        </div>
      </div>
    </nav>
  );
}

