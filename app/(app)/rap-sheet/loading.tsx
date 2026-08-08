export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-8 h-14 w-14 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-500" />

        <h2 className="text-2xl font-black uppercase tracking-[0.25em] text-white">
          BUILDING RAP SHEET
        </h2>

        <p className="mt-4 text-sm text-zinc-500">
          Preparing your creator profile...
        </p>
      </div>
    </div>
  );
}