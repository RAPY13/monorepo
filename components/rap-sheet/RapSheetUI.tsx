// components/rap-sheet/RapSheetUI.tsx
'use client'

import { CreatorProfile } from '@/lib/creator-profile'
import CreatorProfileView from './CreatorProfileView'

export default function RapSheetUI({ profile }: { profile: CreatorProfile | null }) {
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <h1 className="text-4xl font-black tracking-tight uppercase">
          BUILDING RAP SHEET
        </h1>
        <p className="opacity-70 mt-2">Preparing your creator profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CreatorProfileView profile={profile} />
    </div>
  )
}
