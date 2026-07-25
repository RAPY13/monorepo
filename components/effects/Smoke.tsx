export default function Smoke() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-20">
      <div className="absolute left-1/4 top-24 h-96 w-96 rounded-full bg-white blur-[140px]" />

      <div className="absolute bottom-20 right-1/4 h-80 w-80 rounded-full bg-zinc-500 blur-[120px]" />
    </div>
  );
}
