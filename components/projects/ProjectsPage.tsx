"use client";

import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";

type ProjectVisibility =
  | "private"
  | "unlisted"
  | "public";

type Project = {
  id: string;
  title: string;
  description: string | null;
  visibility: ProjectVisibility;
  updated_at: string;
};

type Props = {
  projects: Project[];
  userId: string;
};

export default function ProjectsPage({
  projects,
  userId,
}: Props) {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-10 flex flex-col gap-5 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
              RapYard
            </p>

            <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
              Projects
            </h1>

            <p className="mt-3 text-sm text-zinc-600">
              Your music. Your sessions. Your work.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
          >
            <Plus size={18} />
            New Project
          </Link>
        </header>

        {projects.length === 0 ? (
          <div className="rounded-[2rem] border border-zinc-900 bg-zinc-950 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-black">
              <FolderOpen
                size={22}
                className="text-zinc-600"
              />
            </div>

            <h2 className="mt-5 text-lg font-black uppercase text-white">
              No Projects Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
              Create your first project and
              start building your next record.
            </p>

            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black hover:bg-orange-400"
            >
              <Plus size={18} />
              Create Project
            </Link>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <FolderOpen size={18} />
                  </div>

                  <span className="rounded-full border border-zinc-800 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                    {project.visibility}
                  </span>
                </div>

                <h2 className="mt-6 truncate text-xl font-black uppercase tracking-tight text-white">
                  {project.title}
                </h2>

                <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-600">
                  {project.description ||
                    "No description yet."}
                </p>

                <div className="mt-6 border-t border-zinc-900 pt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-700 transition group-hover:text-orange-500">
                  Open Project →
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}