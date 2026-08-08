import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import AudioProvider from "@/components/audio/AudioProvider";

import { createClient } from "@/lib/supabase/server";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({
  children,
}: Props) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Load profile once for the entire authenticated app
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      rap_name,
      avatar_url,
      onboarding_complete
    `)
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
        {/* Sidebar */}
        <AppSidebar user={appUser} />

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <AppHeader user={appUser} />

          {/* Page */}
          <main className="flex-1 overflow-auto bg-black">
            {children}
          </main>
        </div>
      </div>
    </AudioProvider>
  );
}