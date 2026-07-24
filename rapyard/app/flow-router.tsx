"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function FlowRouter() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const stage = user.user_metadata?.flow_stage;

    switch (stage) {
      case "CreateAccount":
        router.push("/signup");
        break;
      case "VerifyEmail":
        router.push("/verify");
        break;
      case "FounderBadge":
        router.push("/founder");
        break;
      case "ProfileCreated":
        router.push("/profile");
        break;
      case "PickYourLane":
        router.push("/lane");
        break;
      case "RecordingBooth":
        router.push("/record");
        break;
      case "TheYard":
        router.push("/yard");
        break;
    }
  }, [user]);

  return null;
}
