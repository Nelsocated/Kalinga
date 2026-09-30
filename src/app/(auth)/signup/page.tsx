"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { signupAction } from "@/src/app/actions/auth";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const result = await signupAction({
        email,
        password,
        full_name: fullName,
        username,
      });

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      router.push("/site/home");
    } catch {
      setFormError("Couldn't reach Kalinga. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <h1 className="text-headline text-ink">Create an account</h1>
      <p className="mt-1 text-sm text-muted">Like pets, message shelters and apply to adopt.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
          required
        />
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          hint="At least 3 characters. Shelters see this on your messages."
          required
        />
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
          autoComplete="new-password"
          required
        />

        {formError ? (
          <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
            {formError}
          </p>
        ) : null}

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-sm text-ink-soft">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
            Log in
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
