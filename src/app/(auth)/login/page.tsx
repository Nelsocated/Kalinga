"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { loginAction } from "@/src/app/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/site/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const result = await loginAction({ email, password });

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      router.push(nextPath);
    } catch {
      setFormError("Couldn't reach Kalinga. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <h1 className="text-headline text-ink">Log in</h1>
      <p className="mt-1 text-sm text-muted">Welcome back. Pick up where you left off.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {formError ? (
          <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
            {formError}
          </p>
        ) : null}

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          Log in
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-sm text-ink-soft">
        <p>
          New to Kalinga?{" "}
          <Link href="/signup" className="font-semibold text-ink underline underline-offset-4">
            Create an account
          </Link>
        </p>
        <p>
          Run a shelter?{" "}
          <Link href="/shelterSignup" className="font-semibold text-ink underline underline-offset-4">
            Apply as a shelter
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
