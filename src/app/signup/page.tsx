import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Save searches, follow agents, and get first access to new launches."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-brass underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
