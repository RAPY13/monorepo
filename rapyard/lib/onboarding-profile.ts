import type { SupabaseClient, User } from "@supabase/supabase-js";

export type YardRole = "rapper" | "producer" | "listener";

export type OnboardingProfile = {
  id?: string | null;
  user_id?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  badges?: string[] | null;
  role?: YardRole | null;
  tenant?: string | null;
  onboarding_complete?: boolean | null;
  tenant_region?: string | null;
  tenant_banner_url?: string | null;
  tenant_faction?: string | null;
};

async function queryByKey(
  supabase: SupabaseClient,
  key: "id" | "user_id",
  userId: string
) {
  return supabase
    .from("profiles")
    .select(
      "id, user_id, username, avatar_url, badges, role, tenant, onboarding_complete, tenant_region, tenant_banner_url, tenant_faction"
    )
    .eq(key, userId)
    .maybeSingle<OnboardingProfile>();
}

export async function getOnboardingProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ profile: OnboardingProfile | null; error: string | null }> {
  const byId = await queryByKey(supabase, "id", user.id);

  if (!byId.error) {
    return { profile: byId.data ?? null, error: null };
  }

  const byUserId = await queryByKey(supabase, "user_id", user.id);

  if (!byUserId.error) {
    return { profile: byUserId.data ?? null, error: null };
  }

  return { profile: null, error: byId.error.message };
}

export async function updateOnboardingProfile(
  supabase: SupabaseClient,
  user: User,
  patch: Partial<OnboardingProfile>
): Promise<{ error: string | null }> {
  const tryById = await supabase.from("profiles").update(patch).eq("id", user.id);

  if (!tryById.error) {
    return { error: null };
  }

  const tryByUserId = await supabase
    .from("profiles")
    .update(patch)
    .eq("user_id", user.id);

  if (!tryByUserId.error) {
    return { error: null };
  }

  return { error: tryById.error.message };
}

export async function ensureProfileRow(
  supabase: SupabaseClient,
  user: User
): Promise<{ error: string | null }> {
  const username = `user_${user.id.slice(0, 8)}`;

  const insertId = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username,
      },
      { onConflict: "id" }
    );

  if (!insertId.error) {
    return { error: null };
  }

  const insertUserId = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        username,
      },
      { onConflict: "user_id" }
    );

  if (!insertUserId.error) {
    return { error: null };
  }

  return { error: insertId.error.message };
}
