import { redirect } from "next/navigation";

import YardHome from "@/components/yard/YardHome";
import { createClient } from "@/lib/supabase/server";
import { getOnboardingProfile } from "@/lib/onboarding-profile";

export default async function YardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User is not authenticated.
  if (!user) {
    redirect("/auth");
  }

  // Check the user's Rap Sheet / onboarding state.
  const { profile, error } = await getOnboardingProfile(
    supabase,
    user
  );

  // If we cannot confirm the profile is complete,
  // do not allow the user into the Yard.
  if (error || !profile?.onboarding_complete) {
    redirect("/rap-sheet");
  }

  return <YardHome />;
}
