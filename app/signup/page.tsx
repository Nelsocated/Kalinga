// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setName] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, username }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(json?.error ?? "Signup failed.");
        return;
      }

      router.push("/home");
    } catch {
      setFormError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="flex w-full max-w-5xl items-center gap-10">
        <div className="md:flex flex-1 justify-center">
          <h1 className="flex text-2xl font-bold text-black text-3xl justify-center">
            KALINGA
          </h1>
        </div>

        <div className="w-full max-w-md rounded-2xl p-6 shadow-sm bg-[#ffdd6f]">
          <h1 className="flex text-2xl font-semibold text-black justify-center">
            Create Account
          </h1>
          <p className="mt-1 text-xl text-black">Get started on Kalinga!</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4 shadow-m">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
            />

            <Input
              label="Fullname"
              value={fullName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fullname"
              required
            />

            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="nelson"
              required
            />

            {formError ? (
              <p className="text-sm text-red-600">{formError}</p>
            ) : null}

            <Button type="submit" loading={loading}>
              Submit
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <a className="font-medium text-black hover:underline" href="/login">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
