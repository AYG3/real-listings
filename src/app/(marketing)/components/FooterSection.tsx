import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export default function FooterSection() {
  return (
    <footer className="bg-forest-900 pt-16 pb-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-12 mb-12 gap-8 md:gap-0">
          <h2 className="text-3xl font-bold w-full md:w-1/2 pr-0 md:pr-10 leading-snug">
            Get all our news and offers in one place
          </h2>
          
          <div className="w-full md:w-5/12 flex flex-col sm:flex-row gap-0 sm:gap-3 bg-white sm:bg-transparent rounded-sm sm:rounded-none overflow-hidden sm:overflow-visible">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full flex-1 border-none bg-white px-5 py-4 text-sm text-ink-900 outline-none sm:rounded-control"
            />
            <button
              type="button"
              className="h-full w-full border border-white/30 bg-transparent px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto sm:rounded-control sm:py-0"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 pr-0 lg:pr-12">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/logo-mark.svg"
                alt=""
                width={32}
                height={32}
                className="rounded-control"
              />
              <span className="text-xl font-bold uppercase tracking-[0.18em]">
                {brand.name}
              </span>
            </div>
            <p className="max-w-sm text-[13px] font-medium leading-loose text-white/60">
              {brand.description}
            </p>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-bold mb-6 text-sm">About Us</h4>
            <ul className="space-y-4 text-[13px] font-medium text-white/50">
              <li>
                <Link href="/buy" className="transition-colors hover:text-white">
                  Browse properties
                </Link>
              </li>
              <li>
                <Link href="/agent/auth/register" className="transition-colors hover:text-white">
                  Become an agent
                </Link>
              </li>
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
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-bold mb-6 text-sm">Community</h4>
            <ul className="space-y-4 text-[13px] font-medium text-white/50">
              <li>
                <a href={`mailto:${brand.supportEmail}`} className="transition-colors hover:text-white">
                  Contact support
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.supportEmail}?subject=Password%20reset`} className="transition-colors hover:text-white">
                  Password help
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-6 text-sm">Social Media</h4>
            <ul className="space-y-4 text-[13px] font-medium text-white/50">
              <li>
                <Link href="/login" className="transition-colors hover:text-white">
                  Agent portal
                </Link>
              </li>
              <li>
                <Link href="/login?next=/admin/overview" className="transition-colors hover:text-white">
                  Admin portal
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}