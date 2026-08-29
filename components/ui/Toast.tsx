"use client";

import { useEffect } from "react";

type Props = {
  message: string;
  variant?: "success" | "error" | "info";
  onClose?: () => void;
  duration?: number;
};

export default function Toast({ message, variant = "info", onClose, duration = 4000 }: Props) {
  useEffect(() => {
    if (!message) return;

    const id = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bg =
    variant === "success"
      ? "bg-emerald-600"
      : variant === "error"
      ? "bg-red-600"
      : "bg-zinc-800/90";

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 flex items-end justify-center pointer-events-none">
      <div
        role="status"
        className={`pointer-events-auto ${bg} rounded-lg px-4 py-3 shadow-lg text-white backdrop-blur-sm transition-transform transform-gpu`}
      >
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}
