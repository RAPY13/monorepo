"use client";

import Image from "next/image";
import { Check, ImagePlus, Upload } from "lucide-react";
import { useRef, useState } from "react";

export type AvatarChoice = "male" | "female" | "custom";

type AvatarSelectorProps = {
  value?: AvatarChoice;
  customPreview?: string;
  onChange: (choice: AvatarChoice, image?: string) => void;
};

const DEFAULT_AVATARS = {
  male: "/images/avatars/male-default.jpeg",
  female: "/images/avatars/female-default.jpeg",
};

export default function AvatarSelector({
  value,
  customPreview,
  onChange,
}: AvatarSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(customPreview ?? "");

  function selectDefault(choice: "male" | "female") {
    setPreview("");
    onChange(choice);
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
    onChange("custom", objectUrl);
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
          Profile Avatar
        </div>

        <h3 className="mt-2 text-xl font-black text-white">
          Choose your identity
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Choose a RapYard avatar or upload your own image.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => selectDefault("male")}
          className={[
            "group relative overflow-hidden rounded-xl border p-2 text-left transition",
            value === "male"
              ? "border-orange-500 bg-orange-500/5"
              : "border-zinc-800 bg-black hover:border-zinc-600",
          ].join(" ")}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={DEFAULT_AVATARS.male}
              alt="RapYard male avatar"
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />

            {value === "male" && (
              <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-black">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="px-2 pb-2 pt-3">
            <div className="text-sm font-black uppercase tracking-wider text-white">
              Male
            </div>
            <div className="mt-1 text-xs text-zinc-600">
              RapYard default
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => selectDefault("female")}
          className={[
            "group relative overflow-hidden rounded-xl border p-2 text-left transition",
            value === "female"
              ? "border-orange-500 bg-orange-500/5"
              : "border-zinc-800 bg-black hover:border-zinc-600",
          ].join(" ")}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={DEFAULT_AVATARS.female}
              alt="RapYard female avatar"
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />

            {value === "female" && (
              <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-black">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="px-2 pb-2 pt-3">
            <div className="text-sm font-black uppercase tracking-wider text-white">
              Female
            </div>
            <div className="mt-1 text-xs text-zinc-600">
              RapYard default
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={[
            "group relative overflow-hidden rounded-xl border p-2 text-left transition",
            value === "custom"
              ? "border-orange-500 bg-orange-500/5"
              : "border-zinc-800 bg-black hover:border-zinc-600",
          ].join(" ")}
        >
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-zinc-950">
            {preview ? (
              <Image
                src={preview}
                alt="Your uploaded avatar"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <ImagePlus className="h-10 w-10 text-zinc-700 transition group-hover:text-orange-500" />

                <span className="mt-3 text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Upload Image
                </span>
              </div>
            )}

            {value === "custom" && (
              <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-black">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="px-2 pb-2 pt-3">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
              <Upload className="h-4 w-4 text-orange-500" />
              Your Own
            </div>

            <div className="mt-1 text-xs text-zinc-600">
              Upload your image
            </div>
          </div>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="rounded-md border border-zinc-900 bg-zinc-950 px-4 py-3 text-xs text-zinc-600">
        <span className="font-bold text-zinc-500">TIP:</span>{" "}
        You can change your avatar later from your profile settings.
      </div>
    </div>
  );
}
