import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export default function FooterSection() {
  return (
    <footer className="bg-forest-900 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="pr-0 lg:col-span-2 lg:pr-12">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/logo-mark.svg"
                alt=""
                width={32}
                height={32}
                className="rounded-control"
              />
              <span className="text-lg font-bold uppercase tracking-[0.18em]">
                {brand.name}
              </span>
            </div>
            <p className="max-w-sm text-[13px] font-medium leading-loose text-white/60">
              {brand.description}
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold">Explore</h2>
            <ul className="space-y-3.5 text-[13px] font-medium text-white/70">
              <li>
                <Link href="/properties" className="transition-colors hover:text-white">
                  All properties
                </Link>
              </li>
              <li>
                <Link href="/agents" className="transition-colors hover:text-white">
                  Agents
                </Link>
              </li>
              <li>
                <Link href="/agent/auth/register" className="transition-colors hover:text-white">
                  Become an agent
                </Link>
              </li>
              <li>
                <Link href="/case-study" className="transition-colors hover:text-white">
                  Case study
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold">Account</h2>
            <ul className="space-y-3.5 text-[13px] font-medium text-white/70">
              <li>
                <Link href="/login" className="transition-colors hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="transition-colors hover:text-white">
                  Create an account
                </Link>
              </li>
              <li>
                <Link href="/demo" className="transition-colors hover:text-white">
                  Try the read-only demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold">Portals</h2>
            <ul className="space-y-3.5 text-[13px] font-medium text-white/70">
              <li>
                <Link href="/login?next=/agent/dashboard" className="transition-colors hover:text-white">
                  Agent workspace
                </Link>
              </li>
              <li>
                <Link href="/login?next=/admin/overview" className="transition-colors hover:text-white">
                  Admin control tower
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${brand.supportEmail}`}
                  className="transition-colors hover:text-white"
                >
                  Contact support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs font-medium text-white/60">
          © {new Date().getFullYear()} {brand.name}. A portfolio build — demo
          data only.
        </p>
      </div>
    </footer>
  );
}
