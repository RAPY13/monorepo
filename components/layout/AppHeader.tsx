"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, UserRound } from "lucide-react";

type AppHeaderUser = {
  id: string;
  email: string;
  username: string;
  rapName: string;
  avatarUrl: string;
};

type AppHeaderProps = {
  user: AppHeaderUser;
};

export default function AppHeader({
  user,
}: AppHeaderProps) {
  const displayName =
    user.rapName ||
    user.username ||
    "Creator";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-zinc-900 bg-black/95 px-5 backdrop-blur-xl sm:px-8">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
          RapYard
        </div>

        <div className="mt-0.5 text-sm font-black uppercase tracking-[0.15em] text-white">
          The Yard
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-900 text-zinc-500 transition hover:border-zinc-700 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-md border border-transparent px-2 py-1.5 transition hover:border-zinc-800 hover:bg-zinc-950"
        >
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <UserRound className="h-4 w-4 text-zinc-600" />
            )}
          </div>

          <div className="hidden text-left sm:block">
            <div className="max-w-32 truncate text-xs font-bold text-white">
              {displayName}
            </div>

            <div className="max-w-32 truncate text-[9px] text-zinc-600">
              {user.username
                ? `@${user.username.replace(/^@/, "")}`
                : user.email}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}