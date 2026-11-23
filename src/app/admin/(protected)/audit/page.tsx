import Link from "next/link";
import { ScrollText } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { getAuditFeed } from "@/lib/admin/moderation";
import { isDemoSessionUser } from "@/lib/demo/guard";
import { redactAuditEntry } from "@/lib/demo/redact";

const actionLabels: Record<string, string> = {
  LISTING_APPROVED: "Approved listing",
  LISTING_REJECTED: "Rejected listing",
  LISTING_CHANGES_REQUESTED: "Requested changes",
  LISTING_PUBLISHED: "Published listing",
  LISTING_UNPUBLISHED: "Unpublished listing",
  LISTING_ARCHIVED: "Archived listing",
  AGENT_VERIFIED: "Verified agent",
  AGENT_REJECTED: "Rejected agent",
  ROLE_CHANGED: "Changed role",
};

function stamp(date: Date) {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminAuditPage() {
  const session = await requireAdmin();
  const redact = isDemoSessionUser(session.user);
  const entries = (await getAuditFeed()).map((entry) =>
    redact ? redactAuditEntry(entry) : entry,
  );

  return (
    <div className="bg-surface px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-forest-700 lg:block">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              Audit log
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Every moderation decision, newest first.
            </p>
          </div>
          <Link
            href="/admin/moderation"
            className="inline-flex h-10 items-center rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-forest-700 hover:bg-gray-50"
          >
            Back to moderation
          </Link>
        </header>

        {entries.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
            <ScrollText className="mx-auto h-8 w-8 text-gray-400" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-bold text-gray-950">Nothing logged yet</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
              Approving a listing or verifying an agent writes the first entry.
            </p>
          </div>
        ) : (
          <>
          <div className="mt-8 hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">When</th>
                  <th scope="col" className="px-4 py-3 font-bold">Actor</th>
                  <th scope="col" className="px-4 py-3 font-bold">Action</th>
                  <th scope="col" className="px-4 py-3 font-bold">Target</th>
                  <th scope="col" className="px-4 py-3 font-bold">Transition</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100 align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-500">
                      {stamp(entry.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {entry.actorName}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {actionLabels[entry.action] ?? entry.action}
                      {entry.note ? (
                        <span className="mt-1 block text-xs font-normal text-gray-500">
                          “{entry.note}”
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">
                        {entry.targetName}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-600">
                        {entry.targetType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-600">
                      {entry.fromStatus ?? "—"} → {entry.toStatus ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 space-y-3 md:hidden">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-card border border-ink-900/10 bg-white p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-ink-900">
                    {actionLabels[entry.action] ?? entry.action}
                  </p>
                  <time className="shrink-0 text-xs font-medium text-muted-500">
                    {stamp(entry.createdAt)}
                  </time>
                </div>

                {entry.note ? (
                  <p className="mt-1 text-xs text-muted-500">“{entry.note}”</p>
                ) : null}

                <dl className="mt-3 grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1.5 text-xs">
                  <dt className="font-semibold text-muted-500">Actor</dt>
                  <dd className="min-w-0 break-words font-medium text-ink-700">
                    {entry.actorName}
                  </dd>
                  <dt className="font-semibold text-muted-500">Target</dt>
                  <dd className="min-w-0 break-words font-medium text-ink-700">
                    {entry.targetName}{" "}
                    <span className="text-muted-500">({entry.targetType})</span>
                  </dd>
                  <dt className="font-semibold text-muted-500">Change</dt>
                  <dd className="font-medium text-ink-700">
                    {entry.fromStatus ?? "—"} → {entry.toStatus ?? "—"}
                  </dd>
                </dl>
              </li>
            ))}
          </ul>
          </>
        )}
      </div>
    </div>
  );
}
