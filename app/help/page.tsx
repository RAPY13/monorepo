"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/app/components/AuthGuard";
import BottomNav from "@/app/components/BottomNav";
import { createClient } from "@/utils/supabase/client";
import { getOnboardingProfile, type YardRole } from "@/lib/onboarding-profile";
import {
  BASE_HELP_ARTICLES,
  HELP_CATEGORIES,
  type HelpArticle,
  type HelpCategory,
} from "@/lib/help-content";

type SupabaseHelpArticle = {
  id: number;
  slug: string | null;
  title: string;
  content: string;
  category: string;
  role: YardRole | null;
  tenant: string | null;
  tags: string[] | null;
  is_published: boolean;
};

const SUPPORT_CATEGORIES: HelpCategory[] = HELP_CATEGORIES;

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function articleMatchesRole(article: HelpArticle, role: YardRole | null) {
  if (!article.roles || article.roles.length === 0) {
    return true;
  }

  if (!role) {
    return false;
  }

  return article.roles.includes(role);
}

function articleMatchesTenant(article: HelpArticle, tenantSlug: string | null) {
  if (!article.tenants || article.tenants.length === 0) {
    return true;
  }

  if (!tenantSlug) {
    return false;
  }

  return article.tenants.includes(tenantSlug);
}

function articleMatchesSearch(article: HelpArticle, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    article.title,
    article.content,
    article.category,
    ...(article.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export default function HelpCenterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [role, setRole] = useState<YardRole | null>(null);
  const [tenant, setTenant] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [remoteArticles, setRemoteArticles] = useState<HelpArticle[]>([]);

  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportCategory, setSupportCategory] = useState<HelpCategory>("Getting Started");
  const [supportMessage, setSupportMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/gate");
        return;
      }

      const { profile, error: profileError } = await getOnboardingProfile(supabase, user);

      if (cancelled) {
        return;
      }

      if (profileError) {
        setError(profileError);
      }

      const roleValue = profile?.role ?? null;
      const tenantValue = profile?.tenant ?? null;

      setRole(roleValue);
      setTenant(tenantValue);
      setUserId(user.id);
      setUserEmail(user.email ?? "");
      setDisplayName(profile?.username ?? "");
      setSupportName(profile?.username ?? "");
      setSupportEmail(user.email ?? "");

      const remote = await supabase
        .from("help_articles")
        .select("id, slug, title, content, category, role, tenant, tags, is_published")
        .eq("is_published", true)
        .order("id", { ascending: true })
        .returns<SupabaseHelpArticle[]>();

      if (!cancelled && !remote.error && remote.data) {
        const mapped: HelpArticle[] = remote.data.map((item) => ({
          id: `remote-${item.id}`,
          category: (HELP_CATEGORIES.includes(item.category as HelpCategory)
            ? item.category
            : "Getting Started") as HelpCategory,
          title: item.title,
          content: item.content,
          roles: item.role ? [item.role] : undefined,
          tenants: item.tenant ? [item.tenant] : undefined,
          tags: item.tags ?? [],
        }));

        setRemoteArticles(mapped);
      }

      setLoading(false);
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const effectiveTenant = useMemo(() => (tenant ? normalizeText(tenant) : null), [tenant]);
  const normalizedQuery = useMemo(() => normalizeText(search), [search]);

  const allArticles = useMemo(() => [...BASE_HELP_ARTICLES, ...remoteArticles], [remoteArticles]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      if (selectedCategory !== "All" && article.category !== selectedCategory) {
        return false;
      }

      if (!articleMatchesRole(article, role)) {
        return false;
      }

      if (!articleMatchesTenant(article, effectiveTenant)) {
        return false;
      }

      return articleMatchesSearch(article, normalizedQuery);
    });
  }, [allArticles, selectedCategory, role, effectiveTenant, normalizedQuery]);

  const grouped = useMemo(() => {
    return HELP_CATEGORIES.map((category) => ({
      category,
      articles: filteredArticles.filter((article) => article.category === category),
    })).filter((entry) => entry.articles.length > 0);
  }, [filteredArticles]);

  const tenantSpecific = useMemo(() => {
    if (!effectiveTenant) {
      return [] as HelpArticle[];
    }

    return filteredArticles.filter((article) => article.tenants?.includes(effectiveTenant));
  }, [filteredArticles, effectiveTenant]);

  async function submitSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setSubmitStatus("Session not found. Please sign in again.");
      return;
    }

    if (!supportName.trim() || !supportEmail.trim() || !supportMessage.trim()) {
      setSubmitStatus("Please complete name, email, and message.");
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    const supabase = createClient();
    const result = await supabase.from("support_requests").insert({
      user_id: userId,
      name: supportName.trim(),
      email: supportEmail.trim(),
      category: supportCategory,
      message: supportMessage.trim(),
      role,
      tenant,
      status: "open",
    });

    if (result.error) {
      setSubmitStatus(
        "Unable to submit support request. Confirm migration 007 is applied and support table policies are enabled."
      );
      setSubmitting(false);
      return;
    }

    setSupportMessage("");
    setSubmitting(false);
    setSubmitStatus("Support request submitted. Our team will respond via email.");
  }

  if (loading) {
    return (
      <AuthGuard>
        <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
          <div className="rounded-3xl border border-white/10 bg-black/70 px-8 py-6 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Help center</p>
            <p className="mt-4 text-lg font-semibold">Loading support hub...</p>
          </div>
          <BottomNav />
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white pb-28 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[2.2rem] border border-white/10 bg-black/60 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">RapYard Support Hub</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] sm:text-5xl">Help Center</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">
              Search guides, browse FAQs, and open support tickets from one place. Personalized for your lane and tenant.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">Role</p>
                <p className="mt-2 text-lg font-semibold text-amber-200">{role ?? "Unassigned"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">Tenant</p>
                <p className="mt-2 text-lg font-semibold text-amber-200">{tenant ?? "No tenant"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">Profile</p>
                <p className="mt-2 text-lg font-semibold text-amber-200">{displayName || userEmail || "Member"}</p>
              </div>
            </div>

            {error ? <p className="mt-5 text-sm text-red-400">{error}</p> : null}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
            <div className="space-y-6 rounded-[2.2rem] border border-white/10 bg-black/55 p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search: upload beats, enter battles, royalties..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
                />
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as HelpCategory | "All")}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
                >
                  <option value="All" className="bg-zinc-900 text-white">
                    All categories
                  </option>
                  {HELP_CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-zinc-900 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {grouped.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                  No help articles matched your filters.
                </div>
              ) : null}

              {grouped.map((group) => (
                <div key={group.category} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-red-300/90">{group.category}</p>
                  <div className="mt-3 space-y-3">
                    {group.articles.map((article) => {
                      const expanded = expandedId === article.id;
                      return (
                        <article key={article.id} className="rounded-xl border border-white/10 bg-black/35 p-4">
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : article.id)}
                            className="flex w-full items-center justify-between gap-4 text-left"
                          >
                            <span className="font-semibold text-white">{article.title}</span>
                            <span className="text-zinc-400">{expanded ? "−" : "+"}</span>
                          </button>

                          {expanded ? <p className="mt-3 text-sm leading-7 text-zinc-300">{article.content}</p> : null}

                          {(article.tags ?? []).length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(article.tags ?? []).map((tag) => (
                                <span
                                  key={`${article.id}-${tag}`}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-black/55 p-6 backdrop-blur-xl sm:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-300/90">Role-specific guidance</p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {role === "rapper"
                    ? "Rapper lane prioritizes battles, recording flow, and release strategy."
                    : role === "producer"
                      ? "Producer lane focuses on listing quality, licensing, and split integrity."
                      : role === "listener"
                        ? "Listener lane emphasizes voting mechanics, discovery, and community support."
                        : "Assign a role to unlock lane-specific guides."}
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/55 p-6 backdrop-blur-xl sm:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-300/90">Tenant-specific guidance</p>
                {tenantSpecific.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    {tenantSpecific.map((article) => (
                      <li key={`tenant-${article.id}`}>• {article.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    No custom tenant help found yet. Add tenant-specific entries in `help_articles`.
                  </p>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/55 p-6 backdrop-blur-xl sm:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-300/90">Contact support</p>
                <form onSubmit={submitSupport} className="mt-4 space-y-3">
                  <input
                    value={supportName}
                    onChange={(event) => setSupportName(event.target.value)}
                    placeholder="Name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
                  />
                  <input
                    value={supportEmail}
                    onChange={(event) => setSupportEmail(event.target.value)}
                    placeholder="Email"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
                  />
                  <select
                    value={supportCategory}
                    onChange={(event) => setSupportCategory(event.target.value as HelpCategory)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
                  >
                    {SUPPORT_CATEGORIES.map((category) => (
                      <option key={category} value={category} className="bg-zinc-900 text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={supportMessage}
                    onChange={(event) => setSupportMessage(event.target.value)}
                    placeholder="Describe your issue"
                    rows={5}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-amber-400 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Submitting" : "Submit Support Ticket"}
                  </button>
                </form>

                {submitStatus ? <p className="mt-3 text-sm text-zinc-300">{submitStatus}</p> : null}
              </div>
            </aside>
          </section>
        </div>
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
