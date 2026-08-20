"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Mic2,
  Music2,
  Trophy,
  UserRound,
} from "lucide-react";

type PremiumRapSheetProps = {
  isOwner?: boolean;

  profile: {
    rap_name: string | null;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
    city: string | null;
    genres: string[] | null;
    primary_role: string | null;
    role: string | null;
    created_at?: string | null;
  };
};

const ROLE_LABELS: Record<string, string> = {
  artist: "Artist / Rapper",
  producer: "Producer",
  engineer: "Engineer",
  listener: "Listener",
};

export default function PremiumRapSheet({
  profile,
  isOwner = false,
}: PremiumRapSheetProps) {
  const role =
    profile.primary_role ||
    profile.role ||
    "";

  const roleLabel =
    ROLE_LABELS[role.toLowerCase()] ||
    role ||
    "Creator";

  const username = profile.username
    ? `@${profile.username.replace(/^@/, "")}`
    : "@username";

  const genres = Array.isArray(profile.genres)
    ? profile.genres.filter(
        (genre): genre is string =>
          typeof genre === "string" &&
          genre.trim().length > 0,
      )
    : [];

  const joinedDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        },
      )
    : "2026";

  /*
   * Your personal RapYard avatar.
   *
   * Everyone else continues using their database avatar.
   */
  const avatarSrc = isOwner
    ? "/images/avatars/JesseProfile.png"
    : profile.avatar_url;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* ======================================================
          RAP SHEET BACKGROUND
      ======================================================= */}

      <img
        src="/images/rap-sheet/RapSheet.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        draggable={false}
      />

      {/* Cinematic dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/75" />

      {/* Orange atmosphere */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-orange-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 top-[25%] h-96 w-96 rounded-full bg-orange-500/5 blur-[140px]" />

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="relative z-10">
        {/* ====================================================
            HERO
        ===================================================== */}

        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-8 lg:px-10 lg:pb-20">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-orange-500">
                  RapYard
                </p>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                  Creator Record
                </p>
              </div>

              <Link
                href="/rap-sheet/edit"
                className="group flex items-center gap-2 rounded-full border border-zinc-800 bg-black/70 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-300 backdrop-blur transition hover:border-orange-500/50 hover:text-white"
              >
                Edit Rap Sheet

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Creator identity */}
            <div className="mt-14 grid gap-9 lg:grid-cols-[250px_1fr] lg:items-end">
              {/* Avatar */}
              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/80">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={
                        profile.rap_name ||
                        "RapYard creator"
                      }
                      fill
                      sizes="250px"
                      className="object-cover"
                      priority={isOwner}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-950">
                      <UserRound className="h-20 w-20 text-zinc-800" />
                    </div>
                  )}
                </div>

                {/* Active status */}
                <div className="absolute -bottom-3 left-5 flex items-center gap-2 rounded-full border border-zinc-800 bg-black px-3 py-1.5 shadow-xl">
                  <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,.7)]" />

                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">
                    Creator Active
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-600">
                  Rap Sheet
                </p>

                <h1 className="mt-3 max-w-5xl text-5xl font-black uppercase tracking-[-0.045em] sm:text-6xl lg:text-8xl">
                  {profile.rap_name ||
                    "Unnamed Creator"}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                  <span className="font-bold text-orange-500">
                    {username}
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />

                  <span className="flex items-center gap-2 text-zinc-400">
                    <Mic2 className="h-4 w-4" />
                    {roleLabel}
                  </span>

                  {profile.city && (
                    <>
                      <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />

                      <span className="flex items-center gap-2 text-zinc-400">
                        <MapPin className="h-4 w-4" />
                        {profile.city}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            MAIN RECORD
        ===================================================== */}

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
          {/* The Record + Creative Identity */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
            {/* The Record */}
            <section className="rounded-[2rem] border border-zinc-900 bg-black/80 p-7 backdrop-blur-md sm:p-9">
              <SectionLabel>
                The Record
              </SectionLabel>

              <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-zinc-300 sm:text-2xl">
                {profile.bio ||
                  "Your story starts here. Tell the Yard who you are."}
              </p>

              {genres.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Creative Identity */}
            <section className="rounded-[2rem] border border-zinc-900 bg-black/80 p-7 backdrop-blur-md sm:p-9">
              <SectionLabel>
                Creative Identity
              </SectionLabel>

              <div className="mt-7 space-y-5">
                <IdentityRow
                  icon={
                    <Mic2 className="h-4 w-4" />
                  }
                  label="Primary Role"
                  value={roleLabel}
                />

                <IdentityRow
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                  label="Location"
                  value={
                    profile.city ||
                    "Not set"
                  }
                />

                <IdentityRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Member Since"
                  value={joinedDate}
                />
              </div>
            </section>
          </div>

          {/* ==================================================
              YARD RECORD
          =================================================== */}

          <section className="mt-6 rounded-[2rem] border border-zinc-900 bg-black/80 p-7 backdrop-blur-md sm:p-9">
            <SectionLabel>
              Yard Record
            </SectionLabel>

            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 sm:grid-cols-4">
              <RecordStat
                icon={
                  <Trophy className="h-4 w-4" />
                }
                label="Battles"
                value={0}
              />

              <RecordStat
                icon={
                  <Trophy className="h-4 w-4" />
                }
                label="Wins"
                value={0}
              />

              <RecordStat
                icon={
                  <Trophy className="h-4 w-4" />
                }
                label="Losses"
                value={0}
              />

              <RecordStat
                icon={
                  <Music2 className="h-4 w-4" />
                }
                label="Tapes"
                value={0}
              />
            </div>
          </section>

          {/* ==================================================
              CREATIVE LANES
          =================================================== */}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <RecordPanel
              title="Recent Work"
              description="Projects, recordings, and releases will appear here."
            />

            <RecordPanel
              title="Battle Record"
              description="Your battles, wins, losses, and upcoming matchups will appear here."
            />
          </div>

          {/* ==================================================
              FOOTER
          =================================================== */}

          <div className="mt-10 flex flex-col gap-4 border-t border-zinc-900 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
              Respect isn't earned. It's recorded.
            </p>

            <Link
              href="/yard"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 transition hover:text-orange-400"
            >
              Back to the Yard â†’
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   SECTION LABEL
============================================================ */

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-500">
      {children}
    </p>
  );
}

/* ============================================================
   IDENTITY ROW
============================================================ */

function IdentityRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-4">
      <div className="flex items-center gap-3 text-zinc-600">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>

      <span className="text-right text-sm font-bold text-zinc-300">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   RECORD STAT
============================================================ */

function RecordStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-black p-6 sm:p-8">
      <div className="flex items-center gap-2 text-zinc-600">
        {icon}

        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>

      <p className="mt-4 text-4xl font-black tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   EMPTY RECORD PANEL
============================================================ */

function RecordPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[2rem] border border-zinc-900 bg-black/75 p-7 backdrop-blur-md sm:p-9">
      <SectionLabel>
        {title}
      </SectionLabel>

      <div className="mt-10 flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-zinc-900 bg-zinc-950/60 px-6 text-center">
        <p className="max-w-sm text-sm leading-6 text-zinc-600">
          {description}
        </p>
      </div>
    </section>
  );
}

