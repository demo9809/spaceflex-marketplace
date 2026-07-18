import type { Metadata } from "next";
import { AgentCard } from "@/components/agent/agent-card";
import { SectionHeading } from "@/components/site/section-heading";
import { RevealStagger, StaggerItem } from "@/components/motion/reveal";
import { agents } from "@/lib/data/agents";

export const metadata: Metadata = {
  title: "Verified Agents",
  description:
    "Licence-checked, client-reviewed property advisors across Doha, Dubai, Riyadh, Abu Dhabi and Mumbai.",
};

export default function AgentsPage() {
  return (
    <div className="container-site py-14 md:py-20">
      <SectionHeading
        eyebrow="Advisory"
        title="Every agent verified. Every review real."
        description="We licence-check every advisor, verify every transaction they claim, and publish response times so you know who moves quickly."
      />
      <RevealStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((a) => (
          <StaggerItem key={a.id}>
            <AgentCard agent={a} />
          </StaggerItem>
        ))}
      </RevealStagger>
    </div>
  );
}
