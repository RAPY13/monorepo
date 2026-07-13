"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface RequireRoleProps {
    children: React.ReactNode;
    requiredRole?: "founder" | "member" | null;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ children, requiredRole = null }) => {
    const router = useRouter();
    const { user, role, loading } = useUser();

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-400">Clocking in...</p>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        router.push("/gate");
        return null;
    }

    // Check role requirement
    if (requiredRole && role !== requiredRole) {
        router.push("/");
        return null;
    }

    return <>{children}</>;
};
