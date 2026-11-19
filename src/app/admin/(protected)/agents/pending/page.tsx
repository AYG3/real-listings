import { redirect } from "next/navigation";

/** Agent verification now lives in the moderation queue; keep the URL working. */
export default function PendingAgentsPage() {
  redirect("/admin/moderation?tab=agents");
}
