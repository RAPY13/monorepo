"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { createClient } from "@/utils/supabase/client";

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    action?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 1,
        title: "WELCOME TO RAPYARD",
        description: "The rap workshop in your pocket. Where bars get built.",
        action: "START",
    },
    {
        id: 2,
        title: "THREE CHAMBERS",
        description: "Record in The Booth. Battle in The Pit. Discover beats in The Yard.",
        action: "EXPLORE",
    },
    {
        id: 3,
        title: "BUILD YOUR PROFILE",
        description: "Track your stats. Climb the leaderboard. Earn your Founder Badge.",
        action: "SETUP",
    },
    {
        id: 4,
        title: "READY TO CLOCK IN?",
        description: "Everything a rapper needs. Nothing they don't.",
        action: "BEGIN",
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const stepRef = useRef<HTMLDivElement | null>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");

    // Fetch user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push("/gate");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                router.push("/gate");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [supabase, router]);

    // Entrance animation
    useEffect(() => {
        if (containerRef.current) {
            gsap.from(containerRef.current, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: "power3.out",
            });
        }
    }, []);

    // Step transition animation
    useEffect(() => {
        if (stepRef.current) {
            gsap.fromTo(
                stepRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        }
    }, [currentStep]);

    const handleNext = async () => {
        if (currentStep === 2) {
            // Profile setup step
            if (!username.trim()) {
                setUsernameError("Please enter a username");
                return;
            }

            if (username.length < 3) {
                setUsernameError("Username must be at least 3 characters");
                return;
            }

            try {
                // Update user metadata with username
                const { error } = await supabase.auth.updateUser({
                    data: {
                        ...user.user_metadata,
                        username: username.trim(),
                    },
                });

                if (error) throw error;

                setUsernameError("");
                setCurrentStep(currentStep + 1);
            } catch (error) {
                console.error("Error saving username:", error);
                setUsernameError("Failed to save username. Try again.");
            }
        } else if (currentStep === ONBOARDING_STEPS.length - 1) {
            // Last step - go to booth
            router.push("/record");
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSkip = () => {
        router.push("/record");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mb-4" />
                    <p className="text-gray-400">Initializing RapYard...</p>
                </div>
            </div>
        );
    }

    const step = ONBOARDING_STEPS[currentStep];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_top,_#333_0,_#050505_55%)]" />

            <div
                ref={containerRef}
                className="relative z-10 h-screen flex flex-col items-center justify-center px-6"
            >
                {/* Step Counter */}
                <div className="absolute top-10 left-6 text-xs text-gray-500 tracking-[0.2em]">
                    STEP {currentStep + 1} / {ONBOARDING_STEPS.length}
                </div>

                {/* Skip Button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-10 right-6 text-xs text-gray-500 hover:text-gray-300 tracking-[0.2em] uppercase transition-colors"
                >
                    Skip
                </button>

                {/* Content */}
                <div
                    ref={stepRef}
                    className="max-w-2xl mx-auto text-center space-y-8"
                >
                    {/* Step Icon */}
                    <div className="text-6xl">
                        {currentStep === 0 && "🎤"}
                        {currentStep === 1 && "🏛️"}
                        {currentStep === 2 && "👤"}
                        {currentStep === 3 && "🚀"}
                    </div>

                    {/* Step Title */}
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-wide">{step.title}</h1>
                        <p className="text-lg text-gray-300">{step.description}</p>
                    </div>

                    {/* Profile Setup Step */}
                    {currentStep === 2 && (
                        <div className="space-y-4 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-2xl font-black text-black">
                                    {username.charAt(0).toUpperCase() || "R"}
                                </div>
                                <div className="flex-grow text-left">
                                    <label className="block text-xs text-gray-400 tracking-[0.1em] mb-2">
                                        CHOOSE YOUR USERNAME
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setUsernameError("");
                                        }}
                                        placeholder="Your moniker"
                                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white text-lg focus:border-yellow-500 outline-none transition-colors"
                                    />
                                    {usernameError && (
                                        <p className="text-xs text-red-500 mt-2">{usernameError}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chamber Preview */}
                    {currentStep === 1 && (
                        <div className="grid grid-cols-3 gap-4 py-6">
                            <div className="border border-gray-700 rounded-lg p-4 bg-black/40">
                                <p className="text-2xl mb-2">🎙️</p>
                                <p className="text-xs font-bold text-gray-300">BOOTH</p>
                                <p className="text-xs text-gray-500 mt-1">Record</p>
                            </div>
                            <div className="border border-gray-700 rounded-lg p-4 bg-black/40">
                                <p className="text-2xl mb-2">⚔️</p>
                                <p className="text-xs font-bold text-gray-300">PIT</p>
                                <p className="text-xs text-gray-500 mt-1">Battle</p>
                            </div>
                            <div className="border border-gray-700 rounded-lg p-4 bg-black/40">
                                <p className="text-2xl mb-2">🎧</p>
                                <p className="text-xs font-bold text-gray-300">YARD</p>
                                <p className="text-xs text-gray-500 mt-1">Discover</p>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all duration-500"
                                style={{
                                    width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center pt-6">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="px-6 py-2 border border-gray-700 rounded text-sm font-bold hover:bg-black/40 transition-colors"
                            >
                                BACK
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="px-8 py-2 bg-yellow-500 text-black rounded text-sm font-bold hover:bg-yellow-400 transition-colors"
                        >
                            {step.action}
                        </button>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="absolute bottom-10 text-center text-xs text-gray-600">
                    <p>Clock in. Put in the work. Leave better than you arrived.</p>
                </div>
            </div>
        </div>
    );
}
