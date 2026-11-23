import type {
  AdminUser,
  AuditEntry,
  ModerationListing,
  VerificationAgent,
} from "@/lib/admin/moderation";
import { maskEmail, maskFreeText, maskPhone } from "./mask";

/**
 * Field-level policy for demo sessions, applied inside server components and
 * query mappers so only masked values ever reach the browser. Real admins get
 * the exact values they had before — every function is a no-op unless called.
 */

/**
 * Audit actors are staff names, not customer data — they stay legible so the
 * decision trail reads. The free-text note is masked because an operator can
 * paste anything into it.
 */
export function redactAdminUser(user: AdminUser): AdminUser {
  return { ...user, email: maskEmail(user.email) ?? user.email };
}

export function redactAuditEntry(entry: AuditEntry): AuditEntry {
  return { ...entry, note: maskFreeText(entry.note) };
}

export function redactModerationListing(
  listing: ModerationListing,
): ModerationListing {
  return {
    ...listing,
    agentEmail: maskEmail(listing.agentEmail) ?? listing.agentEmail,
    rejectionReason: maskFreeText(listing.rejectionReason),
  };
}

export function redactVerificationAgent(
  agent: VerificationAgent,
): VerificationAgent {
  return {
    ...agent,
    email: maskEmail(agent.email) ?? agent.email,
    phone: maskPhone(agent.phone),
    bio: maskFreeText(agent.bio),
  };
}
