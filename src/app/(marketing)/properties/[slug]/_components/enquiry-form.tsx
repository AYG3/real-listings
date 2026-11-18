"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { submitEnquiry, type EnquiryState } from "../actions";

export function EnquiryForm({
  listingId,
  agentName,
  title,
}: {
  listingId: string;
  agentName: string;
  title: string;
}) {
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    submitEnquiry,
    null,
  );

  if (state?.status === "success") {
    return (
      <div
        role="status"
        className="rounded-card border border-success/30 bg-success/5 p-4"
      >
        <p className="text-sm font-bold text-forest-800">Enquiry sent</p>
        <p className="mt-1 text-sm text-ink-700">{state.message}</p>
        <p className="mt-2 text-xs text-muted-500">
          {agentName} receives your name, email and phone number. Nothing is
          posted publicly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="listingId" value={listingId} />

      {/* Honeypot: visually hidden, never focusable, bots fill it anyway. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="enquiry-website">Website</label>
        <input
          id="enquiry-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state?.status === "error" ? (
        <p
          role="alert"
          className="mb-4 rounded-control border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {state.message}
        </p>
      ) : null}

      <Input
        label="Your name"
        name="name"
        autoComplete="name"
        required
        error={state?.fieldErrors?.name}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state?.fieldErrors?.email}
      />

      <Input
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        hint="Only shared with the agent."
        error={state?.fieldErrors?.phone}
      />

      <Textarea
        label="Message"
        name="message"
        rows={4}
        required
        defaultValue={`Hello ${agentName}, I would like to arrange a viewing of “${title}”. Please let me know what times are available.`}
        hint="Mention your preferred viewing days if you have them."
        error={state?.fieldErrors?.message}
      />

      <Button type="submit" loading={pending} className="mt-2 w-full">
        Send enquiry
      </Button>

      <p className="mt-2 text-xs text-muted-500">
        No account needed. Your details go to {agentName} only.
      </p>
    </form>
  );
}
