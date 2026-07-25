"use client";

import { useRouter } from "next/navigation";
import { sendMagicLink } from "@/app/actions/sendMagicLink";

export default function GateSequence() {
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    await sendMagicLink(email);
    unlockGate();
    setTimeout(() => router.push("/profile"), 1800);
  }

  return (...your UI...)
}
