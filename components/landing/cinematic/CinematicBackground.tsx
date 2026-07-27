import ForgeGlow from "./ForgeGlow";
import SteelGrid from "./SteelGrid";
import Smoke from "./Smoke";
import Embers from "./Embers";

export default function CinematicBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Forge Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

      {/* Visual Layers */}
      <ForgeGlow />
      <SteelGrid />
      <Smoke />
      <Embers />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.72)_100%)]" />
    </div>
  );
}