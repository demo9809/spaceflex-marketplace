import { Suspense } from "react";
import type { Metadata } from "next";
import { PropertyExplorer } from "@/components/property/explorer";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent",
  description:
    "Search curated luxury properties across Qatar — West Bay, The Pearl, Lusail and Msheireb. Filter by district, budget, amenities and commute.",
};

function ExplorerSkeleton() {
  return (
    <div className="container-site pb-24 pt-12">
      <div className="skeleton h-8 w-40 rounded-full" />
      <div className="skeleton mt-4 h-14 w-full max-w-lg rounded-2xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-line">
            <div className="skeleton aspect-[4/3]" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-5 w-28 rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded-full" />
              <div className="skeleton h-4 w-1/2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<ExplorerSkeleton />}>
      <PropertyExplorer />
    </Suspense>
  );
}
