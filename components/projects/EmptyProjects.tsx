"use client";

import { FolderPlus } from "lucide-react";

type EmptyProjectsProps = {
  onCreate: () => void;
};

export default function EmptyProjects({
  onCreate,
}: EmptyProjectsProps) {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950">

      <FolderPlus
        size={56}
        className="text-orange-500"
      />

      <h2 className="mt-6 text-2xl font-bold">
        No Projects Yet
      </h2>

      <p className="mt-3 max-w-md text-center text-zinc-500">
        Organize your recordings into projects, songs,
        battle entries, and albums.
      </p>

      <button
  onClick={() => onCreate?.()}
>
        Create Your First Project
      </button>

    </div>
  );
}