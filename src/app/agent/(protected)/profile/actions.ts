"use server";

import { revalidatePath } from "next/cache";
import { requireAgent } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { DEMO_READ_ONLY_MESSAGE, isDemoSessionUser } from "@/lib/demo/guard";
import { agentProfileSchema, fieldErrorsOf } from "@/lib/validation";

export type ProfileState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function optionalText(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export async function updateAgentProfile(
  _previous: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await requireAgent();

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

  const parsed = agentProfileSchema.safeParse({
    name: formData.get("name"),
    phone: optionalText(formData.get("phone")),
    agencyName: optionalText(formData.get("agencyName")),
    bio: optionalText(formData.get("bio")),
    image: optionalText(formData.get("avatarUrl")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
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
