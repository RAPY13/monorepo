import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Wizard from "@/components/rap-sheet/Wizard";

export default async function RapSheetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10">
      <Wizard
        user={{
          id: user.id,
          email: user.email ?? "",
        }}
      />
    </div>
  );
}
