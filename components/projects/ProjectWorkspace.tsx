"use client";

import ProjectToolbar from "./ProjectToolbar";
import ProjectInfo from "./ProjectInfo";
import RecordingList from "./RecordingList";
import SessionList from "./SessionList";

import type { RecordingTake } from "@/lib/audio/types";

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

type Session = {
  id: string;
  project_id: string;
  title: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ProjectWorkspaceProps = {
  project: Project;
  recordings: RecordingTake[];
  sessions: Session[];
};

export default function ProjectWorkspace({
  project,
  recordings,
  sessions,
}: ProjectWorkspaceProps) {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <ProjectToolbar
          projectId={project.id}
          latestSessionId={sessions[0]?.id ?? null}
        />

        <section className="mt-8 grid gap-8 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <ProjectInfo
              project={project}
            />
          </div>

          <div className="xl:col-span-2">
            <RecordingList
              recordings={recordings}
            />
          </div>
        </section>

        <SessionList
          sessions={sessions}
        />
      </div>
    </main>
  );
}