import { Quote } from "lucide-react";
import { initials } from "@/lib/format";

const testimonials = [
  {
    quote:
      "I found a three-bedroom in Lekki within a week. What made the difference was seeing which agent was actually verified before I called.",
    name: "Ngozi Adeyemi",
    role: "Buyer · Lagos",
  },
  {
    quote:
      "The moderation queue sounded like friction at first. It turns out buyers trust the listings more, so I get fewer time-wasting calls.",
    name: "Chidi Okafor",
    role: "Agent · Abuja",
  },
  {
    quote:
      "Land listings show the title type and whether a survey plan exists, which is the first thing I check. I did not have to ask twice.",
    name: "Bashir Lawal",
    role: "Buyer · Kano",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-ivory-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-h2 font-bold text-ink-900">
            What buyers and agents say
          </h2>
          <p className="mt-2 text-sm text-muted-500">
            Feedback from people using the platform to buy, sell, and let
            property. Illustrative for this demo build.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.name}
              className="flex flex-col rounded-card border border-ink-900/10 bg-ivory-50 p-6 shadow-card"
            >
              <Quote className="h-6 w-6 text-gold-500" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                {testimonial.quote}
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-ink-900/5 pt-4">
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700/10 text-xs font-bold text-forest-700"
                >
                  {initials(testimonial.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-500">{testimonial.role}</p>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
