import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Login | RapYard",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md">

        <div className="mb-10 text-center">

          <h1 className="text-5xl font-black uppercase tracking-[0.2em] text-white">
            THE GATE
          </h1>

          <p className="mt-4 text-zinc-400">
            Welcome back to RapYard.
          </p>

        </div>

        <LoginForm />

        <div className="mt-8 text-center text-sm text-zinc-400">

          Don't have an account?{" "}

          <Link
            href="/signup"
            className="font-semibold text-yellow-400 hover:text-yellow-300"
          >
            Create one
          </Link>

        </div>

      </div>
    </main>
  );
}
