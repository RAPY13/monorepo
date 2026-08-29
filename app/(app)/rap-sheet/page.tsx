import { redirect } from "next/navigation";

import PremiumRapSheet from "@/components/rap-sheet/PremiumRapSheet";
import RapSheet from "@/components/rap-sheet/RapSheet";
import { createClient } from "@/lib/supabase/server";

export default async function RapSheetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "rap_name, username, avatar_url, bio, city, genres, primary_role, role, created_at, onboarding_complete, lane, level, xp",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[RapSheet] Profile load failed:", error);
  }

  // Missing or incomplete profiles stay in the identity builder.
  if (!profile || !profile.onboarding_complete) {
    return <RapSheet user={user} />;
  }

  // Profile exists â†’ show the finished Rap Sheet.
  return (
    <PremiumRapSheet
      profile={{
        rap_name: profile.rap_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        city: profile.city,
        genres: Array.isArray(profile.genres)
          ? profile.genres
          : [],
        primary_role: profile.primary_role,
        role: profile.role,
        created_at: profile.created_at,
        lane: profile.lane,
        level: profile.level,
        xp: profile.xp,
      }}
    />
  );
}



