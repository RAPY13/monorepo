import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

type Artist = {
  id: string;
  username: string | null;
  rap_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  genres: string[] | null;
  primary_role: string | null;
  role: string | null;
};

export default async function ArtistsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      rap_name,
      avatar_url,
      bio,
      city,
      genres,
      primary_role,
      role
    `)
    .not("username", "is", null)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[ArtistsPage] Failed to load artists:",
      error.message,
    );
  }

  const artists = (data ?? []) as Artist[];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
            RapYard
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase tracking-[-0.05em] sm:text-7xl">
            Artists
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Find the voices, writers, producers, and creators building inside the Yard.
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-white/[0.07] bg-zinc-950 p-12 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-600">
              No artists found.
            </p>
          </div>
        ) : (
          <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artists.map((artist) => {
              if (!artist.username) {
                return null;
              }

              const artistName =
                artist.rap_name ||
                artist.username;

              const role =
                artist.primary_role ||
                artist.role ||
                "Artist";

              const genres = Array.isArray(
                artist.genres,
              )
                ? artist.genres
                : [];

              return (
                <Link
                  key={artist.id}
                  href={`/artist/${encodeURIComponent(
                    artist.username,
                  )}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-zinc-950 transition hover:border-orange-500/40"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                    <Image
                      src={
                        artist.avatar_url ||
                        "/images/G-Dub.png"
                      }
                      alt={artistName}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">
                        {role}
                      </p>

                      <h2 className="mt-2 truncate text-2xl font-black uppercase text-white">
                        {artistName}
                      </h2>

                      <p className="mt-1 text-xs font-bold text-zinc-400">
                        @{artist.username}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    {artist.city && (
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                        {artist.city}
                      </p>
                    )}

                    {artist.bio && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                        {artist.bio}
                      </p>
                    )}

                    {genres.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {genres
                          .slice(0, 3)
                          .map((genre) => (
                            <span
                              key={genre}
                              className="rounded-full border border-white/[0.08] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500"
                            >
                              {genre}
                            </span>
                          ))}
                      </div>
                    )}

                    <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 transition group-hover:text-orange-300">
                      View Rap Sheet →
                    </p>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}