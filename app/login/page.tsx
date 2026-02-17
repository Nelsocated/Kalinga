// app/login/page.tsx;
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setloading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setloading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(json?.error ?? "Login failed.");
        return;
      }

      router.push("/home");
    } catch {
      setFormError("Network error. Try again.");
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="max-w-7xl px-4 py-4 flex shadow-m justify-end">
        <Link href="/about" className="text-m text-black hover:underline">
          About Us
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="flex w-full max-w-5xl items-center gap-10">
          <div className="md:flex flex-1 justify-center">
            <h1 className="flex text-2xl font-bold text-black text-3xl justify-center">
              Will you help us find <br /> our fur-ever homes?
            </h1>
          </div>

          <div className="w-full max-w-md rounded-2xl p-6 shadow-sm bg-[#ffdd6f]">
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

              {formError ? (
                <p className="text-sm text-red-600">{formError}</p>
              ) : null}

              <Button type="submit" loading={loading}>
                Log in
              </Button>
            </form>

            <hr className="w-full mx-auto m-3" />

            <Button onClick={() => router.push("/signup")}>Sign up</Button>

            <p className="mt-4 text-sm text-black-600">
              Do you own a shelter?{" "}
              <a
                className="font-medium text-black hover:underline"
                href="/shelterCreation"
              >
                Create a Page
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
