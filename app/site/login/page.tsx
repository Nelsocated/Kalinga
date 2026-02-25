// app/login/page.tsx;
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import kalinga_logo from "@/public/kalinga_logo.svg";
import Image from "next/image";

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

      router.push("/site/home");
    } catch {
      setFormError("Network error. Try again.");
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#ffdd6f] flex items-center justify-center">
      <div className="bg-[#f6f3ee] w-[180svh] h-[85svh] rounded-2xl shadow-lg flex items-center justify-center">
        <div className="fixed top-20 right-30">
          <Button onClick={() => router.push("/site/aboutus")}>About Us</Button>
        </div>

        <main className="flex w-full max-w-5xl items-center gap-20">
          <div className="md:flex flex-1 flex-col pb-5 items-center justify-center">
            <Image
              src={kalinga_logo}
              alt="kalinga-logo"
              width={300}
              height={300}
              priority
            ></Image>
            <h1 className="flex text-3xl text-black font-semibold justify-center">
              Will you help us find <br /> our fur-ever homes?
            </h1>
          </div>

          <div className="w-full max-w-md rounded-2xl p-6 shadow-sm bg-white border-2 border-[#f3be0f]">
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

            <Button onClick={() => router.push("/site/signup")}>Sign up</Button>

            <p className="mt-4 text-sm text-black-600">
              Do you own a shelter?{" "}
              <a
                className="font-medium text-black hover:underline"
                href="/site/shelterCreation"
              >
                Create a Page
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
