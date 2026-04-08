// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import kalinga_logo from "@/public/kalinga_logo.svg";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/site/home";

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

      router.push(nextPath);
    } catch {
      setFormError("Network error. Try again.");
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] w-full max-w-7xl rounded-[15px] bg-background shadow-lg sm:min-h-[calc(100svh-3rem)]">
        <div className="col-start-1 row-start-1 z-10 justify-self-end self-start p-6 sm:p-6">
          <Button onClick={() => router.push("/site/about")}>About Us</Button>
        </div>

        <main className="col-start-1 row-start-1 flex min-h-0 items-center justify-center p-4 pt-20 sm:p-6 sm:pt-24 lg:p-10">
          <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="hidden min-h-0 flex-col items-center justify-center lg:flex">
              <Image
                src={kalinga_logo}
                alt="kalinga-logo"
                width={300}
                height={300}
                priority
              />
              <h1 className="mt-4 text-center text-2xl font-medium text-black sm:text-3xl">
                Will you help us find
                <br />
                our fur-ever homes?
              </h1>
            </div>

            <div className="mx-auto w-full max-w-md rounded-[15px] border-2 bg-white p-5 shadow-sm sm:p-6">
              <form onSubmit={onSubmit} className="space-y-4">
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
                  autoComplete="current-password"
                  required
                />

                {formError ? (
                  <p className="text-sm text-red-600">{formError}</p>
                ) : null}

                <Button type="submit" loading={loading} className="w-full">
                  Log in
                </Button>
              </form>

              <hr className="mx-auto my-3 w-full border-black/50" />

              <Button onClick={() => router.push("/signup")} className="w-full">
                Sign up
              </Button>

              <p className="mt-4 text-sm text-black">
                Do you own a shelter?{" "}
                <a
                  className="font-medium text-black hover:underline"
                  href="/shelterSignup"
                >
                  Create a Page
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
