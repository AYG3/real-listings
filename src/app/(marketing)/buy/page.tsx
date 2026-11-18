import { redirect } from "next/navigation";

/** Preset facet of the results page — no duplicated query code. */
export default function BuyPage() {
  redirect("/properties?intent=sale");
}
