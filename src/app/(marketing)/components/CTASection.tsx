import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-forest-900 py-16 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <p className="text-caption font-bold uppercase tracking-[0.18em] text-gold-500">
            Not sure yet?
          </p>
          <h2 className="mt-3 text-h2 font-bold text-white">
            Start with the inventory, not with a phone call.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Browse what is live today, or put your own property in front of
            buyers who are already looking. Either way, nothing is published
            without a review.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/properties"
            className={buttonStyles({ variant: "gold", size: "lg" })}
          >
            Browse properties
          </Link>
          <Link
            href="/agent/auth/register"
            className={buttonStyles({ variant: "onDark", size: "lg" })}
          >
            List a property
          </Link>
        </div>
      </div>
    </section>
  );
}
