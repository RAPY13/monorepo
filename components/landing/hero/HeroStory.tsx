"use client";

export default function HeroStory() {
  return (
    <div
      data-hero="story"
      className="mx-auto max-w-3xl space-y-6 text-center"
    >
      <p
        className="
          text-lg
          font-semibold
          uppercase
          tracking-[0.15em]
          text-slate-200
          md:text-xl
        "
      >
        CREATORS BUILD THE YARD.
      </p>

      <p
        className="
          text-lg
          font-semibold
          uppercase
          tracking-[0.15em]
          text-[#5B7FFF]
          md:text-xl
        "
      >
        LISTENERS MOVE THE YARD.
      </p>

      <p
        className="
          text-lg
          font-semibold
          uppercase
          tracking-[0.15em]
          text-slate-200
          md:text-xl
        "
      >
        TOGETHER, WE OWN THE YARD.
      </p>
    </div>
  );
}