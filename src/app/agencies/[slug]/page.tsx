import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  agencies,
  getAgency,
  agencyAgents,
  agencyListings,
} from "@/lib/data/agencies";
import { AgencyDetailsView } from "@/components/agency/agency-details-view";
import { CompareTray } from "@/components/site/compare-tray";

export function generateStaticParams() {
  return agencies.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agency = getAgency(slug);
  if (!agency) return {};
  return {
    title: `${agency.name} — Licensed Real Estate Agency in Qatar`,
    description: `${agency.tagline}. Verified brokerage with ${agency.activeListings} active listings across Doha, West Bay, The Pearl, and Lusail.`,
  };
}

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = getAgency(slug);
  if (!agency) notFound();

  const team = agencyAgents(agency.id);
  const listings = agencyListings(agency.id);

  return (
    <>
      <AgencyDetailsView agency={agency} team={team} listings={listings} />
      <CompareTray />
    </>
  );
}
