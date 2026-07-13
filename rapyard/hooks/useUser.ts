import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface UserState {
    user: {
        id: string;
        email?: string;
        user_metadata?: {
            role?: "founder" | "member";
        };
    } | null;
    role: "founder" | "member" | null;
}

export function useUser() {
    const supabase = createClient();
    const [user, setUser] = useState<UserState["user"]>(null);
    const [role, setRole] = useState<UserState["role"]>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                if (data.user) {
                    setUser(data.user as UserState["user"]);
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

    return { user, role, loading };
}
