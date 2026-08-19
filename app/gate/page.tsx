import { redirect } from "next/navigation";

import Gate from "@/components/gate/Gate";
import { createClient } from "@/lib/supabase/server";

export default async function GatePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <Gate user={user} />
    </main>
  );
}

