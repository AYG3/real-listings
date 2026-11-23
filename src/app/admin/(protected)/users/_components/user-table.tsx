"use client";

import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MaskedValue } from "@/components/demo/masked-value";
import { changeUserRole } from "../../moderation/actions";
import type { AdminUser } from "@/lib/admin/moderation";

const roles = ["BUYER", "AGENT", "ADMIN"] as const;

const roleStyles: Record<string, string> = {
  ADMIN: "bg-forest-700 text-white",
  AGENT: "bg-forest-700/10 text-forest-800",
  BUYER: "bg-gray-100 text-gray-700",
};

function joined(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RoleSelect({
  user,
  pending,
  onRequest,
  className,
}: {
  user: AdminUser;
  pending: boolean;
  onRequest: (user: AdminUser, role: string) => void;
  className?: string;
}) {
  return (
    <select
      value={user.role}
      disabled={pending}
      aria-label={`Role for ${user.name?.trim() || user.email}`}
      onChange={(event) => onRequest(user, event.target.value)}
      className={
        className ??
        "h-9 rounded-md border border-gray-200 bg-white px-2 text-xs font-bold text-gray-700 outline-none focus:border-forest-700"
      }
    >
      {roles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  );
}

export function UserTable({
  users,
  redacted = false,
}: {
  users: AdminUser[];
  redacted?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; text: string } | null>(
    null,
  );
  const [target, setTarget] = useState<{ user: AdminUser; role: string } | null>(null);

  const request = (user: AdminUser, role: string) => {
    setFeedback(null);
    setTarget({ user, role });
  };

  const confirm = () => {
    if (!target) return;
    const { user, role } = target;
    setTarget(null);
    startTransition(async () => {
      const result = await changeUserRole(user.id, role);
      setFeedback({
        tone: result.status === "error" ? "error" : "success",
        text: result.message,
      });
    });
  };

  return (
    <div className="space-y-4">
      <p
        role="status"
        aria-live="polite"
        className={`min-h-4 text-sm font-semibold ${
          feedback?.tone === "error" ? "text-rose-700" : "text-forest-700"
        }`}
      >
        {pending ? "Saving…" : feedback?.text ?? ""}
      </p>

      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Person</th>
              <th scope="col" className="px-4 py-3 font-bold">Role</th>
              <th scope="col" className="px-4 py-3 font-bold">Status</th>
              <th scope="col" className="px-4 py-3 font-bold">Joined</th>
              <th scope="col" className="px-4 py-3 font-bold">Activity</th>
              <th scope="col" className="px-4 py-3 font-bold">Change role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100 align-middle">
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-950">{user.name}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {redacted ? (
                      <MaskedValue value={user.email} />
                    ) : (
                      user.email
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      roleStyles[user.role] ?? roleStyles.BUYER
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-gray-600">
                  {user.agentStatus ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-gray-500">
                  {joined(user.createdAt)}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-gray-500">
                  {user.listingCount} listing{user.listingCount === 1 ? "" : "s"} ·{" "}
                  {user.inquiryCount} enquir{user.inquiryCount === 1 ? "y" : "ies"}
                </td>
                <td className="px-4 py-3">
                  {user.isSelf ? (
                    <span className="text-xs font-semibold text-gray-600">
                      Your account
                    </span>
                  ) : (
                    <RoleSelect
                      user={user}
                      pending={pending}
                      onRequest={request}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {users.map((user) => (
          <li
            key={user.id}
            className="rounded-card border border-ink-900/10 bg-white p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900">
                  {user.name?.trim() || user.email}
                </p>
                {user.name?.trim() ? (
                  <p className="truncate text-xs text-muted-500">
                    {redacted ? (
                      <MaskedValue value={user.email} />
                    ) : (
                      user.email
                    )}
                  </p>
                ) : null}
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  roleStyles[user.role] ?? roleStyles.BUYER
                }`}
              >
                {user.role}
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <div>
                <dt className="font-semibold text-muted-500">Status</dt>
                <dd className="font-medium text-ink-700">
                  {user.agentStatus ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-500">Joined</dt>
                <dd className="font-medium text-ink-700">
                  {joined(user.createdAt)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="font-semibold text-muted-500">Activity</dt>
                <dd className="font-medium text-ink-700">
                  {user.listingCount} listing
                  {user.listingCount === 1 ? "" : "s"} · {user.inquiryCount}{" "}
                  enquir{user.inquiryCount === 1 ? "y" : "ies"}
                </dd>
              </div>
            </dl>

            <div className="mt-3">
              {user.isSelf ? (
                <p className="text-xs font-semibold text-muted-500">
                  Your account
                </p>
              ) : (
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-500">
                    Change role
                  </span>
                  <RoleSelect
                    user={user}
                    pending={pending}
                    onRequest={request}
                    className="h-11 w-full rounded-control border border-ink-900/15 bg-white px-2 text-sm font-bold text-ink-700 outline-none focus:border-forest-700"
                  />
                </label>
              )}
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={target !== null}
        title="Change this role?"
        description={
          target
            ? `${target.user.name?.trim() || target.user.email} moves from ${target.user.role} to ${target.role}. Role changes take effect on their next request and are written to the audit log.`
            : ""
        }
        phrase={target?.role ?? "ADMIN"}
        confirmLabel="Change role"
        pending={pending}
        onConfirm={confirm}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
