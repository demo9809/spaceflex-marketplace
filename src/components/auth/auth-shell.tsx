import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/data/properties";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={IMG.interiorLux}
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <blockquote className="absolute bottom-12 left-12 right-12 text-paper">
          <p className="font-display text-3xl font-medium leading-snug text-balance">
            “We found our Lusail apartment in nine days — including the
            viewing trip.”
          </p>
          <footer className="mt-4 text-sm text-paper/70">
            Amira & Faisal · Relocated Doha, 2026
          </footer>
        </blockquote>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-h2 font-medium tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-muted">{footer}</p>
          <p className="mt-6 text-center text-xs leading-relaxed text-faint">
            By continuing you agree to SpaceFlex&apos;s{" "}
            <Link href="/legal" className="underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
