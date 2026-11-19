"use client";

import { useActionState } from "react";
import CloudinaryUploadWidget from "@/components/upload/CldUploadWidget";
import { buttonStyles } from "@/components/ui/button";
import { updateAgentProfile, type ProfileState } from "../actions";

const initialState: ProfileState = { status: "idle" };

type Defaults = {
  name: string;
  email: string;
  phone: string;
  agencyName: string;
  bio: string;
  image: string | null;
  initials: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs font-medium text-danger">
      {message}
    </p>
  );
}

export function ProfileForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState(
    updateAgentProfile,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.status !== "idle" && state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-control px-4 py-3 text-sm font-semibold ${
            state.status === "error"
              ? "border border-danger/30 bg-danger/5 text-danger"
              : "border border-success/30 bg-success/5 text-forest-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-gray-950">Your details</h2>
        <p className="mt-1 text-sm text-gray-500">
          These appear on your public agent profile.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Full name
            <input
              name="name"
              defaultValue={defaults.name}
              required
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-950 outline-none focus:border-forest-700"
            />
            <FieldError message={state.fieldErrors?.name} />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={defaults.email}
              readOnly
              disabled
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
            />
            <span className="mt-1 block text-xs text-gray-600">
              Sign-in email cannot be changed here.
            </span>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Phone
            <input
              name="phone"
              type="tel"
              defaultValue={defaults.phone}
              placeholder="+234 802 555 0100"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-950 outline-none focus:border-forest-700"
            />
            <FieldError message={state.fieldErrors?.phone} />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Agency name
            <input
              name="agencyName"
              defaultValue={defaults.agencyName}
              placeholder="Alara Estates"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-950 outline-none focus:border-forest-700"
            />
            <FieldError message={state.fieldErrors?.agencyName} />
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          About you
          <textarea
            name="bio"
            rows={4}
            defaultValue={defaults.bio}
            placeholder="What do you list, and what should a buyer expect when they contact you?"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-950 outline-none focus:border-forest-700"
          />
          <FieldError message={state.fieldErrors?.bio} />
        </label>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-gray-950">Profile photo</h2>
        <p className="mt-1 text-sm text-gray-500">
          A clear photo helps buyers recognise you.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-2xl font-bold text-forest-700">
            {defaults.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={defaults.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              defaults.initials
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Photo URL
              <input
                name="avatarUrl"
                defaultValue={defaults.image ?? ""}
                placeholder="https://res.cloudinary.com/..."
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-950 outline-none focus:border-forest-700"
              />
            </label>
            <CloudinaryUploadWidget />
            {state.fieldErrors?.image ? (
              <FieldError message={state.fieldErrors.image} />
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className={buttonStyles()}>
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
