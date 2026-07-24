"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { unlockGate } from "@/lib/unlockGate";

export default function GateSequence() {
  const router = useRouter();

  const handleUnlock = () => {
    unlockGate(() => {
      router.push("/yard");
    });
  };

  return (
    <div className="gate-container">
      <img className="gate-img" src="/gate.png" />
      <img className="chain" src="/chain.png" />
      <img className="fire-barrel" src="/fire.png" />
      <div className="gate-flash" />

      <button className="unlock-btn" onClick={handleUnlock}>
        Enter Yard
      </button>
    </div>
  );
}
