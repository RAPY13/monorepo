"use client";

type ProgressBarProps = {
  currentStep?: number;
  totalSteps?: number;
};

export default function ProgressBar({
  currentStep = 1,
  totalSteps = 4,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">

      {/* Header */}

      <div className="mb-4 flex items-center justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
            Rap Sheet
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Build Your Identity
          </h1>

        </div>

        <div className="text-right">

          <p className="text-sm font-semibold text-zinc-400">
            Step {currentStep} of {totalSteps}
          </p>

        </div>

      </div>

      {/* Progress */}

      <div className="h-2 overflow-hidden rounded-full bg-zinc-900">

        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* Labels */}

      <div className="mt-5 grid grid-cols-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">

        <span
          className={
            currentStep >= 1
              ? "text-orange-400"
              : ""
          }
        >
          Identity
        </span>

        <span
          className={
            currentStep >= 2
              ? "text-orange-400"
              : ""
          }
        >
          Profile
        </span>

        <span
          className={
            currentStep >= 3
              ? "text-orange-400"
              : ""
          }
        >
          Role
        </span>

        <span
          className={
            currentStep >= 4
              ? "text-orange-400"
              : ""
          }
        >
          Review
        </span>

      </div>

    </div>
  );
}