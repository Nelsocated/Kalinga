// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import kalinga_logo from "@/public/kalinga_logo.svg";
import Image from "next/image";

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

      router.push("/site/home");
    } catch {
      setFormError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#ffdd6f] flex items-center justify-center">
      <div className="bg-[#f6f3ee] w-[180svh] h-[85svh] rounded-2xl shadow-lg flex items-center justify-center">
        <main className="flex w-full max-w-5xl items-center gap-20">
          <div className="md:flex flex-1 flex-col items-center justify-center">
            <Image
              src={kalinga_logo}
              alt="kalinga-logo"
              width={300}
              height={300}
              priority
            ></Image>
            <h1 className="flex text-3xl text-black font-semibold text-center">
              Will you help us find our
              <br />
              fur-ever homes?
            </h1>
          </div>

          <div className="w-full max-w-md rounded-2xl p-6 shadow-sm bg-white border-2 border-[#f3be0f]">
            <h1 className="flex text-3xl font-bold text-black justify-center">
              Create an Account
            </h1>
            <p className="mt-1 text-center text-xl text-black">
              Get started on Kalinga!
            </p>

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
                placeholder="Username"
                required
              />

              {formError ? (
                <p className="text-sm text-red-600">{formError}</p>
              ) : null}

              <Button type="submit" loading={loading}>
                Submit
              </Button>
            </form>

            <p className="mt-4 text-sm text-black-600">
              Already have an account?{" "}
              <a
                className="font-medium text-black hover:underline"
                  href="/site/login"
              >
                Log in
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
