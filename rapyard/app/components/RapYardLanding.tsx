"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createClient } from "@/utils/supabase/client";

gsap.registerPlugin(ScrollTrigger);

interface User {
    id: string;
    email?: string;
    user_metadata?: {
        role?: "founder" | "member";
    };
}

interface RapYardLandingProps {
    onStartRecording?: () => void;
    onEnterBattle?: () => void;
    onBrowseBeats?: () => void;
    onClaimBadge?: () => void;
}

export const RapYardLanding: React.FC<RapYardLandingProps> = ({
    onStartRecording,
    onEnterBattle,
    onBrowseBeats,
    onClaimBadge,
}) => {
    const router = useRouter();
    const supabase = createClient();

    const gateRef = useRef<HTMLDivElement | null>(null);
    const featuresRef = useRef<HTMLDivElement | null>(null);
    const philosophyRef = useRef<HTMLDivElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);
    const foundersRef = useRef<HTMLDivElement | null>(null);
    const bgRef = useRef<HTMLDivElement | null>(null);
    const statsRef = useRef<HTMLDivElement | null>(null);
    const chambersRef = useRef<HTMLDivElement | null>(null);
    const leaderboardRef = useRef<HTMLDivElement | null>(null);

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<"founder" | "member" | null>(null);
    const [loading, setLoading] = useState(true);
    const [foundersClaimed, setFoundersClaimed] = useState(8);
    const maxFounders = 500;

    // Stats counters
    const [activeUsers] = useState(2847);
    const [totalBattles] = useState(14392);
    const [recordingsCreated] = useState(8756);

    // Fetch user and role on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                if (data.user) {
                    setUser(data.user as User);
                    const userRole = data.user.user_metadata?.role as "founder" | "member" | undefined;
                    setRole(userRole ?? "member");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [supabase]);

    // Initial entrance animation
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        tl.from(gateRef.current, { opacity: 0, y: 40 })
            .from(featuresRef.current, { opacity: 0, y: 40 }, "-=0.4")
            .from(statsRef.current, { opacity: 0, y: 40 }, "-=0.4")
            .from(philosophyRef.current, { opacity: 0, y: 40 }, "-=0.4")
            .from(chambersRef.current, { opacity: 0, y: 40 }, "-=0.4")
            .from(ctaRef.current, { opacity: 0, y: 40 }, "-=0.4")
            .from(leaderboardRef.current, { opacity: 0, y: 40 }, "-=0.4")
            .from(foundersRef.current, { opacity: 0, y: 40 }, "-=0.4");
    }, []);

    // Scroll-based scene animations
    useEffect(() => {
        const sections = [
            { ref: gateRef, label: "gate" },
            { ref: featuresRef, label: "features" },
            { ref: statsRef, label: "stats" },
            { ref: philosophyRef, label: "philosophy" },
            { ref: chambersRef, label: "chambers" },
            { ref: ctaRef, label: "cta" },
            { ref: leaderboardRef, label: "leaderboard" },
            { ref: foundersRef, label: "founders" },
        ];

        sections.forEach(({ ref }) => {
            if (ref.current) {
                gsap.from(ref.current, {
                    opacity: 0,
                    y: 60,
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: 0.5,
                        markers: false,
                    },
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    // Parallax background motion
    useEffect(() => {
        if (bgRef.current) {
            gsap.to(bgRef.current, {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    markers: false,
                },
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const handleStartRecording = () => {
        if (!user) {
            router.push("/gate");
        } else {
            router.push("/record");
        }
        onStartRecording?.();
    };

    const handleEnterBattle = () => {
        if (!user) {
            router.push("/gate");
        } else {
            router.push("/battles");
        }
        onEnterBattle?.();
    };

    const handleBrowseBeats = () => {
        router.push("/booth");
        onBrowseBeats?.();
    };

    const handleViewDashboard = () => {
        if (!user) {
            router.push("/gate");
        } else {
            router.push("/profile");
        }
    };

    const handleClaimBadge = () => {
        if (!user) {
            router.push("/gate");
            return;
        }

        // Animate the founders section
        if (foundersRef.current) {
            gsap.to(foundersRef.current, {
                duration: 0.6,
                ease: "back.out",
                scale: 1.05,
            });
        }

        onClaimBadge?.();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
            {/* Parallax background */}
            <div
                ref={bgRef}
                className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_top,_#333_0,_#050505_55%)]"
            />

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-16">
                {/* THE GATE / HERO */}
                <section ref={gateRef} className="text-center space-y-4">
                    <p className="tracking-[0.3em] text-xs text-gray-400">THE GATE</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-wide">RAPYARD</h1>
                    <p className="text-sm md:text-base text-gray-300">WHERE BARS GET BUILT</p>
                    <p className="mt-4 text-sm md:text-base text-gray-400">
                        RapYard is the rap workshop in your pocket.
                    </p>
                    {user && (
                        <p className="mt-2 text-xs text-yellow-400">
                            Welcome back, {user.email?.split("@")[0]}
                            {role === "founder" && " • FOUNDER"}
                        </p>
                    )}
                </section>

                {/* FEATURES */}
                <section ref={featuresRef} className="space-y-4 text-center md:text-left">
                    <p className="uppercase text-xs tracking-[0.25em] text-gray-500">
                        A place built for rappers to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <FeatureItem icon="🎙" label="Record instantly" />
                        <FeatureItem icon="⚔️" label="Jump into battles" />
                        <FeatureItem icon="🎤" label="Join cyphers" />
                        <FeatureItem icon="💿" label="Build tapes" />
                        <FeatureItem icon="🎧" label="Discover beats" />
                    </div>
                    <p className="mt-4 text-sm text-gray-300">
                        Everything a rapper needs.{" "}
                        <span className="text-gray-500">Nothing they don&apos;t.</span>
                    </p>
                </section>

                {/* LIVE STATS */}
                <section ref={statsRef} className="grid grid-cols-3 gap-3 md:gap-6 text-center">
                    <div className="border border-gray-700 rounded-lg p-4 md:p-6 bg-black/40 backdrop-blur-sm hover:border-yellow-500/50 transition-colors">
                        <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">ACTIVE USERS</p>
                        <p className="text-3xl md:text-4xl font-black text-yellow-500">{activeUsers.toLocaleString()}</p>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-4 md:p-6 bg-black/40 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                        <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">BATTLES</p>
                        <p className="text-3xl md:text-4xl font-black text-blue-500">{totalBattles.toLocaleString()}</p>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-4 md:p-6 bg-black/40 backdrop-blur-sm hover:border-red-500/50 transition-colors">
                        <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">RECORDINGS</p>
                        <p className="text-3xl md:text-4xl font-black text-red-500">{recordingsCreated.toLocaleString()}</p>
                    </div>
                </section>

                {/* CHAMBERS PREVIEW */}
                <section ref={chambersRef} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-200">ENTER A CHAMBER</h2>
                    <p className="text-sm text-gray-400">Three rooms. Three purposes. All raw.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ChamberCard
                            icon="🎙️"
                            title="THE BOOTH"
                            description="Clock in. Hit record. Your bars. No overthinking."
                            onClick={handleStartRecording}
                        />
                        <ChamberCard
                            icon="⚔️"
                            title="THE PIT"
                            description="1v1 battles. Real time. Winner takes the crown."
                            onClick={handleEnterBattle}
                        />
                        <ChamberCard
                            icon="🎧"
                            title="THE YARD"
                            description="Curated beats. Tight loops. Ready to go."
                            onClick={handleBrowseBeats}
                        />
                    </div>
                </section>

                {/* LEADERBOARD PREVIEW */}
                {user && (
                    <section ref={leaderboardRef} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-200">YOUR PROFILE</h2>
                            <button
                                onClick={handleViewDashboard}
                                className="text-xs text-yellow-400 hover:text-yellow-300 tracking-[0.1em] underline"
                            >
                                VIEW FULL DASHBOARD →
                            </button>
                        </div>
                        <p className="text-sm text-gray-400">Track your stats, battles, and engagement.</p>
                        <div className="border border-gray-700 rounded-lg p-6 bg-black/40 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-2">QUICK STATS</p>
                                    <p className="text-2xl font-black text-gray-200">
                                        {user.email?.split("@")[0]}
                                    </p>
                                </div>
                                <button
                                    onClick={handleViewDashboard}
                                    className="px-4 py-2 bg-yellow-500 text-black font-bold text-sm rounded hover:bg-yellow-400 transition-colors"
                                >
                                    DASHBOARD
                                </button>
                            </div>
                        </div>
                    </section>
                )}
                <section ref={philosophyRef} className="space-y-3 text-center md:text-left">
                    <h2 className="text-lg font-semibold text-yellow-400">
                        BUILT FOR BARS, NOT ALGORITHMS
                    </h2>
                    <p className="text-sm text-gray-300">The internet rewards attention.</p>
                    <p className="text-sm text-gray-300">RapYard rewards dedication.</p>
                </section>

                {/* CRAFT / CTA */}
                <section ref={ctaRef} className="space-y-4">
                    <div className="space-y-2 text-sm text-gray-300">
                        <p>No filters.</p>
                        <p>No clout games.</p>
                        <p>No endless scrolling.</p>
                        <p>Just a place to sharpen your craft.</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p>Clock in.</p>
                        <p>Put in the work.</p>
                        <p>Leave better than you arrived.</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <GateButton onClick={handleStartRecording}>START RECORDING</GateButton>
                        <GateButton onClick={handleEnterBattle}>ENTER A BATTLE</GateButton>
                        <GateButton onClick={handleBrowseBeats}>BROWSE BEATS</GateButton>
                    </div>
                </section>

                {/* FOUNDERS PROGRAM & CTA */}
                <section className="grid md:grid-cols-[2fr,1.5fr] gap-10 items-start">
                    <div ref={foundersRef} className="space-y-4">
                        <h3 className="text-lg font-semibold text-yellow-400">THE FOUNDERS PROGRAM</h3>
                        <p className="text-sm text-gray-300">
                            Only {maxFounders} Founder Badges will ever exist.
                        </p>

                        {role === "founder" ? (
                            <div className="mt-4 space-y-2 text-sm p-3 border border-yellow-500/50 rounded-lg bg-yellow-500/10">
                                <p className="text-yellow-400 font-semibold">✓ You already hold a Founder Badge</p>
                                <p className="text-gray-300 text-xs">
                                    You&apos;re locked in. Keep building.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4 space-y-2 text-sm">
                                <p className="text-gray-400">
                                    {foundersClaimed} / {maxFounders} claimed
                                </p>
                                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500 transition-all duration-300"
                                        style={{ width: `${(foundersClaimed / maxFounders) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    {maxFounders - foundersClaimed} Founder Badges remaining.
                                </p>
                            </div>
                        )}

                        {role !== "founder" && (
                            <GateButton
                                onClick={handleClaimBadge}
                                className="mt-4 bg-yellow-500 text-black hover:bg-yellow-400"
                            >
                                CLAIM YOUR FOUNDER BADGE
                            </GateButton>
                        )}
                    </div>

                    {/* CTA Signup / Auth Status */}
                    <div className="border border-gray-800 rounded-xl p-5 bg-black/40 backdrop-blur-sm">
                        {user ? (
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-200">Ready to clock in?</h4>
                                <p className="text-xs text-gray-400">
                                    You&apos;re authenticated. Head to any of the chambers to start building.
                                </p>
                                <button
                                    onClick={() => router.push("/record")}
                                    className="inline-block w-full text-center bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 transition-colors text-sm"
                                >
                                    Go to booth
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-200">Join RapYard</h4>
                                <p className="text-xs text-gray-400">
                                    Enter your email to get started building your bars.
                                </p>
                                <a
                                    href="/gate"
                                    className="inline-block w-full text-center bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-400 transition-colors text-sm"
                                >
                                    Sign up & clock in
                                </a>
                                <p className="mt-3 text-xs text-gray-500">
                                    We&apos;ll send you a magic link to get started instantly.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

const FeatureItem: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-gray-200">{label}</span>
    </div>
);

interface GateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: React.ReactNode;
}

const GateButton: React.FC<GateButtonProps> = ({ children, className = "", ...props }) => (
    <button
        className={
            "border border-gray-700 px-4 py-2 text-xs tracking-[0.2em] uppercase " +
            "bg-black/40 hover:bg-black/70 transition-colors " +
            className
        }
        {...props}
    >
        {children}
    </button>
);

const ChamberCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="text-left border border-gray-700 rounded-lg p-5 bg-black/40 hover:bg-black/70 hover:border-yellow-500/50 transition-all duration-300 group"
    >
        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="font-bold text-gray-200 mb-2 group-hover:text-yellow-400 transition-colors">{title}</h3>
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
        <p className="text-xs text-yellow-500 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            ENTER →
        </p>
    </button>
);
