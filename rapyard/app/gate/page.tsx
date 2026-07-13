"use client";
import Image from "next/image";

export default function GateConfirm() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
      <Image
        src="/founder-badge.svg"
        alt="Founder Badge"
        width={160}
        height={160}
        className="mb-10"
      />

      <h2 className="text-4xl font-semibold">   
         Creators Build the Yard.  
         Listeners Move the Yard.  
         Together,We Own the Yard.</h2>

      <p className="mt-6 text-lg">You're officially a Founding Member.</p>
      <p className="text-lg">Your badge is locked forever.</p>

      <button
        onClick={() => (window.location.href = "/feed")}
        className="mt-12 px-10 py-4 border border-white/40 rounded-full text-sm tracking-[0.3em] hover:bg-white hover:text-black transition"
      >
        ENTER THE YARD
      </button>
    </main>
  );
}
