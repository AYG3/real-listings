import { redirect } from "next/navigation";

/**
 * Portal deep-link. Phase 1 unified every sign-in into `/login` with a
 * role-aware gate, so this route only preserves existing bookmarks.
 */
export default function AgentLoginRedirect() {
  redirect("/login?next=/agent/dashboard");
}
