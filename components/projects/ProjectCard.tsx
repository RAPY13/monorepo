"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Music2,
  MoreVertical,
} from "lucide-react";

type Project = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  project: Project;
};

export default function ProjectCard({
  project,
}: Props) {
  const updated = new Date(
    project.updated_at
  ).toLocaleDateString();

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-orange-500
        hover:shadow-[0_0_40px_rgba(249,115,22,.15)]
      "
    >
      {/* Cover */}

      <div className="relative aspect-video overflow-hidden bg-zinc-900">

        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={project.title}
            fill
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              bg-gradient-to-br
              from-zinc-900
              via-black
              to-zinc-900
            "
          >
            <Music2
              size={60}
              className="text-orange-500/50"
            />
          </div>
        )}

        <button
          className="
            absolute
            right-4
            top-4
            rounded-xl
            bg-black/60
            p-2
            backdrop-blur
            transition
            hover:bg-orange-500
            hover:text-black
          "
        >
          <MoreVertical size={18} />
        </button>

      </div>

      {/* Body */}

      <div className="space-y-5 p-6">

        <div>

          <h2 className="text-2xl font-black">
            {project.title}
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
            {project.description ||
              "No description yet."}
          </p>

        </div>

        {/* Footer */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 text-xs text-zinc-500">

            <CalendarDays size={15} />

            Updated {updated}

          </div>

          <Link
            href={`/projects/${project.id}`}
            className="
              flex
              items-center
              gap-2
              font-semibold
              text-orange-500
              transition
              hover:text-orange-400
            "
          >
            Open

            <ArrowRight size={18} />

          </Link>

        </div>

      </div>

    </article>
  );
}