"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CreateProjectDialog from "@/components/projects/CreateProjectDialog";

export default function NewProjectPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      router.push("/projects");
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-600 transition hover:text-orange-500"
        >
          <ArrowLeft size={15} />
          Back to Projects
        </Link>

        <div className="mt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-500">
            RapYard Studio
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-6xl">
            New Project
          </h1>

          <p className="mt-3 max-w-xl text-sm text-zinc-600">
            Start a new record, session, single, EP, mixtape, or album.
          </p>
        </div>

        <div className="mt-10">
          <CreateProjectDialog
            userId=""
            open={open}
            onOpenChange={handleOpenChange}
          />
        </div>
      </div>
    </main>
  );
}