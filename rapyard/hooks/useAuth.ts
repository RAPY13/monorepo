"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { AuthUser } from "@/types/user";

type UseAuthResult = {
  user: AuthUser | null;
  loading: boolean;
};

export default function useAuth(redirectTo = "/gate"): UseAuthResult {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const supabase = createClient();
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      const authCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.trim().startsWith("rapyard-auth="));

      if (!supabaseUser && !authCookie) {
        router.replace(redirectTo);
        return;
      }

      if (supabaseUser) {
        setUser({ id: supabaseUser.id, email: supabaseUser.email });
      }

      setLoading(false);
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [router, redirectTo]);

  return { user, loading };
}
