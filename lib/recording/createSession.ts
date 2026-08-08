"use server";

import { createClient } from "@/lib/supabase/server";

type CreateSessionInput = {
  projectId: string;
};

export async function createRecordingSession({
  projectId,
}: CreateSessionInput) {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in.");
  }

  // Verify the project belongs to this user
  const { data: project, error: projectError } =
    await supabase
      .from("projects")
      .select("id, title")
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .single();

  if (projectError || !project) {
    throw new Error(
      "Project not found or you do not have access to it.",
    );
  }

  // Create the recording session
  const { data: session, error: sessionError } =
    await supabase
      .from("recording_sessions")
      .insert({
        project_id: project.id,
        title: "New Recording Session",
        notes: null,
      })
      .select()
      .single();

  if (sessionError || !session) {
    console.error(
      "[Recording] Session creation failed:",
      sessionError,
    );

    throw new Error(
      sessionError?.message ||
        "Unable to create recording session.",
    );
  }

  return {
    success: true,
    sessionId: session.id,
    projectId: project.id,
  };
}