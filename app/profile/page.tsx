import { redirect } from "next/navigation";

import {
  getOrCreateCreatorProfile,
} from "@/lib/creator-profile";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const profile =
    await getOrCreateCreatorProfile(user.id);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-14">

        {/* Header */}
        <header className="mb-10 flex flex-col gap-6 border-b border-zinc-900 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
              RapYard
            </p>

            <h1 className="mt-3 text-5xl font-black uppercase tracking-tight md:text-6xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-xl text-zinc-500">
              Your identity inside the Yard.
            </p>
          </div>

          <a
            href="/rap-sheet"
            className="inline-flex items-center justify-center rounded-xl border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-orange-400 transition hover:border-orange-500 hover:bg-orange-500 hover:text-black"
          >
            Edit Rap Sheet
          </a>
        </header>

        {/* Identity */}
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
          <div className="grid gap-8 p-6 md:grid-cols-[220px_1fr] md:p-10">

            {/* Avatar */}
            <div>
              <div className="aspect-square overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={
                      profile.stage_name ??
                      "RapYard creator"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                    No Avatar
                  </div>
                )}
              </div>
            </div>

            {/* Creator information */}
            <div className="flex flex-col justify-center">

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                Creator Profile
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase md:text-5xl">
                {profile.stage_name ??
                  "Unnamed Creator"}
              </h2>

              <p className="mt-3 text-sm text-zinc-500">
                RapYard Creator
                {" • "}
                Joined{" "}
                {new Date(
                  profile.created_at
                ).toLocaleDateString()}
              </p>

              <div className="mt-8 max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-600">
                  Bio
                </p>

                <p className="mt-3 text-base leading-7 text-zinc-300">
                  {profile.bio ??
                    "No bio yet. Tell the Yard who you are."}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <StatCard
            label="Battles"
            value={profile.stats.battles}
          />

          <StatCard
            label="Wins"
            value={profile.stats.wins}
          />

          <StatCard
            label="Losses"
            value={profile.stats.losses}
          />

          <StatCard
            label="Tapes"
            value={profile.stats.tapes}
          />

        </section>

        {/* Creator record */}
        <section className="mt-8 grid gap-8 md:grid-cols-2">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Creator Record
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase">
              Your RapYard Identity
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-500">
              This profile represents your presence inside
              RapYard. Your Rap Sheet is where you can update
              your identity and creator information.
            </p>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Account
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase">
              Signed In
            </h2>

            <p className="mt-4 break-all text-sm text-zinc-400">
              {user.email}
            </p>

            <div className="mt-6 h-px bg-zinc-900" />

            <p className="mt-5 text-xs text-zinc-600">
              Profile ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-zinc-700">
              {profile.id}
            </p>

          </div>

        </section>

        {/* Footer message */}
        <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6 md:p-8">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
            The Yard
          </p>

          <p className="mt-3 text-lg font-bold">
            This is your record. Build it.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Your profile grows as you create, record,
            battle, collaborate, and build your name.
          </p>

        </section>

      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-600">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black">
        {value}
      </p>
    </div>
  );
}
