"use client";

import { CalendarDays, Lock, Globe, Eye } from "lucide-react";

type Project = {
  title: string;
  description: string | null;
  visibility: "private" | "unlisted" | "public";
  updated_at: string;
};

export default function ProjectHero({
  project,
}: {
  project: Project;
}) {
  const VisibilityIcon =
    project.visibility === "public"
      ? Globe
      : project.visibility === "unlisted"
      ? Eye
      : Lock;

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-5xl font-black uppercase">
            {project.title}
          </h1>

          {project.description && (
            <p className="mt-4 max-w-3xl text-zinc-400">
              {project.description}
            </p>
          )}

        </div>

        <div className="space-y-3 text-right">

          <div className="flex items-center justify-end gap-2 text-orange-400">

            <VisibilityIcon size={18} />

            <span className="capitalize">
              {project.visibility}
            </span>

          </div>

          <div className="flex items-center justify-end gap-2 text-zinc-500">

            <CalendarDays size={16} />

            Updated {new Date(project.updated_at).toLocaleDateString()}

          </div>

        </div>

      </div>

    </section>
  );
}