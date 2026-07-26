import { Suspense } from "react";
import type { Metadata } from "next";
import { DriveTimeSearch } from "@/components/property/drive-time-search";

export const metadata: Metadata = {
  title: "Find Homes by Drive Time",
  description:
    "Search Qatar homes by commute. Add the places your day revolves around — office, school, mall — set a drive-time budget, and see only the homes that reach them all.",
};

function DriveTimeSkeleton() {
  return (
    <div className="container-site grid gap-8 pb-28 pt-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-10 lg:pt-12">
      <div className="space-y-4">
        <div className="skeleton h-7 w-40 rounded-full" />
        <div className="skeleton h-10 w-64 rounded-2xl" />
        <div className="skeleton h-11 w-full rounded-xl" />
        <div className="skeleton h-32 w-full rounded-2xl" />
      </div>
      <div className="skeleton h-[28rem] w-full rounded-3xl lg:h-[calc(100svh-8rem)]" />
    </div>
  );
}

export default function DriveTimePage() {
  return (
    <Suspense fallback={<DriveTimeSkeleton />}>
      <DriveTimeSearch />
    </Suspense>
  );
}
