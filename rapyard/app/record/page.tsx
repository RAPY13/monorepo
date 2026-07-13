"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { RequireRole } from "@/app/components/RequireRole";
import { RecordingUI } from "@/app/components/RecordingUI";

export default function RecordRoom() {
    const boothRef = useRef<HTMLDivElement | null>(null);
    const [recordingComplete, setRecordingComplete] = useState(false);

    useEffect(() => {
        gsap.from(boothRef.current, { opacity: 0, y: 40, duration: 0.8 });
    }, []);

    const handleRecordingComplete = (audioBlob: Blob) => {
        console.log("Recording saved:", audioBlob);
        setRecordingComplete(true);

        // You can save to database or cloud storage here
        // Example: upload to Supabase storage
    };

    return (
        <RequireRole>
            <div
                ref={boothRef}
                className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center"
            >
                <div className="max-w-2xl w-full space-y-10">
                    <div className="text-center space-y-2">
                        <p className="tracking-[0.3em] text-xs text-gray-400">CHAMBER ONE</p>
                        <h1 className="text-5xl font-black tracking-wide">THE BOOTH</h1>
                        <p className="text-sm text-gray-400">Where silence becomes bars.</p>
                    </div>

                    {/* Recording UI */}
                    <RecordingUI onRecordingComplete={handleRecordingComplete} />

                    <div className="text-center space-y-2 text-xs text-gray-500">
                        <p>Clock in. Hit record.</p>
                        <p>No overthinking. No retakes.</p>
                        <p>Just bars flowing raw.</p>
                    </div>
                </div>
            </div>
        </RequireRole>
    );
}
