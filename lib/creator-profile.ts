// lib/creator-profile.ts
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type CreatorStats = {
  battles: number
  wins: number
  losses: number
  tapes: number
}

export type CreatorProfile = {
  id: string
  user_id: string
  stage_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
  stats: CreatorStats
}

export async function getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Creator profile fetch error:', error)
    return null
  }

  return data as CreatorProfile
}

export async function buildCreatorProfile(userId: string): Promise<CreatorProfile> {
  const supabase = await createClient()

  const payload = {
    user_id: userId,
    stage_name: null,
    avatar_url: null,
    bio: null,
    stats: {
      battles: 0,
      wins: 0,
      losses: 0,
      tapes: 0,
    },
  }

  const { data, error } = await supabase
    .from('creator_profiles')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('Creator profile creation error:', error)
    throw error
  }

  revalidatePath('/rap-sheet')

  return data as CreatorProfile
}

export async function getOrCreateCreatorProfile(userId: string): Promise<CreatorProfile> {
  const existing = await getCreatorProfile(userId)
  if (existing) return existing
  return await buildCreatorProfile(userId)
}
