import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import SessionHeader from "@/components/recording/session/SessionHeader";
import SessionStats from "@/components/recording/session/SessionStats";
import TakeList from "@/components/recording/Takes/TakeList";

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function SessionPage({
  params,
}: Props) {
  const { sessionId } = await params;

  const supabase = await createClient();

  const { data: session } = await supabase
    .from("recording_sessions")
    .select(`
      *,
      projects (
        id,
        title
      )
    `)
    .eq("id", sessionId)
    .single();

  if (!session) {
    notFound();
  }

  const { data: takes } = await supabase
    .from("recording_takes")
    .select("*")
    .eq("session_id", sessionId)
    .order("take_number", {
      ascending: false,
    });

  return (
    <div className="space-y-8">

      <SessionHeader
        session={session}
      />

      <SessionStats
        takes={takes ?? []}
      />

      <TakeList
        takes={takes ?? []}
      />

    </div>
  );
}
