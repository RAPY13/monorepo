"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mic2,
  SlidersHorizontal,
  Wand2,
  UploadCloud,
  Loader2,
} from "lucide-react";

import { createRecordingSession } from "@/lib/recording/createSession";

export default function ProjectToolbar({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  const [creatingSession, setCreatingSession] =
    useState(false);

  async function handleRecord() {
    if (creatingSession) return;

    try {
      setCreatingSession(true);

      const result =
        await createRecordingSession({
          projectId,
        });

      router.push(
        `/booth?projectId=${result.projectId}&sessionId=${result.sessionId}`,
      );
    } catch (error) {
      console.error(
        "[ProjectToolbar] Unable to start recording:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to start recording session.",
      );

      setCreatingSession(false);
    }
  }

  return (
    <section className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={handleRecord}
        disabled={creatingSession}
        className="
          rounded-xl
          bg-orange-500
          px-6
          py-3
          font-semibold
          text-black
          transition
          hover:bg-orange-400
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <span className="flex items-center gap-2">
          {creatingSession ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Mic2 size={18} />
          )}

          {creatingSession
            ? "Opening Booth..."
            : "Record"}
        </span>
      </button>

      <button
        type="button"
        disabled
        className="
          rounded-xl
          border
          border-zinc-700
          px-6
          py-3
          text-zinc-500
        "
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          Mix
        </span>
      </button>

      <button
        type="button"
        disabled
        className="
          rounded-xl
          border
          border-zinc-700
          px-6
          py-3
          text-zinc-500
        "
      >
        <span className="flex items-center gap-2">
          <Wand2 size={18} />
          Master
        </span>
      </button>

      <button
        type="button"
        disabled
        className="
          rounded-xl
          border
          border-zinc-700
          px-6
          py-3
          text-zinc-500
        "
      >
        <span className="flex items-center gap-2">
          <UploadCloud size={18} />
          Publish
        </span>
      </button>
    </section>
  );
}