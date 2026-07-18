"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Compass, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/store/saved";

const tabs = [
  { label: "Explore", href: "/", icon: Compass },
  { label: "Search", href: "/properties", icon: Search },
  { label: "Saved", href: "/saved", icon: Heart },
  { label: "Inbox", href: "/dashboard?tab=messages", icon: MessageCircle },
  { label: "Profile", href: "/dashboard", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const { saved } = useSaved();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="grid h-16 grid-cols-5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href.split("?")[0]) &&
                tab.href !== "/";
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 text-[0.625rem] font-medium transition-colors",
                active ? "text-ink" : "text-faint"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                {tab.label === "Saved" && saved.length > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 text-[0.5625rem] font-bold text-white">
                    {saved.length}
                  </span>
                )}
              </span>
              {tab.label}
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brass" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
