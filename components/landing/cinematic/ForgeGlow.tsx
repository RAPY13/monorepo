export default function ForgeGlow() {
  return (
    <>
      {/* Center Forge Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/15 blur-[220px]" />

      {/* Bottom Left Glow */}
      <div className="pointer-events-none absolute bottom-[-120px] left-[-120px] h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[180px]" />

      {/* Top Right Glow */}
      <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-amber-400/5 blur-[160px]" />

      {/* Bottom Center Glow */}
      <div className="pointer-events-none absolute bottom-[-180px] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-400/8 blur-[200px]" />
    </>
  );
}