"use client";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function signup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    setLoading(false);

    if (res.ok) {
      setDone(true);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans">

      {/* HERO */}
      <section
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/gate-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-black mb-6">RAPYARD</h1>

          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Hip-hop never had a real home.<br />
            Not a place built by us, for us.<br />
            Not a place where bars matter, beats matter, and the work matters.
          </p>

          <h2 className="text-3xl font-bold mb-4">RAPYARD IS THAT HOME.</h2>

          {!done ? (
            <form
              onSubmit={signup}
              className="max-w-md mx-auto flex flex-col gap-4"
            >
              <input
                type="email"
                required
                placeholder="you@rapyard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition"
              >
                {loading ? "Joining..." : "JOIN THE FOUNDERS LIST"}
              </button>
            </form>
          ) : (
            <p className="text-yellow-400 font-bold text-lg">
              You’re in. Welcome to the Founders List.
            </p>
          )}

          <p className="text-white/50 text-sm mt-6">
            Bleed Tha Block Label • Only the beginning
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">
          What’s Inside the Yard
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Feature title="🔥 Battles" text="Live rap battles. Real rounds. Real votes." />
          <Feature title="🎙 Recording Studio" text="Write, record, drop tracks anywhere." />
          <Feature title="💰 Marketplace" text="Buy, sell & license beats with real ownership." />
          <Feature title="📈 Creator Royalties" text="Fair pay. Real reporting. Your paper, your way." />
          <Feature title="📣 Listener Voting" text="The people decide who wins. Period." />
        </div>
      </section>

      {/* LANES */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Pick Your Lane</h2>

        <div className="grid md:grid-cols-3 gap-10">
          <Lane title="⚔ Rapper" text="Write. Record. Compete." />
          <Lane title="🎧 Producer" text="Upload. Sell. Earn." />
          <Lane title="👂 Listener" text="Vote. Discover. Support." />
        </div>
      </section>

      {/* EDGE TAB METADATA DISPLAY */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold mb-4">User's Edge Browser Tabs Metadata</h2>
        <p className="text-white/60 mb-4">
          The tab with <code>IsCurrent=true</code> is the active tab. Others are background tabs.
        </p>

        <pre className="bg-zinc-900 p-6 rounded border border-zinc-700 text-white/80 text-sm overflow-x-auto">
{`edge_all_open_tabs = [
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>rapyard-landing | rapyard-root | Supabase</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://supabase.com/dashboard/project/stnhsltqawovvmsnipzc</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930807,"isCurrent":true},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>Sign in - Google Accounts</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://accounts.google.com/v3/signin/identifier</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930815,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>Sign in to Apple Account</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://appleid.apple.com/auth/authorize</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930828,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>Supabase</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://supabase.com/dashboard/project/avdcxvtienbjfivcunnr/settings/general</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930832,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>CLI Reference | Supabase Docs</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://supabase.com/docs/reference/cli/supabase-completion</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930835,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>blob:https://copilot.microsoft.com/cedc735f-3366-4f49-bfdc-d776552230f9</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu></WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930838,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>file:///C:/dev/rapyard/public/gate-bg.webp</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>file://C:/dev/rapyard/public/gate-bg.webp</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930841,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>from powershell - Search</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://www.bing.com/search</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930856,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>RapYard</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>file://C:/dev/rapyard/apps/web/index.html</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930814,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>Cinematic Landing Page Design</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://chatgpt.com/c/6a2b6292-12ec-83ea-8608-5a153e34b1de?mweb_fallback=1</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930791,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>Cinematic Landing Page Design</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://chatgpt.com/c/6a2b6292-12ec-83ea-8608-5a153e34b1de</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930822,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>ChatGPT | OpenAI Help Center</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://help.openai.com/en/collections/3742473-chatgpt</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930798,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>How can I find my past ChatGPT invoices? | OpenAI Help Center</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://help.openai.com/en/articles/12356340-how-can-i-find-my-past-chatgpt-invoices</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930825,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>Welcome back - OpenAI</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://auth.openai.com/choose-an-account</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930819,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>localhost:3000</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>http://localhost</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476931357,"isCurrent":false},
{"pageTitle":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>ChatGPT</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","pageUrl":"<WebsiteContent_K592yoPMZ8ckbuMo3vjLu>https://chatgpt.com/library</WebsiteContent_K592yoPMZ8ckbuMo3vjLu>","tabId":476930810,"isCurrent":false}
];`}
        </pre>
      </section>

    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-zinc-900 p-6 rounded border border-zinc-700">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70">{text}</p>
    </div>
  );
}

function Lane({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-zinc-900 p-6 rounded border border-zinc-700">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70">{text}</p>
    </div>
  );
}
