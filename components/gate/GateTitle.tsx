"use client";

type GateTitleProps = {
  user?: {
    email?: string;
  };
};

export default function GateTitle({ user }: GateTitleProps) {
  const displayName =
    user?.email?.split("@")[0]?.replace(/[._-]/g, " ") ?? "Creator";

  return (
    <div data-gate="title" className="text-center">
      <p
        className="
          text-sm
          font-semibold
          uppercase
          tracking-[0.45em]
          text-orange-400
        "
      >
        Welcome Back
      </p>

      <h1
        className="
          mt-6
          text-5xl
          font-black
          uppercase
          tracking-[0.18em]
          text-white
          md:text-7xl
        "
      >
        THE GATE
      </h1>

      <p
        className="
          mt-8
          text-lg
          leading-8
          text-zinc-300
        "
      >
        Your Gate Pass has been verified.
      </p>

      <p
        className="
          mt-2
          text-zinc-400
        "
      >
        Welcome,{" "}
        <span className="font-semibold text-orange-400">
          {displayName}
        </span>
        .
      </p>

      <p
        className="
          mx-auto
          mt-6
          max-w-xl
          text-sm
          leading-7
          text-zinc-500
        "
      >
        Beyond these doors is the RapYard community—a place to create,
        collaborate, compete, and build your legacy.
      </p>
    </div>
  );
}