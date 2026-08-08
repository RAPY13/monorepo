"use client";

import {
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";
const sections = [
  {
    title: "THE GATE",
    status: "complete",
  },
  {
    title: "RAP SHEET",
    status: "current",
    steps: [
      "Who Are You",
      "Your Sound",
      "How Do You Move The Yard?",
      "Review",
    ],
  },
  {
    title: "THE YARD",
    status: "locked",
  },
];

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-zinc-950">

      {/* Logo */}

      <div className="border-b border-zinc-900 px-8 py-8">

        <h1 className="text-3xl font-black tracking-wide">

          <span className="text-white">
            RAP
          </span>

          <span className="text-orange-500">
            YARD
          </span>

        </h1>

      </div>

      {/* Journey */}

      <div className="flex-1 px-8 py-10">

        <h2 className="mb-8 text-xs font-bold tracking-[0.35em] text-zinc-500 uppercase">
          Your Journey
        </h2>

        <div className="space-y-8">

          {sections.map((section) => (
            <div key={section.title}>

              <div className="flex items-center gap-3">

                {section.status === "complete" && (
                  <CheckCircle2
                    className="text-orange-500"
                    size={18}
                  />
                )}

                {section.status === "current" && (
                  <Circle
                    className="text-orange-500"
                    size={18}
                  />
                )}

                {section.status === "locked" && (
                  <Lock
                    className="text-zinc-600"
                    size={16}
                  />
                )}

                <span
                  className={`text-sm font-bold tracking-wide ${
                    section.status === "locked"
                      ? "text-zinc-600"
                      : "text-white"
                  }`}
                >
                  {section.title}
                </span>

              </div>

              {"steps" in section && section.steps && (
                <div className="mt-5 ml-8 space-y-3">

                  {section.steps.map((step, index) => (
                    <div
                      key={step}
                      className={`text-sm ${
                        index === 0
                          ? "text-orange-400 font-semibold"
                          : "text-zinc-500"
                      }`}
                    >
                      {step}
                    </div>
                  ))}

                </div>
              )}

            </div>
          ))}

        </div>

      </div>

      {/* Footer */}

      <div className="border-t border-zinc-900 p-8">

        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
          Your Legacy
        </h3>

        <p className="text-sm leading-7 text-zinc-400">
          Respect isn't earned.
          <br />
          It's recorded.
        </p>

      </div>

    </div>
  );
}