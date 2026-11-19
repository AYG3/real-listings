import { redirect } from "next/navigation";

/** The moderation queue replaced this fixture-only page; keep the URL working. */
export default function PendingListingsPage() {
  redirect("/admin/moderation");
}
