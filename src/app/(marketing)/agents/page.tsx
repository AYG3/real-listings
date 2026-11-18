import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { initials } from "@/lib/format";
import { getAgentDirectory } from "@/lib/listing/queries";

// Reads live agent data on every request; ISR needs a build-time database.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agents",
  description:
    "Browse verified agents listing property on Alara Estate, and see how many properties each one has live.",
};

export default async function AgentsPage() {
  const agents = await getAgentDirectory();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-h2 font-bold text-ink-900 md:text-h1">
          Verified agents
        </h1>
        <p className="mt-2 text-sm text-muted-500">
          Every agent below has published listings on the platform. Contact them
          directly from any property page.
        </p>
      </header>

      {agents.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Users}
            title="No agents with live listings yet"
            description="Agents appear here once they have at least one published property."
            action={
              <Link
                href="/agent/auth/register"
                className={buttonStyles({ variant: "secondary" })}
              >
                Become an agent
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <li
              key={agent.id}
              className="flex flex-col rounded-card border border-ink-900/10 bg-white p-6 shadow-card"
            >
              <div className="flex items-center gap-3">
                {agent.image ? (
                  <Image
                    src={agent.image}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-700/10 text-sm font-bold text-forest-700"
                  >
                    {initials(agent.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-ink-900">
                    {agent.name}
                  </p>
                  {agent.city || agent.state ? (
                    <p className="flex items-center gap-1 text-xs text-muted-500">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {[agent.city, agent.state].filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 text-sm text-ink-700">
                {agent.listingCount}{" "}
                {agent.listingCount === 1 ? "live listing" : "live listings"}
              </p>

              <Link
                href={`/agents/${agent.id}`}
                className={buttonStyles({
                  variant: "secondary",
                  size: "sm",
                  className: "mt-5 self-start",
                })}
              >
                View profile
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
