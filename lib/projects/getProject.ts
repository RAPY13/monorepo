import { createClient } from "@/lib/supabase/server";

export async function getProject(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("[getProject] Auth error:", authError);
  }

  if (!user) {
    console.error("[getProject] No authenticated user");
    return null;
  }

  console.log("[getProject] Looking for:", {
    projectId: id,
    userId: user.id,
  });

  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (projectError) {
    console.error(
      "[getProject] Project query failed:",
      projectError
    );

    return null;
  }

  if (!project) {
    console.error("[getProject] Project not found");
    return null;
  }

  console.log(
    "[getProject] Project found:",
    project.id
  );

  return {
    project,
    recordings: [],
  };
}