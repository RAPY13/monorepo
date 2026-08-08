import { createClient } from "@/lib/supabase/client";

import {
  DEFAULT_PROJECT_TITLE,
} from "./constants";

import type {
  CreateProjectInput,
  Project,
} from "./types";

export async function createProject({
  title,
  description,
}: CreateProjectInput): Promise<Project> {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in.");
  }

  const projectTitle =
    title.trim() || DEFAULT_PROJECT_TITLE;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      title: projectTitle,
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "[Projects] Create project failed:",
      error,
    );

    throw new Error(error.message);
  }

  return data as Project;
}