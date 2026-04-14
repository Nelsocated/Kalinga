"use client";

import { Suspense, type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import kalinga_logo from "@/public/kalinga_logo.svg";
import { getAuthUser } from "@/src/lib/utils/clientAuth";

type Step = 1 | 2 | 3;
type UploadFieldKey =
  | "registration_certificate"
  | "owner_valid_id"
  | "lease_contract"
  | "shelter_photo";

const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  1: {
    title: "Create Shelter Account",
    subtitle: "Sign up first so we can attach your shelter application.",
  },
  2: {
    title: "Shelter Details",
    subtitle: "Tell us the shelter name and complete address.",
  },
  3: {
    title: "Shelter Verification",
    subtitle: "Upload the required documents for manual review.",
  },
};

function UploadField({
  label,
  accept,
  onChange,
}: {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-black">{label}</span>
      <div className="rounded-[15px] border border-black/20 bg-white px-3 py-2">
        <input
          type="file"
          accept={accept}
          className="block w-full text-sm text-black file:mr-3 file:rounded-[15px] file:border file:border-primary file:bg-background file:px-3 file:py-1 file:text-sm file:font-medium file:text-black hover:file:bg-primary"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </div>
    </label>
  );
}

function ShelterSignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [completeAddress, setCompleteAddress] = useState("");
  const [files, setFiles] = useState<Record<UploadFieldKey, File | null>>({
    registration_certificate: null,
    owner_valid_id: null,
    lease_contract: null,
    shelter_photo: null,
  });

  const currentStepCopy = useMemo(() => STEP_COPY[step], [step]);
  const displayStep = isLoggedIn ? Math.max(step - 1, 1) : step;
  const totalSteps = isLoggedIn ? 2 : 3;

  useEffect(() => {
    let mounted = true;

    async function syncAuthState() {
      const authUser = await getAuthUser();

      if (!mounted) return;

      const loggedIn = !!authUser;
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const requestedStep = Number(searchParams.get("step"));
        setStep(requestedStep === 3 ? 3 : 2);
      } else {
        setStep(1);
      }
    }

    void syncAuthState();

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  function updateFile(key: UploadFieldKey, file: File | null) {
    setFiles((current) => ({
      ...current,
      [key]: file,
    }));
  }

  function validateStep(currentStep: Step) {
    if (currentStep === 1) {
      if (isLoggedIn) {
        return null;
      }

      if (
        !email.trim() ||
        !password.trim() ||
        !fullName.trim() ||
        !username.trim()
      ) {
        return "Please complete your account details first.";
      }
    }

    if (currentStep === 2) {
      if (!shelterName.trim() || !completeAddress.trim()) {
        return "Please provide the shelter name and complete address.";
      }
    }

    if (currentStep === 3) {
      const missingFiles = Object.values(files).some((file) => !file);

      if (missingFiles) {
        return "Please upload all required shelter documents before submitting.";
      }
    }

    return null;
  }

  function goNext() {
    const error = validateStep(step);

    if (error) {
      setFormError(error);
      return;
    }

    setFormError(null);

    if (step < 3) {
      setStep((current) => (current + 1) as Step);
    }
  }

  function goBack() {
    setFormError(null);

    if (step > 1) {
      setStep((current) => (current - 1) as Step);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    const error = validateStep(3);

    if (error) {
      setFormError(error);
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      const body = new FormData();

      if (!isLoggedIn) {
        body.append("email", email.trim());
        body.append("password", password);
        body.append("full_name", fullName.trim());
        body.append("username", username.trim());
      }

      body.append("shelter_name", shelterName.trim());
      body.append("complete_address", completeAddress.trim());
      body.append(
        "registration_certificate",
        files.registration_certificate as File,
      );
      body.append("owner_valid_id", files.owner_valid_id as File);
      body.append("lease_contract", files.lease_contract as File);
      body.append("shelter_photo", files.shelter_photo as File);

      const res = await fetch("/api/auth/shelter-signup", {
        method: "POST",
        body,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(json?.error ?? "Shelter signup failed.");
        return;
      }

      setShowSuccessModal(true);
    } catch {
      setFormError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-svh overflow-hidden bg-primary p-3 sm:p-4 lg:p-6">
      <div className="mx-auto flex h-full w-full max-w-7xl rounded-[15px] bg-innerbg shadow-lg">
        <main className="flex h-full w-full items-center justify-center p-8 py-1">
          <div className="grid h-full w-full items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="hidden h-full items-center justify-center lg:flex">
              <div className="flex max-w-md flex-col items-center justify-center">
                <Image
                  src={kalinga_logo}
                  alt="kalinga-logo"
                  width={300}
                  height={300}
                  priority
                  className="h-auto w-45 sm:w-55 lg:w-65 xl:w-75"
                />
                <h1 className="mt-4 text-center text-xl font-medium text-black sm:text-2xl lg:text-3xl">
                  Give Care. Give Love.
                  <br />A home for every paw.
                </h1>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-md flex-col justify-center rounded-[15px] border-2 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5 lg:px-6 lg:py-6">
              <div className="mb-3">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/50">
                  Step {displayStep} of {totalSteps}
                </p>
                <h1 className="mt-1 text-center text-subtitle font-bold text-black">
                  {currentStepCopy.title}
                </h1>
                <p className="mt-1 text-center text-description text-black">
                  {currentStepCopy.subtitle}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-3">
                {step === 1 && !isLoggedIn ? (
                  <>
                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Password"
                      autoComplete="new-password"
                      required
                    />

                    <Input
                      label="Fullname"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Enter you Fullname"
                      required
                    />

                    <Input
                      label="Username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Enter your Username"
                      required
                    />
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <Input
                      label="Shelter Name"
                      value={shelterName}
                      onChange={(event) => setShelterName(event.target.value)}
                      placeholder="Shelter name"
                      required
                    />

                    <Input
                      label="Complete Address"
                      value={completeAddress}
                      onChange={(event) =>
                        setCompleteAddress(event.target.value)
                      }
                      placeholder="Complete shelter address"
                      required
                    />
                  </>
                ) : null}

                {step === 3 ? (
                  <div className="space-y-2">
                    <UploadField
                      label="Registration Certificate"
                      onChange={(file) =>
                        updateFile("registration_certificate", file)
                      }
                    />

                    <UploadField
                      label="Valid ID of the Owner"
                      onChange={(file) => updateFile("owner_valid_id", file)}
                    />

                    <UploadField
                      label="Notarized Valid Contract of Lease"
                      onChange={(file) => updateFile("lease_contract", file)}
                    />

                    <UploadField
                      label="Photo of the Shelter"
                      accept="image/*"
                      onChange={(file) => updateFile("shelter_photo", file)}
                    />
                  </div>
                ) : null}

                {formError ? (
                  <p className="text-sm text-red-600">{formError}</p>
                ) : null}

                <div className="flex gap-3 pt-1">
                  {step > 1 ? (
                    <Button
                      type="button"
                      onClick={goBack}
                      className="w-full border-black/20 bg-white flex justify-center hover:scale-105"
                    >
                      Back
                    </Button>
                  ) : null}

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={goNext}
                      className="w-full flex justify-center bg-primary hover:scale-105"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full flex justify-center bg-primary hover:scale-105"
                    >
                      Submit Application
                    </Button>
                  )}
                </div>
              </form>

              <hr className="mx-auto my-3 w-full border-black/50" />

              {isLoggedIn ? (
                <Button
                  onClick={() => router.push("/site/home")}
                  className="w-full flex justify-center hover:scale-105"
                >
                  Back to Home
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    router.push(
                      `/login?next=${encodeURIComponent("/shelterSignup?step=2")}`,
                    )
                  }
                  className="w-full flex justify-center hover:scale-105"
                >
                  Log in Instead
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
            <h2 className="text-center text-lg font-bold text-black">
              Application Submitted
            </h2>
            <p className="mt-3 text-center text-sm text-black/70">
              Your shelter application has been received. You are signed in as a
              regular user for now while we review your documents and contact
              you with further details.
            </p>
            <Button
              onClick={() => router.push("/site/home")}
              className="mt-5 w-full flex justify-center hover:scale-105"
            >
              Continue to Home
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ShelterSignupPage() {
  return (
    <Suspense fallback={null}>
      <ShelterSignupPageContent />
    </Suspense>
  );
}
