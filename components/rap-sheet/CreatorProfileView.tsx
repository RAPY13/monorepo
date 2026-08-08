// components/rap-sheet/CreatorProfileView.tsx
'use client'

import { CreatorProfile } from '@/lib/creator-profile'

export default function CreatorProfileView({ profile }: { profile: CreatorProfile }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center gap-6 mb-10">
        <div className="h-20 w-20 rounded-full bg-zinc-900 border border-zinc-700 overflow-hidden">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.stage_name ?? 'Creator avatar'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wide text-zinc-500">
              No Avatar
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {profile.stage_name ?? 'Unnamed Creator'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            RapYard Creator • Joined {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Battles" value={profile.stats.battles} />
        <StatCard label="Wins" value={profile.stats.wins} />
        <StatCard label="Losses" value={profile.stats.losses} />
        <StatCard label="Tapes" value={profile.stats.tapes} />
      </section>

      <section className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Bio</h2>
        <p className="text-sm text-zinc-300">
          {profile.bio ?? 'No bio yet. Tell the yard who you are.'}
        </p>
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  )
}
