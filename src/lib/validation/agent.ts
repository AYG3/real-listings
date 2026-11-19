import { z } from "zod";
import { optionalPhone } from "./common";

export const agentProfileSchema = z.object({
  name: z.string().trim().min(2, "Your name is required").max(120),
  phone: optionalPhone.optional(),
  agencyName: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(1_200).optional(),
  image: z.string().trim().max(500).optional(),
});

export type AgentProfileInput = z.infer<typeof agentProfileSchema>;
