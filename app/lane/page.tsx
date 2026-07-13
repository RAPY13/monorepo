import SceneTransition from "@/components/SceneTransition";

export default function LanePage() {
  return (
    <SceneTransition>
      <div className="grit"></div>   {/* ← ALWAYS HERE */}

      <div className="lane-selection">
        {/* Lane selection cinematic UI */}
      </div>
    </SceneTransition>
  );
}
