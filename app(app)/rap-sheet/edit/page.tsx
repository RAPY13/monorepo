import { redirect } from "next/navigation";

import RapSheet from "@/components/rap-sheet/RapSheet";
import { createClient } from "@/lib/supabase/server";

export default async function RapSheetEditPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return <RapSheet user={user} />;
}
