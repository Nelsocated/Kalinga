// app/admin/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import kalinga_logo from "@/public/kalinga_logo.svg";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json?.error ?? "Login failed.");
        return;
      }

      // Success - redirect to admin dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setFormError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] w-full max-w-7xl rounded-[15px] bg-background shadow-lg sm:min-h-[calc(100svh-3rem)]">

        {/* Back button */}
        <div className="col-start-1 row-start-1 z-10 justify-self-start self-start p-6">
          <Button onClick={() => { router.back(); router.push("/"); }}>←</Button>
        </div>

        <main className="col-start-1 row-start-1 flex min-h-0 items-center justify-center p-4 pt-20 sm:p-6 sm:pt-24 lg:p-10">
          <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-16">

            {/* Left — Logo */}
            <div className="hidden min-h-0 flex-col items-center justify-center lg:flex">
              <Image
                src={kalinga_logo}
                alt="kalinga-logo"
                width={300}
                height={300}
                priority
              />
              <h1 className="mt-4 text-center text-2xl font-medium text-black sm:text-3xl">
                Will you help us find our 
                fur-ever homes?
              </h1>
            </div>

            {/* Right — Admin Login Form */}
            <div className="mx-auto w-full max-w-md">
              <h2 className="mb-6 text-center text-2xl font-bold text-primary">
                Admin Login
              </h2>

              <div className="rounded-[15px] border-2 bg-white p-6 shadow-lg">
                <form onSubmit={onSubmit} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                  />

                  <Input
                    label="Username"
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  {formError && (
                    <p className="rounded px-3 py-2 text-sm text-red-600 bg-red-50">{formError}</p>
                  )}

                  <Button type="submit" loading={loading} className="w-full h-12 text-lg">
                    Sign In
                  </Button>
                </form>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
