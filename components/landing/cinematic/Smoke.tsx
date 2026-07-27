export default function Smoke() {
  return (
    <>
      {/* Smoke Layer 1 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[8%] h-[700px] w-[700px] animate-smoke-slow rounded-full bg-white/[0.025] blur-[140px]" />
      </div>

      {/* Smoke Layer 2 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-10%] top-[35%] h-[650px] w-[650px] animate-smoke-medium rounded-full bg-orange-300/[0.02] blur-[170px]" />
      </div>

      {/* Smoke Layer 3 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-[-20%] left-[20%] h-[900px] w-[900px] animate-smoke-fast rounded-full bg-white/[0.018] blur-[200px]" />
      </div>
    </>
  );
}