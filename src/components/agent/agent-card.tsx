import Image from "next/image";
import Link from "next/link";
import { Star, BadgeCheck, Clock } from "lucide-react";
import type { Agent } from "@/lib/types";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <article className="card-hover relative overflow-hidden rounded-2xl border border-line bg-raised p-6 text-center shadow-card">
      <Link
        href={`/agents/${agent.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${agent.name}'s profile`}
      />
      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full ring-2 ring-brass-tint">
        <Image
          src={agent.photo}
          alt={agent.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <h3 className="mt-4 flex items-center justify-center gap-1.5 font-display text-lg font-semibold">
        {agent.name}
        {agent.verified && (
          <BadgeCheck size={16} className="text-brass" aria-label="Verified agent" />
        )}
      </h3>
      <p className="mt-0.5 text-[0.8125rem] text-muted">{agent.title}</p>
      <p className="text-[0.8125rem] font-medium text-brass">{agent.agency}</p>

      <div className="mt-4 flex items-center justify-center gap-4 text-[0.8125rem] text-muted">
        <span className="flex items-center gap-1">
          <Star size={13} className="fill-gold stroke-gold" />
          {agent.rating}
          <span className="text-faint">({agent.reviews})</span>
        </span>
        <span>{agent.transactions} deals</span>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1 text-xs font-medium text-success">
        <Clock size={12} />
        {agent.responseTime}
      </p>
    </article>
  );
}
