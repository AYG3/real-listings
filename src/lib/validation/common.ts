import { z } from "zod";

/**
 * FormData values arrive as `string | File | null`. Everything in this app's
 * forms is a string field, so reading through these two helpers keeps the
 * per-action code free of type narrowing.
 */
export function formText(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function formFlag(value: FormDataEntryValue | null | undefined): boolean {
  return value === "on" || value === "true";
}

/** Ids come from the URL or a hidden input; the database decides validity. */
export const recordId = z.string().trim().min(1, "Missing identifier.");

export const optionalPhone = z
  .string()
  .trim()
  .max(30, "That phone number is too long.")
  .refine(
    (value) => value === "" || /^[+()\d\s-]{7,}$/.test(value),
    "Enter a valid phone number, or leave it blank.",
  );

/**
 * Collapse a ZodError into the `{ field: message }` shape every form renders,
 * keeping only the first message per field so the summary line stays readable.
 */
export function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}

/** Shared shape for actions that report validation problems back to a form. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};
