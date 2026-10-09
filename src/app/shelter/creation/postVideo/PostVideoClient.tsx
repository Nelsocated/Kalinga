"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Play, VideoCamera } from "@phosphor-icons/react";

import WebTemplate from "@/src/components/template/WebTemplate";
import Button, { LinkButton } from "@/src/components/ui/Button";
import Textarea from "@/src/components/ui/Textarea";
import LinkedPetField from "@/src/components/forms/LinkedPetField";
import AvailabilityField from "@/src/components/forms/AvailabilityField";
import LinkPetModal from "@/src/components/modal/LinkPetModal";
import { cn } from "@/src/lib/cn";
import type { PetCardProps } from "@/src/lib/types/shelters";

type Props = {
  pets: PetCardProps[];
  initialError: string | null;
  initialPetId: string;
};

type FormState = {
  caption: string;
  petId: string;
  adoptionStatus: "available" | "not_available" | "";
};

type FieldErrors = Partial<Record<"video" | "caption" | "pet", string>>;

const MAX_VIDEO_MB = 100;
const MAX_CAPTION = 300;

/** Sends the form with upload progress (fetch can't report it). Resolves with the new video's id. */
function uploadVideo(body: FormData, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/videos");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const result = xhr.response as { data?: { id: string }; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300 && result?.data?.id) resolve(result.data.id);
      else reject(new Error(result?.error || "Couldn't post the video. Try again."));
    };
    xhr.onerror = () => reject(new Error("The upload stopped. Check your connection and try again."));
    xhr.send(body);
  });
}

export default function PostVideoClient({ pets, initialError, initialPetId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({ caption: "", petId: initialPetId, adoptionStatus: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(initialError);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPetPicker, setShowPetPicker] = useState(false);
  const [posted, setPosted] = useState<{ mediaId: string; petName: string } | null>(null);

  const submitting = progress !== null;
  const selectedPet = useMemo(() => pets.find((pet) => pet.id === form.petId) ?? null, [pets, form.petId]);

  // Map PetCardProps to ShelterPetMini for LinkPetModal
  const modalPets = useMemo(
    () =>
      pets.map((pet) => ({
        id: pet.id,
        imageUrl: pet.imageUrl ?? null,
        petName: pet.petName ?? null,
        gender: (pet.gender ?? "unknown") as "male" | "female" | "unknown",
        shelterName: pet.shelterName ?? null,
        shelterLogo: pet.shelterLogo ?? null,
      })),
    [pets],
  );

  // Free the local preview when it's replaced or the page closes
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setFieldErrors((prev) => ({ ...prev, video: "That isn't a video file. Choose an MP4 or MOV." }));
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        video: `That video is ${Math.round(file.size / 1024 / 1024)} MB. Trim it to under ${MAX_VIDEO_MB} MB.`,
      }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, video: undefined }));
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const errors: FieldErrors = {
      video: selectedFile ? undefined : "Choose a video to post.",
      caption: form.caption.trim() ? undefined : "Add a caption so people know who they're watching.",
      pet: form.petId ? undefined : "Choose which pet this video is about.",
    };
    setFieldErrors(errors);
    if (errors.video || errors.caption || errors.pet || !selectedFile) return;

    setProgress(0);
    try {
      const body = new FormData();
      body.append("file", selectedFile);
      body.append("petId", form.petId);
      body.append("caption", form.caption.trim());
      body.append("adoptionStatus", form.adoptionStatus);

      const mediaId = await uploadVideo(body, setProgress);
      setPosted({ mediaId, petName: selectedPet?.petName ?? "your pet" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post the video. Try again.");
    } finally {
      setProgress(null);
    }
  }

  function startOver() {
    setPosted(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setForm({ caption: "", petId: "", adoptionStatus: "" });
    setFieldErrors({});
  }

  if (posted) {
    return (
      <WebTemplate
        header="Post a video"
        main={
          <div className="flex max-w-xl flex-col items-start gap-5 py-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-approved/14 text-approved-text">
              <CheckCircle size={32} weight="fill" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2" role="status">
              <h2 className="text-headline text-ink">
                {posted.petName}&apos;s video is live
              </h2>
              <p className="text-ink-soft">It&apos;s in the For You feed now, where adopters scroll.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={`/site/home/pet/${posted.mediaId}`} variant="primary" icon={<Play weight="fill" aria-hidden="true" />}>
                Watch it in the feed
              </LinkButton>
              <Button variant="secondary" onClick={startOver}>
                Post another video
              </Button>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <>
      <WebTemplate
        header="Post a video"
        main={
          <form onSubmit={handleSubmit} noValidate className="grid gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">Video</span>
              {previewUrl ? (
                <video
                  src={previewUrl}
                  className="aspect-9/16 w-full rounded-lg bg-sunshine-soft object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-describedby={fieldErrors.video ? "video-error" : "video-hint"}
                  className={cn(
                    "flex aspect-9/16 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-card text-center transition-colors hover:bg-sunshine-wash",
                    fieldErrors.video ? "border-reject" : "border-line",
                  )}
                >
                  <VideoCamera size={28} className="text-ink" aria-hidden="true" />
                  <span className="text-sm font-semibold text-ink">Choose a video</span>
                  <span id="video-hint" className="px-4 text-xs text-muted">
                    Vertical and under a minute works best. Up to {MAX_VIDEO_MB} MB.
                  </span>
                </button>
              )}
              {fieldErrors.video ? (
                <p id="video-error" className="text-xs font-medium text-reject-text">
                  {fieldErrors.video}
                </p>
              ) : null}
              {previewUrl && !submitting ? (
                <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="w-fit">
                  Change video
                </Button>
              ) : null}
              <input ref={fileInputRef} type="file" accept="video/*" className="sr-only" tabIndex={-1} onChange={handleFileChange} />
            </div>

            <div className="flex flex-col gap-6">
              <LinkedPetField
                pet={selectedPet}
                onChoose={() => setShowPetPicker(true)}
                hasPets={pets.length > 0}
                error={fieldErrors.pet}
              />
              <Textarea
                label="Caption"
                hint={`${form.caption.length}/${MAX_CAPTION}. Say who they are and what they love.`}
                error={fieldErrors.caption}
                value={form.caption}
                maxLength={MAX_CAPTION}
                onChange={(e) => updateField("caption", e.target.value)}
                rows={3}
              />
              <AvailabilityField value={form.adoptionStatus} onChange={(v) => updateField("adoptionStatus", v)} />

              {error ? (
                <p role="alert" className="rounded-md bg-reject/10 px-3 py-2 text-sm text-reject-text">
                  {error}
                </p>
              ) : null}

              {submitting ? (
                <div className="flex flex-col gap-2" role="status" aria-live="polite">
                  <div className="flex justify-between text-sm font-medium text-ink">
                    <span>{(progress ?? 0) < 100 ? "Uploading video" : "Posting to the feed"}</span>
                    <span className="tabular-nums">{progress}%</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-sunshine-soft"
                    role="progressbar"
                    aria-label="Upload progress"
                    aria-valuenow={progress ?? 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-sunshine-deep transition-[width] duration-200"
                      style={{ width: `${progress ?? 0}%` }}
                    />
                  </div>
                </div>
              ) : null}

              <Button type="submit" variant="primary" size="lg" loading={submitting} disabled={!pets.length} className="w-full sm:w-fit">
                Post video
              </Button>
            </div>
          </form>
        }
      />
      <LinkPetModal
        open={showPetPicker}
        pets={modalPets}
        onClose={() => setShowPetPicker(false)}
        onSelect={(pet) => {
          updateField("petId", pet.id);
          setFieldErrors((prev) => ({ ...prev, pet: undefined }));
          setShowPetPicker(false);
        }}
      />
    </>
  );
}
