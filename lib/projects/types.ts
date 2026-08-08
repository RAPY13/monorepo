export type ProjectVisibility =
  | "private"
  | "unlisted"
  | "public";

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  visibility: ProjectVisibility;
  created_at: string;
  updated_at: string;
};

export type CreateProjectInput = {
  title: string;
  description?: string | null;
};