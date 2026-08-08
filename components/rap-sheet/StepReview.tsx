"use client";

import Image from "next/image";

import type { RapSheetData } from "./types";

type StepReviewProps = {
  user: {
    id: string;
    email?: string;
  };
  data: RapSheetData;
};

export default function StepReview({
  user,
  data,
}: StepReviewProps) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
          Final Step
        </p>

        <h1 className="mt-4 text-4xl font-black uppercase sm:text-5xl">
          Your Rap Sheet
        </h1>

        <p className="mt-5 text-base text-zinc-400 sm:text-lg">
          Review your creator profile before entering The Yard.
        </p>
      </div>

      {/* Creator Card */}
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-gradient-to-r from-orange-500/20 via-orange-500/5 to-transparent p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-orange-500">
              {data.avatarUrl ? (
                <Image
                  src={data.avatarUrl}
                  alt={data.rapName || "Creator avatar"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-4xl font-black text-orange-500">
                  {data.rapName
                    ? data.rapName.charAt(0).toUpperCase()
                    : "R"}
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-black sm:text-4xl">
                {data.rapName || "Your Rap Name"}
              </h2>

              <p className="mt-2 text-zinc-400">
                @{data.username || "username"}
              </p>

              {user.email && (
                <p className="mt-1 text-sm text-zinc-500">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8 md:gap-10">
          <ReviewItem
            label="Primary Role"
            value={data.primaryRole || "Not Selected"}
          />

          <ReviewItem
            label="City"
            value={data.city || "Not Added"}
          />

          <ReviewItem
            label="Genres"
            value={
              data.genres.length > 0
                ? data.genres.join(", ")
                : "Not Selected"
            }
          />

          <ReviewItem
            label="Username"
            value={data.username || "Not Set"}
          />
        </div>

        {/* Bio */}
        <div className="border-t border-zinc-800 px-6 py-8 sm:px-8">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
            Bio
          </h3>

          <p className="leading-8 text-zinc-400">
            {data.bio || "No bio added yet."}
          </p>
        </div>

        {/* Checklist */}
        <div className="border-t border-zinc-800 px-6 py-8 sm:px-8">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
            Ready To Enter
          </h3>

          <div className="space-y-4">
            <ChecklistItem text="Identity Complete" />
            <ChecklistItem text="Profile Complete" />
            <ChecklistItem
              text={
                data.primaryRole
                  ? "Role Selected"
                  : "Role Not Selected"
              }
            />
            <ChecklistItem
              text={
                data.genres.length > 0
                  ? "Music Profile Complete"
                  : "Add At Least One Genre"
              }
            />
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-black leading-tight sm:text-3xl">
          THIS IS YOUR LEGACY.
          <br />
          <span className="text-orange-500">
            SET IT RIGHT.
          </span>
        </h2>
      </div>
    </section>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>

      <p className="text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function ChecklistItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-black">
        ✓
      </div>

      <span className="text-zinc-300">
        {text}
      </span>
    </div>
  );
}