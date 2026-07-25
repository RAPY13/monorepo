type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="h-3 w-full overflow-hidden rounded-full border border-yellow-500/30 bg-zinc-900/80">
      <div
        className="h-full rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 transition-[width] duration-700 ease-out"
        style={{ width: `${safeValue}%` }}
        aria-hidden
      />
    </div>
  );
}
