"use client";

import type { ChangeEvent } from "react";
import type { RapSheetData } from "./types";

type StepIdentityProps = {
  data: RapSheetData;

  update: <K extends keyof RapSheetData>(
    key: K,
    value: RapSheetData[K]
  ) => void;
};

export default function StepIdentity({
  data,
  update,
}: StepIdentityProps) {
  function uploadAvatarFile(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Temporary until avatar uploads are wired to Supabase.
    const previewUrl = URL.createObjectURL(file);

    update("avatarUrl", previewUrl);
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
          Step 1
        </p>

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
          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
            Rap Name
          </label>

          <input
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
          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
            Username
          </label>

          <input
            value={data.username}
            onChange={(e) =>
              update("username", e.target.value)
            }
            placeholder="@biglo"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-lg outline-none transition focus:border-orange-500"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
            Avatar
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={uploadAvatarFile}
            className="block w-full rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-5 text-sm file:mr-5 file:rounded-lg file:border-0 file:bg-orange-500 file:px-5 file:py-3 file:font-semibold file:text-black"
          />
        </div>
      </div>
    </section>
  );
}