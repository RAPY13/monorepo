"use client";

export default function HeroHeadline() {
  return (
    <div
      data-hero="headline"
      className="mx-auto max-w-5xl text-center"
    >
      {/* Main Headline */}
      <h1
        className="
          text-4xl
          font-black
          uppercase
          tracking-[-0.03em]
          leading-[0.95]
          text-white
          sm:text-5xl
          md:text-6xl
          lg:text-7xl
          xl:text-8xl
        "
      >
        BUILT FOR THE{" "}
        <span
          className="
            bg-gradient-to-r
            from-white
            via-[#5B7FFF]
            to-white
            bg-clip-text
            text-transparent
          "
        >
          CULTURE.
        </span>
      </h1>

      {/* Divider */}
      <div className="mx-auto mt-10 h-px w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Supporting Copy */}
      <p
        className="
          mx-auto
          mt-10
          max-w-3xl
          text-lg
          leading-8
          text-slate-300
          sm:text-xl
          md:text-2xl
        "
      >
        Where music brings people together.
      </p>
    </div>
  );
}