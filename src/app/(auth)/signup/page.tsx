// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
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
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          username,
        }),
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
    <div className="h-svh overflow-hidden bg-primary p-3 sm:p-4 lg:p-6">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center rounded-[15px] bg-innerbg shadow-lg">
        <main className="flex h-full w-full items-center justify-center p-3 sm:p-4 lg:p-6">
          <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="hidden h-full min-h-0 flex-col items-center justify-center lg:flex">
              <Image
                src={kalinga_logo}
                alt="kalinga-logo"
                width={300}
                height={300}
                priority
              />
              <h1 className="mt-4 text-center text-2xl font-medium text-black xl:text-3xl">
                Give Care. Give Love.
                <br />A home for every paw.
              </h1>
            </div>

            <div className="mx-auto w-full max-w-md rounded-[15px] border-2 bg-white p-4 shadow-sm sm:p-5">
              <h1 className="flex justify-center text-subtitle font-bold text-black">
                Create an Account
              </h1>
              <p className="mt-1 text-center text-description text-black">
                Get started on Kalinga!
              </p>

              <form onSubmit={onSubmit} className="mt-2 space-y-3">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Username"
                  required
                />

                <Input
                  label="Fullname"
                  value={fullName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your Fullname"
                  required
                />

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
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                />

                {formError ? (
                  <p className="text-sm text-red-600">{formError}</p>
                ) : null}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full flex justify-center bg-primary hover:scale-105"
                >
                  Submit
                </Button>
              </form>

              <hr className="mx-auto my-3 w-full border-black/50" />

              <Button
                onClick={() => router.push("/login")}
                className="w-full flex justify-center hover:scale-105"
              >
                Log in
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
