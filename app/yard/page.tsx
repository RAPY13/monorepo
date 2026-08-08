import { redirect } from "next/navigation";

import YardHome from "@/components/yard/YardHome";
import { createClient } from "@/lib/supabase/server";

export default async function YardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return <YardHome />;
}