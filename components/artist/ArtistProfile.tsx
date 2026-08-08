import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

type ArtistPageProps = {
  params: Promise<{
    username: string;
  }>;
};

type Profile = {
  id: string;
  user_id?: string | null;
  username: string | null;
  rap_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  city?: string | null;
  genres?: string[] | null;
  primary_role?: string | null;
  role?: string | null;
  badges?: string[] | null;
};

export default async function ArtistPage({
  params,
}: ArtistPageProps) {
  const { username } = await params;

  const supabase = await createClient();

  const cleanUsername = username.startsWith("@")
    ? username.slice(1)
    : username;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        user_id,
        username,
        rap_name,
        avatar_url,
        bio,
        city,
        genres,
        primary_role,
        role,
        badges
      `,
    )
    .eq("username", cleanUsername)
    .maybeSingle<Profile>();

  if (error) {
    console.error(
      "[ArtistPage] Failed to load profile:",
      error.message,
    );
  }

  if (!profile) {
    notFound();
  }

  const artistName =
    profile.rap_name ||
    profile.username ||
    cleanUsername;

  const usernameLabel = profile.username
    ? `@${profile.username}`
    : `@${cleanUsername}`;

  const role =
    profile.primary_role ||
    profile.role ||
    "Artist";

  const genres = Array.isArray(profile.genres)
    ? profile.genres
    : [];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="fixed inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,110,0,0.16),transparent_45%)]" />

        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />

        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[180px]" />
      </div>

      {/* ============================================================
          TOP NAV
      ============================================================ */}

      <header className="relative z-30 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/yard"
            className="
              text-sm
              font-black
              uppercase
              tracking-[0.3em]
              text-white
              transition
              hover:text-orange-400
            "
          >
            RAPYARD
          </Link>

          <Link
            href="/yard"
            className="
              rounded-full
              border
              border-zinc-700
              bg-zinc-950/80
              px-5
              py-2
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-zinc-300
              transition
              hover:border-orange-500
              hover:text-orange-400
            "
          >
            ← The Yard
          </Link>
        </div>
      </header>

      {/* ============================================================
          ARTIST HERO
      ============================================================ */}

      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pt-24">
          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-white/10
              bg-zinc-950/80
              shadow-[0_0_100px_rgba(0,0,0,0.65)]
              backdrop-blur-xl
            "
          >
            {/* Metallic background */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,rgba(120,160,190,0.08)_70%,transparent)]" />

            <div className="relative grid min-h-[620px] lg:grid-cols-[0.85fr_1.15fr]">
              {/* ==================================================
                  ARTIST IMAGE
              ================================================== */}

              <div className="relative min-h-[500px] overflow-hidden lg:min-h-[620px]">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={artistName}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="/images/G-Dub.png"
                    alt={artistName}
                    fill
                    priority
                    className="object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80" />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                {/* Chrome frame */}
                <div className="pointer-events-none absolute inset-5 rounded-[1.5rem] border border-white/20" />
              </div>

              {/* ==================================================
                  ARTIST INFORMATION
              ================================================== */}

              <div className="relative flex flex-col justify-end p-8 md:p-12 lg:p-16">
                <div className="mb-auto">
                  <p className="text-xs font-bold uppercase tracking-[0.45em] text-orange-400">
                    RapYard Artist
                  </p>

                  <div className="mt-5 h-px w-24 bg-gradient-to-r from-orange-500 to-transparent" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
                    {role}
                  </p>

                  <h1
                    className="
                      mt-3
                      text-6xl
                      font-black
                      uppercase
                      leading-[0.9]
                      tracking-tight
                      text-transparent
                      [background:linear-gradient(180deg,#fff_0%,#d7d7d7_35%,#6d7378_55%,#fff_72%,#73777b_100%)]
                      bg-clip-text
                      md:text-8xl
                    "
                  >
                    {artistName}
                  </h1>

                  <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                    {usernameLabel}
                  </p>

                  {profile.city && (
                    <p className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-500">
                      {profile.city}
                    </p>
                  )}

                  {profile.bio && (
                    <p className="mt-8 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
                      {profile.bio}
                    </p>
                  )}

                  {/* Genres */}
                  {genres.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {genres.map((genre) => (
                        <span
                          key={genre}
                          className="
                            rounded-full
                            border
                            border-blue-400/30
                            bg-blue-950/30
                            px-4
                            py-2
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-blue-200
                          "
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Artist actions */}
                  <div className="mt-10 flex flex-wrap gap-4">
                    <button
                      type="button"
                      className="
                        rounded-xl
                        border
                        border-orange-500
                        bg-orange-500/10
                        px-7
                        py-4
                        text-sm
                        font-black
                        uppercase
                        tracking-[0.2em]
                        text-orange-300
                        transition
                        hover:bg-orange-500
                        hover:text-black
                        hover:shadow-[0_0_40px_rgba(255,110,0,0.35)]
                      "
                    >
                      Follow Artist
                    </button>

                    <Link
                      href="#music"
                      className="
                        rounded-xl
                        border
                        border-white/20
                        bg-white/5
                        px-7
                        py-4
                        text-sm
                        font-black
                        uppercase
                        tracking-[0.2em]
                        text-white
                        transition
                        hover:border-blue-400
                        hover:bg-blue-950/40
                      "
                    >
                      Enter Music
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ARTIST SECTIONS
      ============================================================ */}

      <section
        id="music"
        className="relative z-10 mx-auto max-w-7xl px-6 pb-24 md:px-10"
      >
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-orange-400">
            The Music
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-black
              uppercase
              tracking-tight
              text-transparent
              [background:linear-gradient(180deg,#fff,#8d9499,#fff)]
              bg-clip-text
              md:text-6xl
            "
          >
            Releases
          </h2>
        </div>

        {/* ==========================================================
            GDB — VOLUME 1
        ========================================================== */}

        <article
          className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-zinc-950
            shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          "
        >
          <div className="grid md:grid-cols-[320px_1fr]">
            <div className="relative aspect-square overflow-hidden md:aspect-auto md:min-h-[320px]">
              <Image
                src="/images/G-Dub.png"
                alt="GDB — Volume 1"
                fill
                className="
                  object-cover
                  transition
                  duration-700
                  group-hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-orange-400">
                Bleed Tha Block
              </p>

              <h3
                className="
                  mt-3
                  text-4xl
                  font-black
                  uppercase
                  text-transparent
                  [background:linear-gradient(180deg,#fff,#aeb4b8,#fff)]
                  bg-clip-text
                  md:text-5xl
                "
              >
                GDB — Volume 1
              </h3>

              <p className="mt-5 max-w-xl text-zinc-400">
                The first featured project inside RapYard.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-blue-400/30 bg-blue-950/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-200">
                  Album
                </span>

                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Bleed Tha Block
                </span>
              </div>

              <button
                type="button"
                className="
                  mt-10
                  w-fit
                  rounded-xl
                  border
                  border-orange-500
                  px-7
                  py-4
                  text-sm
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-orange-300
                  transition
                  hover:bg-orange-500
                  hover:text-black
                "
              >
                View Project →
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* ============================================================
          ARTIST NAVIGATION
      ============================================================ */}

      <section className="relative z-10 border-y border-white/10 bg-zinc-950/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {[
            "Music",
            "Battles",
            "Cyphers",
            "Yard Activity",
          ].map((item) => (
            <button
              key={item}
              type="button"
              className="
                border-r
                border-white/10
                px-5
                py-8
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-zinc-400
                transition
                last:border-r-0
                hover:bg-blue-950/20
                hover:text-orange-300
              "
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer className="relative z-10 px-6 py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.45em] text-zinc-600">
          Respect Isn't Earned.
        </p>

        <p className="mt-3 text-sm font-black uppercase tracking-[0.3em] text-orange-400">
          It's Recorded.
        </p>

        <p className="mt-8 text-xs text-zinc-700">
          © {new Date().getFullYear()} RapYard
        </p>
      </footer>
    </main>
  );
}