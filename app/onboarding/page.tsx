import { redirect } from "next/navigation";

import RapSheet from "@/components/rap-sheet/RapSheet";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/gate");
  }

  return <RapSheet user={user} />;
}