"use client";

import type { RapSheetData } from "./types";
type StepProfileProps = {
  data: RapSheetData;

  update: <K extends keyof RapSheetData>(
    key: K,
    value: RapSheetData[K]
  ) => void;
};

const GENRES = [
  "Hip-Hop",
  "Rap",
  "Trap",
  "Drill",
  "Boom Bap",
  "R&B",
  "Pop",
  "Rock",
  "Country",
  "Jazz",
];

export default function StepProfile({
  data,
  update,
}: StepProfileProps) {
  function toggleGenre(genre: string) {
    if (data.genres.includes(genre)) {
      update(
        "genres",
        data.genres.filter((g) => g !== genre)
      );
    } else {
      update("genres", [
        ...data.genres,
        genre,
      ]);
    }
  }

  return (
    <section className="mx-auto max-w-3xl">

      <div className="mb-12">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
          Step 2
        </p>

        <h1 className="mt-3 text-5xl font-black">
          Your Sound
        </h1>

        <p className="mt-5 max-w-xl text-zinc-400 leading-8">
          Tell the community about yourself.
        </p>

      </div>

      <div className="space-y-8">

        {/* Bio */}

        <div>

          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
            Bio
          </label>

          <textarea
            rows={5}
            value={data.bio}
            maxLength={250}
            onChange={(e) =>
              update("bio", e.target.value)
            }
            placeholder="Tell the Yard about yourself..."
            className="
              w-full
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              px-6
              py-5
              outline-none
              transition
              focus:border-orange-500
            "
          />

          <p className="mt-2 text-right text-xs text-zinc-500">
            {data.bio.length}/250
          </p>

        </div>

        {/* City */}

        <div>

          <label className="mb-3 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
            City
          </label>

          <input
            value={data.city}
            onChange={(e) =>
              update("city", e.target.value)
            }
            placeholder="Houston, TX"
            className="
              w-full
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              px-6
              py-5
              outline-none
              transition
              focus:border-orange-500
            "
          />

        </div>

        {/* Genres */}

        <div>

          <label className="mb-4 block text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
            Genres
          </label>

          <div className="flex flex-wrap gap-3">

            {GENRES.map((genre) => {
              const selected =
                data.genres.includes(genre);

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() =>
                    toggleGenre(genre)
                  }
                  className={`
                    rounded-full
                    border
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    transition

                    ${
                      selected
                        ? "border-orange-500 bg-orange-500 text-black"
                        : "border-zinc-700 bg-zinc-950 hover:border-orange-500"
                    }
                  `}
                >
                  {genre}
                </button>
              );
            })}

          </div>

        </div>

      </div>

    </section>
  );
}