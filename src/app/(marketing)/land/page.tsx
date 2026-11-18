import { redirect } from "next/navigation";

/** Preset facet of the results page — no duplicated query code. */
export default function LandPage() {
  redirect("/properties?type=land");
}
