import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import ProjectsPage from "@/components/projects/ProjectsPage";

export const metadata = {
  title: "Projects | RapYard",
};

export default async function Projects() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
  }

  return (
    <ProjectsPage
      projects={projects ?? []}
      userId={user.id}
    />
  );
}