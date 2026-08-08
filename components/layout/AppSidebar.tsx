"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Disc3,
  FileText,
  Home,
  Mic2,
  Settings,
  Swords,
  UserRound,
  Users,
} from "lucide-react";

type AppSidebarUser = {
  id: string;
  email: string;
  username: string;
  rapName: string;
  avatarUrl: string;
};

type AppSidebarProps = {
  user: AppSidebarUser;
};

const navigation = [
  {
    label: "The Yard",
    href: "/yard",
    icon: Home,
  },
  {
    label: "Rap Sheet",
    href: "/rap-sheet",
    icon: FileText,
  },
  {
    label: "Booth",
    href: "/booth",
    icon: Mic2,
  },
  {
    label: "Beats",
    href: "/beats",
    icon: Disc3,
  },
  {
    label: "Battles",
    href: "/battles",
    icon: Swords,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: Users,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export default function AppSidebar({
  user,
}: AppSidebarProps) {
  const pathname = usePathname();

  const displayName =
    user.rapName ||
    user.username ||
    "Creator";

  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-900 bg-zinc-950 lg:flex lg:min-h-screen lg:flex-col">
      {/* Brand */}
      <div className="border-b border-zinc-900 p-6">
        <Link href="/yard" className="block">
          <div className="text-lg font-black tracking-[0.18em] text-white">
            RAPYARD
          </div>

          <div className="mt-1 text-[9px] font-bold tracking-[0.28em] text-zinc-600">
            CREATOR NETWORK
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
          Yard
        </div>

        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition",
                active
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />

              <span>{item.label}</span>

              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-zinc-900 p-4">
        <div className="mb-3 flex items-center gap-3 px-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900">
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

          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">
              {displayName}
            </div>

            <div className="truncate text-[10px] text-zinc-600">
              {user.username
                ? `@${user.username.replace(/^@/, "")}`
                : user.email}
            </div>
          </div>
        </div>

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
        >
          <UserRound className="h-4 w-4" />
          <span>Profile</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-white"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}