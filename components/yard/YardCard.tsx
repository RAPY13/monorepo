"use client";

import Link from "next/link";

export type YardCardProps = {
  title: string;
  subtitle: string;
  description: string;
  href?: string;
  locked?: boolean;
  badge?: string;
  recordHref?: string;
};

export default function YardCard({
  title,
  subtitle,
  description,
  href,
  locked = false,
  badge,
  recordHref = "/booth",
}: YardCardProps) {
  const content = (
    <div
      className={`
        group
        relative
        min-h-[230px]
        overflow-hidden
        rounded-2xl
        border
        p-7
        shadow-[0_20px_70px_rgba(0,0,0,0.45)]
        backdrop-blur-md
        transition-all
        duration-500
        ${
          locked
            ? `
              border-blue-300/10
              bg-black/65
              hover:border-blue-300/25
            `
            : `
              border-white/10
              bg-black/60
              hover:-translate-y-1
              hover:border-orange-400/50
              hover:shadow-[0_25px_90px_rgba(255,110,0,0.12)]
            `
        }
      `}
    >
      {/* ==========================================================
          STEEL / CHROME SURFACE
      ========================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          ${
            locked
              ? "bg-[radial-gradient(circle_at_75%_20%,rgba(80,130,180,0.12),transparent_42%)]"
              : "[background:linear-gradient(135deg,rgba(255,255,255,0.07),transparent_35%,rgba(80,130,170,0.10),transparent_75%)]"
          }
        `}
      />

      {/* ==========================================================
          METALLIC HOVER SWEEP
      ========================================================== */}

      {!locked && (
        <div
          className="
            pointer-events-none
            absolute
            -left-1/2
            top-0
            h-full
            w-1/3
            -skew-x-12
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
            opacity-0
            blur-xl
            transition-all
            duration-700
            group-hover:left-[120%]
            group-hover:opacity-100
          "
        />
      )}

      {/* ==========================================================
          LOCKED VIGNETTE
      ========================================================== */}

      {locked && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black/25
            transition
            duration-500
            group-hover:bg-black/10
          "
        />
      )}

      {/* ==========================================================
          CONTENT
      ========================================================== */}

      <div className="relative z-10 flex h-full min-h-[216px] flex-col">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <span
            className={`
              text-[10px]
              font-black
              uppercase
              tracking-[0.35em]
              ${
                locked
                  ? "text-zinc-600"
                  : "text-orange-400"
              }
            `}
          >
            {badge || (locked ? "LOCKED" : "OPEN")}
          </span>

          {locked ? (
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-blue-300/20
                bg-blue-950/30
                text-sm
                text-blue-200
              "
              aria-label="Locked"
            >
              🔒
            </div>
          ) : (
            <span
              className="
                text-lg
                text-zinc-600
                transition
                duration-300
                group-hover:translate-x-1
                group-hover:text-orange-400
              "
              aria-hidden="true"
            >
              →
            </span>
          )}
        </div>

        {/* Main content */}
        <div className="mt-auto">
          <p
            className={`
              text-xs
              font-black
              uppercase
              tracking-[0.35em]
              ${
                locked
                  ? "text-blue-400/70"
                  : "text-blue-300"
              }
            `}
          >
            {subtitle}
          </p>

          <h3
            className={`
              mt-2
              text-2xl
              font-black
              uppercase
              leading-none
              tracking-tight
              ${
                locked
                  ? `
                    text-transparent
                    [background:linear-gradient(180deg,#d9dee1,#68747d,#c7cdd1)]
                    bg-clip-text
                  `
                  : `
                    text-transparent
                    [background:linear-gradient(180deg,#fff,#bfc5c9_35%,#737b80_55%,#fff_75%,#747a7e)]
                    bg-clip-text
                    md:text-3xl
                  `
              }
            `}
          >
            {title}
          </h3>

          <p
            className={`
              mt-4
              max-w-md
              text-sm
              leading-6
              ${locked ? "text-zinc-500" : "text-zinc-400"}
            `}
          >
            {description}
          </p>

          {locked ? (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
                The gate isn't open yet
              </span>

              <div className="h-px flex-1 bg-gradient-to-r from-blue-400/20 to-transparent" />
            </div>
          ) : (
            <div className="mt-6 h-px w-16 bg-gradient-to-r from-orange-500 to-transparent transition-all duration-500 group-hover:w-28" />
          )}
        </div>
      </div>
    </div>
  );

  if (locked || !href) {
    return (
      <div
        className="cursor-not-allowed"
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link
        href={href}
        aria-label={`Enter ${title}`}
        className="block"
      >
        {content}
      </Link>
      <Link
        href={recordHref}
        aria-label={`Record from ${title}`}
        className="flex items-center justify-center gap-2 border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-orange-300 transition hover:border-orange-400 hover:bg-orange-500/20 hover:text-orange-200"
      >
        <span aria-hidden="true">●</span>
        Record Now
      </Link>
    </div>
  );
}