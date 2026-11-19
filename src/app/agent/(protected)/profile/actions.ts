"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAgent } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";

export type ProfileState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Your name is required").max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((value) => value === "" || /^[+()\d\s-]{7,}$/.test(value), "Enter a valid phone number")
    .optional(),
  agencyName: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(1200).optional(),
  image: z.string().trim().max(500).optional(),
});

function optionalText(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export async function updateAgentProfile(
  _previous: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await requireAgent();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: optionalText(formData.get("phone")),
    agencyName: optionalText(formData.get("agencyName")),
    bio: optionalText(formData.get("bio")),
    image: optionalText(formData.get("avatarUrl")),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Check the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      phone: data.phone || null,
      agencyName: data.agencyName || null,
      bio: data.bio || null,
      image: data.image || undefined,
    },
  });

  revalidatePath("/agent/profile");
  revalidatePath("/agents");
  revalidatePath(`/agents/${session.user.id}`);
  revalidatePath("/agent/dashboard");

  return { status: "success", message: "Profile saved." };
}
