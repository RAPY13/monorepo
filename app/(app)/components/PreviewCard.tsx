"use client";

import Image from "next/image";

type PreviewCardProps = {
  rapName?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  genres?: string[];
  primaryRole?: string;
};

export default function PreviewCard({
  rapName = "Your Rap Name",
  username = "username",
  avatarUrl = "",
  bio = "Your bio will appear here...",
  city = "Unknown City",
  genres = [],
  primaryRole = "",
}: PreviewCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-orange-500/20 via-orange-400/5 to-transparent px-6 py-5 border-b border-zinc-800">

        <p className="text-xs uppercase tracking-[0.35em] text-orange-400">
          Live Preview
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Your Rap Sheet
        </h2>

      </div>

      {/* Avatar */}

      <div className="flex flex-col items-center px-8 pt-8">

        <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-orange-500">

          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={rapName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-5xl font-black text-orange-500">
              {rapName.charAt(0).toUpperCase()}
            </div>
          )}

        </div>

        <h3 className="mt-6 text-3xl font-black">
          {rapName}
        </h3>

        <p className="mt-1 text-zinc-400">
          @{username}
        </p>

      </div>

      {/* Info */}

      <div className="space-y-5 px-8 py-8">

        <InfoRow
          label="Role"
          value={primaryRole || "Not Selected"}
        />

        <InfoRow
          label="City"
          value={city}
        />

        <InfoRow
          label="Genres"
          value={
            genres.length
              ? genres.join(", ")
              : "Not Selected"
          }
        />

      </div>

      {/* Bio */}

      <div className="border-t border-zinc-800 px-8 py-6">

        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-orange-400">
          Bio
        </p>

        <p className="text-sm leading-7 text-zinc-400">
          {bio}
        </p>

      </div>

      {/* Footer */}

      <div className="border-t border-zinc-800 px-8 py-6">

        <div className="grid grid-cols-3 gap-4 text-center">

          <Stat
            label="Projects"
            value="0"
          />

          <Stat
            label="Battles"
            value="0"
          />

          <Stat
            label="Followers"
            value="0"
          />

        </div>

      </div>

    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="text-2xl font-black text-orange-500">
        {value}
      </div>

      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>

    </div>
  );
}