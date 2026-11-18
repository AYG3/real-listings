import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Phone } from "lucide-react";
import { ListingCard } from "@/components/listing/listing-card";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { initials } from "@/lib/format";
import { getAgentProfile } from "@/lib/listing/queries";

type PageProps = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

const loadAgent = cache(getAgentProfile);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const agent = await loadAgent(id);

  if (!agent) return { title: "Agent not found" };

  return {
    title: agent.name,
    description: `Browse the ${agent.listings.length} verified ${agent.listings.length === 1 ? "property" : "properties"} listed by ${agent.name}${agent.city ? ` in ${agent.city}` : ""}.`,
    openGraph: {
      title: `${agent.name} · Alara Estate`,
      description: `Properties listed by ${agent.name} on Alara Estate.`,
    },
  };
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { id } = await params;
  const agent = await loadAgent(id);

  if (!agent) notFound();

  const place = [agent.city, agent.state].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/agents"
        className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All agents
      </Link>

      <header className="mt-6 flex flex-col gap-6 rounded-card border border-ink-900/10 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {agent.image ? (
            <Image
              src={agent.image}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-700/10 text-lg font-bold text-forest-700"
            >
              {initials(agent.name)}
            </span>
          )}

          <div>
            <h1 className="text-h2 font-bold text-ink-900">{agent.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-500">
              {place ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {place}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4" aria-hidden />
                {agent.listings.length}{" "}
                {agent.listings.length === 1 ? "live listing" : "live listings"}
              </span>
            </p>
          </div>
        </div>

        {agent.phone ? (
          <Link
            href={`tel:${agent.phone}`}
            className={buttonStyles({ variant: "secondary" })}
          >
            <Phone className="h-4 w-4" aria-hidden />
            {agent.phone}
          </Link>
        ) : null}
      </header>

      <section className="mt-10">
        <h2 className="text-h3 font-bold text-ink-900">
          Properties from {agent.name}
        </h2>

        {agent.listings.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Building2}
              title="No live listings"
              description="This agent has no published properties right now."
              action={
                <Link href="/properties" className={buttonStyles()}>
                  Browse all properties
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
            {agent.listings.map((listing, index) => (
              <li key={listing.id}>
                <ListingCard listing={listing} eager={index === 0} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
