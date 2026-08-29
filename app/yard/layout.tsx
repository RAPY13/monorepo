import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AudioProvider from "@/components/audio/AudioProvider";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { createClient } from "@/lib/supabase/server";

type Props = {
  children: ReactNode;
};

export default async function YardLayout({ children }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, rap_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const appUser = {
    id: user.id,
    email: user.email ?? "",
    username: profile?.username ?? "",
    rapName: profile?.rap_name ?? "",
    avatarUrl: profile?.avatar_url ?? "",
  };

  return (
    <AudioProvider>
      <div className="flex min-h-screen bg-black text-white">
        <AppSidebar user={appUser} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader user={appUser} />
          <main className="flex-1 overflow-auto bg-black">{children}</main>
        </div>
      </div>
    </AudioProvider>
  );
}
