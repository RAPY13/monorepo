"use client";

import type { RapSheetData } from "./types";
type StepRoleProps = {
  data: RapSheetData;

  update: <K extends keyof RapSheetData>(
    key: K,
    value: RapSheetData[K]
  ) => void;
};

const roles = [
  {
    id: "listener",
    icon: "🎧",
    title: "LISTENER",
    description:
      "Discover music, vote on battles, support creators, and build the culture.",
  },
  {
    id: "artist",
    icon: "🎤",
    title: "ARTIST",
    description:
      "Record music, release tracks, collaborate, and compete.",
  },
  {
    id: "producer",
    icon: "🎛",
    title: "PRODUCER",
    description:
      "Create beats, sell your sound, and collaborate with artists.",
  },
  {
    id: "engineer",
    icon: "🎚",
    title: "ENGINEER",
    description:
      "Mix, master, restore audio, and help artists sound their best.",
  },
] as const;

export default function StepRole({
  data,
  update,
}: StepRoleProps) {
  return (
    <section className="mx-auto max-w-6xl">

      <div className="mb-14 text-center">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
          Step 3
        </p>

        <h1 className="mt-4 text-5xl font-black">
          HOW DO YOU MOVE THE YARD?
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Choose what brought you here today.
          You can always add more roles later in Settings.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        {roles.map((role) => {
          const active =
            data.primaryRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() =>
                update(
                  "primaryRole",
                  role.id
                )
              }
              className={`
                group
                rounded-3xl
                border
                p-8
                text-left
                transition-all
                duration-300

                ${
                  active
                    ? "border-orange-500 bg-orange-500/10 shadow-[0_0_40px_rgba(249,115,22,.25)]"
                    : "border-zinc-800 bg-zinc-950 hover:border-orange-500 hover:-translate-y-1"
                }
              `}
            >

              <div className="mb-6 text-6xl">
                {role.icon}
              </div>

              <h2
                className={`
                  text-2xl
                  font-black
                  tracking-wide

                  ${
                    active
                      ? "text-orange-400"
                      : "text-white"
                  }
                `}
              >
                {role.title}
              </h2>

              <p className="mt-5 leading-8 text-zinc-400">
                {role.description}
              </p>

              {active && (
                <div className="mt-8 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-black">
                  SELECTED
                </div>
              )}

            </button>
          );
        })}

      </div>

      <p className="mt-12 text-center text-sm text-zinc-500">
        Don't worry—you can add more roles later.
      </p>

    </section>
  );
}