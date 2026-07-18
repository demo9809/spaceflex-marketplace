import type { Metadata } from "next";
import { ListingWizard } from "./listing-wizard";

export const metadata: Metadata = {
  title: "Create a listing",
  description:
    "List your property on SpaceFlex — guided listing creation with photos, amenities, and featured placement options.",
};

export default function ListPropertyPage() {
  return <ListingWizard />;
}
