import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-14">
          <div className="skeleton h-8 w-52 rounded-full" />
          <div className="skeleton mt-6 h-64 w-full rounded-3xl" />
        </div>
      }
    >
      <DashboardView />
    </Suspense>
  );
}
