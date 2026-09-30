"use client";

import { Suspense, type FormEvent, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, UploadSimple, X } from "@phosphor-icons/react";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import Modal from "@/src/components/ui/Modal";
import { getAuthUser } from "@/src/lib/utils/clientAuth";

type Step = 1 | 2 | 3;
type UploadFieldKey =
  | "registration_certificate"
  | "owner_valid_id"
  | "lease_contract"
  | "shelter_photo";

const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  1: {
    title: "Create your account",
    subtitle: "Your shelter application is attached to this account.",
  },
  2: {
    title: "Shelter details",
    subtitle: "The name and address people will see once you're approved.",
  },
  3: {
    title: "Verification documents",
    subtitle: "A Kalinga admin reviews these before your shelter goes live.",
  },
};

const PRIVATE_NOTE = "Only Kalinga admins can see this document.";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** File picker as a dashed drop zone; shows the chosen file with a preview. */
function FileDrop({
  label,
  accept,
  hint,
  file,
  onChange,
}: {
  label: string;
  accept?: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const preview = useMemo(
    () => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div className="flex flex-col gap-1.5">
      <span id={`${id}-label`} className="text-sm font-medium text-ink">
        {label}
      </span>

      {file ? (
        <div className="flex items-center gap-3 rounded-md border border-line bg-card p-3">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img src={preview} alt="" className="size-12 shrink-0 rounded-sm object-cover" />
          ) : (
            <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-sunshine-soft text-ink">
              <FileText size={24} aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{file.name}</p>
            <p className="text-xs text-muted">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${file.name}`}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-sunshine-wash"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onChange(e.dataTransfer.files?.[0] ?? null);
          }}
          className={[
            "flex cursor-pointer flex-col items-center gap-1 rounded-md border-2 border-dashed px-4 py-5 text-center transition-colors",
            "focus-within:border-ink focus-within:ring-2 focus-within:ring-ink/15",
            dragging ? "border-ink bg-sunshine-wash" : "border-line bg-card hover:bg-sunshine-wash",
          ].join(" ")}
        >
          <UploadSimple size={24} className="text-ink" aria-hidden="true" />
          <span className="text-sm font-medium text-ink">Choose a file or drop it here</span>
          <span className="text-xs text-muted">{accept === "image/*" ? "JPG or PNG" : "PDF, JPG or PNG"}</span>
          <input
            id={id}
            type="file"
            accept={accept ?? "application/pdf,image/*"}
            aria-labelledby={`${id}-label`}
            className="sr-only"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
      )}

      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function ShelterSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const copy = STEP_COPY[step];
  const displayStep = isLoggedIn ? Math.max(step - 1, 1) : step;
  const totalSteps = isLoggedIn ? 2 : 3;

  useEffect(() => {
    let mounted = true;

    getAuthUser().then((authUser) => {
      if (!mounted) return;
      const loggedIn = !!authUser;
      setIsLoggedIn(loggedIn);
      setStep(loggedIn ? (Number(searchParams.get("step")) === 3 ? 3 : 2) : 1);
    });

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  function updateFile(key: UploadFieldKey, file: File | null) {
    setFiles((current) => ({ ...current, [key]: file }));
  }

  function validateStep(currentStep: Step) {
    if (currentStep === 1 && !isLoggedIn) {
      if (!email.trim() || !password.trim() || !fullName.trim() || !username.trim()) {
        return "Fill in all four account fields to continue.";
      }
    }

    if (currentStep === 2 && (!shelterName.trim() || !completeAddress.trim())) {
      return "Add the shelter name and complete address to continue.";
    }

    if (currentStep === 3 && Object.values(files).some((file) => !file)) {
      return "Upload all four documents before you submit.";
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
    if (step < 3) setStep((current) => (current + 1) as Step);
  }

  function goBack() {
    setFormError(null);
    if (step > (isLoggedIn ? 2 : 1)) setStep((current) => (current - 1) as Step);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    // Enter on an earlier step moves forward instead of submitting
    if (step < 3) {
      goNext();
      return;
    }

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
      body.append("registration_certificate", files.registration_certificate as File);
      body.append("owner_valid_id", files.owner_valid_id as File);
      body.append("lease_contract", files.lease_contract as File);
      body.append("shelter_photo", files.shelter_photo as File);

      const res = await fetch("/api/auth/shelter-signup", { method: "POST", body });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(json?.error ?? "We couldn't submit your application. Try again.");
        return;
      }

      setShowSuccess(true);
    } catch {
      setFormError("Couldn't reach Kalinga. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const canGoBack = step > (isLoggedIn ? 2 : 1);

  return (
    <Card className="w-full max-w-lg p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink-soft">
          Step {displayStep} of {totalSteps}
        </p>
        <div
          role="progressbar"
          aria-label="Application progress"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={displayStep}
          className="h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-sunshine-deep transition-[width] duration-300 ease-out-expo"
            style={{ width: `${(displayStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <h1 className="mt-5 text-headline text-ink">{copy.title}</h1>
      <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {step === 1 && !isLoggedIn ? (
          <>
            <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" required />
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Input label="Shelter name" value={shelterName} onChange={(e) => setShelterName(e.target.value)} autoComplete="organization" required />
            <Input
              label="Complete address"
              value={completeAddress}
              onChange={(e) => setCompleteAddress(e.target.value)}
              autoComplete="street-address"
              required
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <FileDrop
              label="Registration certificate"
              hint={PRIVATE_NOTE}
              file={files.registration_certificate}
              onChange={(file) => updateFile("registration_certificate", file)}
            />
            <FileDrop
              label="Valid ID of the owner"
              hint={PRIVATE_NOTE}
              file={files.owner_valid_id}
              onChange={(file) => updateFile("owner_valid_id", file)}
            />
            <FileDrop
              label="Notarized contract of lease"
              hint={PRIVATE_NOTE}
              file={files.lease_contract}
              onChange={(file) => updateFile("lease_contract", file)}
            />
            <FileDrop
              label="Photo of the shelter"
              accept="image/*"
              hint="Shown on your shelter profile once you're approved."
              file={files.shelter_photo}
              onChange={(file) => updateFile("shelter_photo", file)}
            />
          </>
        ) : null}

        {formError ? (
          <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
            {formError}
          </p>
        ) : null}

        <div className="flex gap-3 pt-1">
          {canGoBack ? (
            <Button type="button" variant="secondary" size="lg" onClick={goBack} className="flex-1">
              Back
            </Button>
          ) : null}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-1">
            {step < 3 ? "Continue" : "Submit application"}
          </Button>
        </div>
      </form>

      <div className="mt-6 border-t border-line pt-5 text-sm text-ink-soft">
        {isLoggedIn ? (
          <Link href="/site/home" className="font-semibold text-ink underline underline-offset-4">
            Back to the feed
          </Link>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent("/shelterSignup?step=2")}`}
              className="font-semibold text-ink underline underline-offset-4"
            >
              Log in first
            </Link>
          </p>
        )}
      </div>

      <Modal
        open={showSuccess}
        onClose={() => router.push("/site/home")}
        title="Application submitted"
        footer={
          <Button variant="primary" onClick={() => router.push("/site/home")}>
            Continue to the feed
          </Button>
        }
      >
        <p className="text-sm text-ink-soft">
          We received your shelter application. You can use Kalinga as a regular member while an
          admin reviews your documents, and we&apos;ll contact you with the result.
        </p>
      </Modal>
    </Card>
  );
}

export default function ShelterSignupPage() {
  return (
    <Suspense fallback={null}>
      <ShelterSignupForm />
    </Suspense>
  );
}
