"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Compass, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSaved } from "@/lib/store/saved";
import { useScrollNav } from "@/lib/use-scroll-nav";
import { useAiAssistant } from "@/lib/store/ai-assistant-context";

const tabs = [
  { label: "Explore", href: "/", icon: Compass },
  { label: "Search", href: "/properties", icon: Search },
  { label: "AI", href: "#ai", icon: Sparkles, isAi: true },
  { label: "Saved", href: "/saved", icon: Heart },
  { label: "Profile", href: "/dashboard", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const { saved } = useSaved();
  const { openAi, isOpen } = useAiAssistant();
  const navVisible = useScrollNav();

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden transition-transform duration-300 ease-in-out",
        !navVisible && "translate-y-full"
      )}
    >
      <div className="grid h-16 grid-cols-5">
        {tabs.map((tab) => {
          if (tab.isAi) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => openAi()}
                className="relative flex flex-col items-center justify-center gap-0.5 text-[0.625rem] transition-all cursor-pointer"
              >
                <span
                  className={cn(
                    "relative flex h-8.5 w-8.5 items-center justify-center rounded-full overflow-hidden transition-all duration-300",
                    isOpen
                      ? "ring-2 ring-indigo-500 shadow-[0_2px_12px_rgba(99,102,241,0.4)] scale-105"
                      : "ring-1 ring-indigo-300/40 shadow-xs opacity-90 hover:opacity-100 hover:scale-105"
                  )}
                >
                  <Image
                    src="/ai-avatar.png"
                    alt="SpaceFlex AI"
                    width={34}
                    height={34}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span
                  className={cn(
                    "transition-colors",
                    isOpen
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 bg-clip-text text-transparent font-extrabold"
                      : "text-faint hover:text-ink font-medium"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href.split("?")[0]) &&
                tab.href !== "/";
          const Icon = tab.icon;
          const href = tab.label === "Search" ? "/properties?search=open" : tab.href;

          return (
            <Link
              key={tab.label}
              href={href}
              onClick={(e) => {
                if (tab.label === "Search" && pathname === "/properties") {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("sf:open-search-modal"));
                }
              }}
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
