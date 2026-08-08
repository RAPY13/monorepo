"use client";

import type { ChangeEvent } from "react";
import type { RapSheetData } from "./types";
import AvatarSelector, {
  type AvatarChoice,
} from "./AvatarSelector";

type StepIdentityProps = {
  data: RapSheetData;

  update: (
    key: keyof RapSheetData,
    value: RapSheetData[keyof RapSheetData]
  ) => void;
};

const DEFAULT_AVATARS = {
  male: "/images/avatars/male-default.jpeg",
  female: "/images/avatars/female-default.jpeg",
} as const;

export default function StepIdentity({
  data,
  update,
}: StepIdentityProps) {
  function uploadAvatarFile(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    update("avatarUrl", previewUrl);
  }

  function handleAvatarChange(
    choice: AvatarChoice,
    image?: string
  ) {
    if (choice === "male") {
      update("avatarUrl", DEFAULT_AVATARS.male);
      return;
    }

    if (choice === "female") {
      update("avatarUrl", DEFAULT_AVATARS.female);
      return;
    }

    if (choice === "custom" && image) {
      update("avatarUrl", image);
    }
  }

  function getAvatarChoice(): AvatarChoice | undefined {
    if (!data.avatarUrl) {
      return undefined;
    }

    if (data.avatarUrl === DEFAULT_AVATARS.male) {
      return "male";
    }

    if (data.avatarUrl === DEFAULT_AVATARS.female) {
      return "female";
    }

    return "custom";
  }

  return (
    <section className="space-y-10">
      {/* Header */}
      <div>
        <div className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
          Step 1
        </div>

        <h1 className="mt-3 text-5xl font-black">
          Who Are You?
        </h1>

        <p className="mt-5 max-w-xl leading-8 text-zinc-400">
          Let's build your Rap Sheet.
          This becomes your public identity inside RapYard.
        </p>
      </div>

      <div className="space-y-8">
        {/* Rap Name */}
        <div>
          <label
            htmlFor="rapName"
            className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400"
          >
            Rap Name
          </label>

          <input
            id="rapName"
            value={data.rapName}
            onChange={(e) =>
              update("rapName", e.target.value)
            }
            placeholder="BIG LO"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-lg outline-none transition focus:border-orange-500"
          />
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400"
          >
            Username
          </label>

          <input
            id="username"
            value={data.username}
            onChange={(e) =>
              update("username", e.target.value)
            }
            placeholder="@biglo"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-lg outline-none transition focus:border-orange-500"
          />
        </div>

        {/* Avatar */}
        <AvatarSelector
          value={getAvatarChoice()}
          customPreview={
            data.avatarUrl &&
            data.avatarUrl !== DEFAULT_AVATARS.male &&
            data.avatarUrl !== DEFAULT_AVATARS.female
              ? data.avatarUrl
              : undefined
          }
          onChange={handleAvatarChange}
        />

        {/* Existing upload compatibility */}
        <div className="hidden">
          <input
            type="file"
            accept="image/*"
            onChange={uploadAvatarFile}
          />
        </div>
      </div>
    </section>
  );
}