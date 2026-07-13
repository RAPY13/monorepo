import BottomNav from "../components/BottomNav";

export default function Feed() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold tracking-[0.2em]">THE YARD</h1>
      </div>

      <BottomNav />
    </main>
  );
}
