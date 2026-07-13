import SceneTransition from "@/components/SceneTransition";
import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export const metadata = {
  title: "Sign Up | RapYard",
};

export default function SignupPage() {
  return (
    <SceneTransition>
      <div className="grit"></div>

      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <div className="w-full max-w-md">

          <div className="mb-10 text-center">
            <h1 className="text-5xl font-black uppercase tracking-[0.2em] text-white">
              JOIN THE YARD
            </h1>

            <p className="mt-4 text-zinc-400">
              Become one of the first creators shaping RapYard.
            </p>
          </div>

          <SignupForm />

          <div className="mt-8 text-center text-sm text-zinc-400">
            Already have an account{" "}
            <Link
              href="/login"
              className="font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Sign In
            </Link>
          </div>

        </div>
      </main>
    </SceneTransition>
  );
}


