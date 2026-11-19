import { requireAdmin } from "@/lib/auth/guards";
import { getAdminUsers } from "@/lib/admin/moderation";
import { UserTable } from "./_components/user-table";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const users = await getAdminUsers(session.user.id);

  const counts = {
    total: users.length,
    admins: users.filter((user) => user.role === "ADMIN").length,
    agents: users.filter((user) => user.role === "AGENT").length,
    buyers: users.filter((user) => user.role === "BUYER").length,
  };

  return (
    <div className="min-h-screen bg-surface px-4 py-6 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
            Users
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
            Every account with its role and activity. Role changes require typing
            the new role and are recorded in the audit log.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-950">{counts.total}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
            <p className="text-sm font-semibold text-emerald-800">Admins</p>
            <p className="mt-1 text-2xl font-bold text-forest-700">{counts.admins}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Agents</p>
            <p className="mt-1 text-2xl font-bold text-gray-950">{counts.agents}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Buyers</p>
            <p className="mt-1 text-2xl font-bold text-gray-950">{counts.buyers}</p>
          </div>
        </section>

        <section className="mt-8">
          <UserTable users={users} />
        </section>
      </div>
    </div>
  );
}
