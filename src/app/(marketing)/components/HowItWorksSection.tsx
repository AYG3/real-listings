import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Agents submit",
    body: "An agent creates an account, adds photos, price and title details, then submits the listing for review.",
    href: "/agent/auth/register",
    cta: "Become an agent",
  },
  {
    number: "02",
    title: "We review it",
    body: "An admin checks the listing and the agent. Approvals, rejections and requests for changes are all recorded.",
    href: "/case-study",
    cta: "How moderation works",
  },
  {
    number: "03",
    title: "Buyers enquire",
    body: "Buyers browse verified listings and contact the agent directly. The agent tracks every enquiry in one place.",
    href: "/properties",
    cta: "Browse listings",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-caption font-bold uppercase tracking-[0.18em] text-gold-700">
            How it works
          </p>
          <h2 className="mt-3 text-h2 font-bold text-ink-900">
            Three steps, and a record of each one.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-500">
            Moderation is the product. It is why a listing here is worth
            reading, and why an agent is worth calling.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col rounded-card border border-ink-900/10 bg-ivory-50 p-6"
            >
              <span className="text-sm font-bold tracking-[0.18em] text-gold-700">
                {step.number}
              </span>
              <h3 className="mt-3 text-h3 font-bold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-500">
                {step.body}
              </p>
              <Link
                href={step.href}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 transition-colors hover:text-forest-800"
              >
                {step.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
