import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & Privacy",
};

const sections = [
  {
    title: "Privacy at a glance",
    body: "We collect only what the marketplace needs to work: your account details, saved searches, and enquiry history. Your phone number is shared solely with the verified agent you contact, never sold, never syndicated. You can export or delete your data from account settings at any time, in line with GDPR and regional data-protection law.",
  },
  {
    title: "Terms of service",
    body: "SpaceFlex is a marketplace: we verify agents and curate listings, but property transactions are concluded between you and the counterparty. Listing information is provided by agents and developers and verified on a best-effort basis — always confirm material facts (title, service charges, permissions) during legal due diligence. Featured placement is always labelled.",
  },
  {
    title: "Licensing",
    body: "SpaceFlex operates under Qatar's real-estate advertising and brokerage regulations, including Urban Planning and Development Authority (ULC) brokerage licensing and the Real Estate Regulatory Authority's advertising rules. Broker licence numbers appear on each listing, and freehold or usufruct status is stated on every property page.",
  },
  {
    title: "Cookies",
    body: "We use first-party cookies for sign-in and preferences, and privacy-respecting analytics to understand which features help buyers decide. No third-party advertising trackers run on SpaceFlex.",
  },
];

export default function LegalPage() {
  return (
    <div className="container-site max-w-3xl py-14 md:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="font-display text-h1 mt-2 font-medium tracking-tight">
        The fine print, in plain language
      </h1>
      <p className="mt-3 text-sm text-muted">Last updated 1 July 2026</p>

      <div className="mt-12 space-y-12">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-h3 font-medium">{s.title}</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
