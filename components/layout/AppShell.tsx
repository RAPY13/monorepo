import Link from "next/link";
import {
  Home,
  Mic2,
  Music2,
  Trophy,
  User,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Recording Booth",
    href: "/booth",
    icon: Mic2,
  },
  {
    label: "The Yard",
    href: "/feed",
    icon: Music2,
  },
  {
    label: "Battles",
    href: "/battles",
    icon: Trophy,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="hidden w-72 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col">
        <div className="border-b border-zinc-800 px-8 py-8">
          <h1 className="chrome-text text-3xl font-black">
            RAPYARD
          </h1>
        </div>

        <nav className="flex-1 px-4 py-8">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-zinc-400 transition-all hover:bg-zinc-900 hover:text-orange-400"
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-zinc-800 p-6 text-sm text-zinc-500">
          RapYard Alpha
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}