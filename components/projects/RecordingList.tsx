"use client";

import RecordingCard from "./RecordingCard";
import type { RecordingTake } from "@/lib/audio/types";

type RecordingListProps = {
  recordings: RecordingTake[];
};

export default function RecordingList({
  recordings,
}: RecordingListProps) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold uppercase text-white">
        Recordings
      </h2>

      <div className="space-y-4">
        {recordings.length === 0 ? (
          <p className="text-zinc-500">
            No recordings yet.
          </p>
        ) : (
          recordings.map((recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
            />
          ))
        )}
      </div>
    </section>
  );
}