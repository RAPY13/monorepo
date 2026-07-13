// app/onboarding/router.ts
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getOnboardingProfile } from "@/lib/onboarding-profile";

export default async function OnboardingRouter(request) {
  const supabase = createClient(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/?openModal=1");
  }

  const { profile } = await getOnboardingProfile(supabase, user);

  const isComplete =
    !!profile?.username &&
    !!profile?.lane &&
    Array.isArray(profile?.style_tags) &&
    profile.style_tags.length > 0 &&
    !!profile?.avatar_url &&
    !!profile?.bio;

  if (!isComplete) {
    redirect("/onboarding");
  }

  redirect("/gate");
}
