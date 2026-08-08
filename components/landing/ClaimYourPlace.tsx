import Image from "next/image";
import MagicLinkForm from "@/components/auth/MagicLinkForm";

export default function ClaimYourPlace() {
  return (
    <section
      id="claim-your-place"
      className="relative overflow-hidden bg-zinc-950 px-6 py-24 text-white"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Badge */}
          <div className="flex justify-center">
            <Image
              src="/badges/founder-badge.png"
              alt="RapYard Founder Badge"
              width={260}
              height={260}
              priority
              className="drop-shadow-[0_0_50px_rgba(249,115,22,.35)]"
            />
          </div>

          {/* Content */}
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.4em] text-orange-500">
              Founder Access
            </p>

            <h2 className="chrome-text text-4xl font-black md:text-6xl">
              CLAIM YOUR PLACE
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Join RapYard using a secure Magic Link.
            </p>

            <p className="mt-4 text-zinc-400">
              The first <span className="font-bold text-white">500 verified members</span>
              {" "}receive the permanent
              <span className="font-semibold text-orange-400"> Founder Badge</span>.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              <MagicLinkForm />
            </div>

            <p className="mt-5 text-sm text-zinc-500">
              No passwords.
              <br />
              No applications.
              <br />
              Just be early.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}