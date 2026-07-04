"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function useWaitlist(initialEmail = "") {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function enterYard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      document.cookie = "rapyard-auth=1; path=/; max-age=31536000; samesite=lax";
      router.push("/gate");
      return;
    }

    const data = await res.json().catch(() => null);
    setError(data?.message || "Unable to enter the yard. Try again.");
  }

  return { email, setEmail, loading, error, enterYard };
}
