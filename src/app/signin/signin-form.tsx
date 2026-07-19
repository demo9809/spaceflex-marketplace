"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { useAuth } from "@/lib/store/auth";

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.9z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.1-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.1 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.9-3z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3c.9-3 3.7-5 6.9-5z"
      />
    </svg>
  );
}

export function SignInForm({ redirect = true }: { redirect?: boolean }) {
  const router = useRouter();
  const { signIn } = useAuth();

  function complete() {
    signIn();
    if (redirect) router.push("/dashboard");
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        complete();
      }}
    >
      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={complete}
      >
        <GoogleMark />
        Continue with Google
      </Button>
      <div className="flex items-center gap-4 py-1">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs uppercase tracking-[0.14em] text-faint">
          or with email
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div>
        <Label htmlFor="si-email">Email</Label>
        <Input
          id="si-email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="si-pass">Password</Label>
          <button
            type="button"
            className="mb-1.5 text-xs font-medium text-brass hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="si-pass"
          type="password"
          required
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        Sign in
      </Button>
    </form>
  );
}
