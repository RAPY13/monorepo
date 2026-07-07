import AuthGuard from "@/components/auth/AuthGuard";
import BottomNav from "@/components/navigation/BottomNav";
import ProfileIdentity from "@/components/profile/ProfileIdentity";
import FoundersBadge from "@/components/ui/FoundersBadge";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 sm:px-8 pb-24">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-black/60 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Profile</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight">Your Yard Identity</h1>
            </div>
            <FoundersBadge />
          </div>

          <p className="mt-6 max-w-3xl text-zinc-300">
            This page is protected. Only authenticated founders and patrons can access their profile, battle badges, and OG status.
          </p>

          <div className="mt-8">
            <ProfileIdentity />
          </div>
        </div>
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
