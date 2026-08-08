"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { completeRapSheet } from "@/app/actions/completeRapSheet";
import { createClient } from "@/lib/supabase/client";

type WizardProps = {
  user: {
    id: string;
    email: string;
  };
};

type RapSheetData = {
  rapName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  city: string;
  genres: string[];
  primaryRole: string;
};

const GENRES = [
  "Hip Hop",
  "Rap",
  "Trap",
  "Drill",
  "Boom Bap",
  "R&B",
  "Pop",
  "Rock",
  "Country",
  "Jazz",
  "Conscious",
  "Melodic Rap",
];

const ROLES = [
  {
    id: "rapper",
    label: "Rapper",
    description: "Write bars, record tracks, represent your voice.",
  },
  {
    id: "producer",
    label: "Producer",
    description: "Build beats, shape sound, create the foundation.",
  },
  {
    id: "listener",
    label: "Listener",
    description: "Discover music, support creators, move the Yard.",
  },
];

const MAX_BIO_LENGTH = 150;

export default function Wizard({ user }: WizardProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [data, setData] = useState<RapSheetData>({
    rapName: "",
    username: "",
    avatarUrl: "",
    bio: "",
    city: "",
    genres: [],
    primaryRole: "",
  });

  /*
   * Load the user's existing Rap Sheet.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.replace("/");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "rap_name, username, avatar_url, bio, city, genres, primary_role, role",
        )
        .eq("id", currentUser.id)
        .maybeSingle();

      if (cancelled) return;

      if (profileError) {
        console.error("[RapSheet] Profile load error:", profileError);
        setError("Unable to load your Rap Sheet.");
      }

      if (profile) {
        setData({
          rapName: profile.rap_name ?? "",
          username: profile.username ?? "",
          avatarUrl: profile.avatar_url ?? "",
          bio: profile.bio ?? "",
          city: profile.city ?? "",
          genres: Array.isArray(profile.genres) ? profile.genres : [],
          primaryRole:
            profile.primary_role ??
            profile.role ??
            "",
        });
      }

      setLoading(false);
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function update<K extends keyof RapSheetData>(
    key: K,
    value: RapSheetData[K],
  ) {
    setData((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError("");
    setSaved(false);
  }

  function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Avatar must be 5MB or smaller.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    update("avatarUrl", previewUrl);
  }

  function removeAvatar() {
    update("avatarUrl", "");
  }

  function toggleGenre(genre: string) {
    setData((previous) => {
      const exists = previous.genres.includes(genre);

      return {
        ...previous,
        genres: exists
          ? previous.genres.filter((item) => item !== genre)
          : [...previous.genres, genre],
      };
    });

    setSaved(false);
  }

  function validate() {
    setError("");

    if (!data.rapName.trim()) {
      setError("Artist Name is required.");
      return false;
    }

    if (!data.username.trim()) {
      setError("Username is required.");
      return false;
    }

    if (!data.bio.trim()) {
      setError("Tell the Yard a little about yourself.");
      return false;
    }

    if (data.bio.length > MAX_BIO_LENGTH) {
      setError(
        `Your bio must be ${MAX_BIO_LENGTH} characters or less.`,
      );
      return false;
    }

    if (!data.city.trim()) {
      setError("City is required.");
      return false;
    }

    if (!data.primaryRole) {
      setError("Choose your primary role.");
      return false;
    }

    if (data.genres.length === 0) {
      setError("Choose at least one genre.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const username = data.username
        .trim()
        .replace(/^@+/, "")
        .toLowerCase();

      /*
       * completeRapSheet is the authoritative save path.
       *
       * A blob URL is only a browser preview and cannot be persisted
       * directly to Supabase. Existing persisted avatar URLs are kept.
       */
      const avatarUrl =
        data.avatarUrl.startsWith("blob:")
          ? ""
          : data.avatarUrl;

      const result = await completeRapSheet({
        userId: user.id,
        rapName: data.rapName.trim(),
        username,
        avatarUrl,
        bio: data.bio.trim(),
        city: data.city.trim(),
        genres: data.genres,
        primaryRole: data.primaryRole,
      });

      if (!result?.success) {
        throw new Error("Unable to save your Rap Sheet.");
      }

      setSaved(true);

      /*
       * Give the user a moment to see the saved state,
       * then enter The Yard.
       */
      router.push("/yard");
      router.refresh();
    } catch (saveError) {
      console.error("[RapSheet] Failed to save:", saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your Rap Sheet. Please try again.",
      );

      setSaving(false);
    }
  }

  const primaryGenre = data.genres[0] || "Hip Hop";

  const setupProgress = useMemo(() => {
    let completed = 0;

    if (data.rapName.trim()) completed += 1;
    if (data.username.trim()) completed += 1;
    if (data.bio.trim()) completed += 1;
    if (data.city.trim()) completed += 1;
    if (data.genres.length > 0) completed += 1;
    if (data.primaryRole) completed += 1;

    return Math.round((completed / 6) * 100);
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-500" />

            <p className="text-xs font-black uppercase tracking-[0.45em] text-orange-500">
              Rap Sheet
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Loading your identity...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[45%] top-[-20%] h-[700px] w-[700px] rounded-full bg-orange-500/[0.045] blur-[180px]" />

        <div className="absolute right-[-10%] top-[30%] h-[500px] w-[500px] rounded-full bg-orange-600/[0.025] blur-[160px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,90,0,0.08),transparent_38%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px] opacity-30" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black" />
      </div>

      {/* Page header */}
      <header className="border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-[1500px] px-5 py-5 md:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500">
                Rap Sheet
              </p>

              <h1 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-4xl">
                Build Your Identity
              </h1>
            </div>

            <div className="rounded-full border border-orange-500/40 bg-black/60 px-5 py-2 text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                Step 1 of 1
              </p>

              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Identity
              </p>
            </div>
          </div>

          <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.7)] transition-all duration-500"
              style={{ width: `${Math.max(setupProgress, 8)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        <div className="mb-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.55em] text-orange-500">
            This is your legacy. Set it right.
          </p>

          <h2 className="mt-3 text-center text-5xl font-black uppercase tracking-[-0.04em] md:text-7xl lg:text-8xl">
            Rap Sheet
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-center text-sm uppercase tracking-[0.18em] text-zinc-500 md:text-base">
            Your story. Your sound. Your Yard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Identity banner */}
          <section className="mb-7 rounded-2xl border border-orange-500/30 bg-black/70 p-5 shadow-[0_0_60px_rgba(249,115,22,0.05)] md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-orange-500/50 bg-orange-500/[0.08]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7 text-orange-500"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3 4.5 6v5.5c0 4.7 3.2 7.9 7.5 9.5 4.3-1.6 7.5-4.8 7.5-9.5V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="m12 8 1.15 2.35 2.6.38-1.88 1.83.44 2.59L12 13.93l-2.31 1.22.44-2.59-1.88-1.83 2.6-.38L12 8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-500">
                  Your Rap Sheet Is Your Identity.
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  This info will represent you across RapYard.
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  You can update it anytime from Settings.
                </p>
              </div>
            </div>
          </section>

          {/* Main grid */}
          <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Editor */}
            <section className="rounded-2xl border border-white/[0.08] bg-[#080808]/95 p-5 shadow-2xl md:p-8">
              <div className="mb-8">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-orange-500">
                  Basic Info
                </p>

                <div className="mt-2 h-[2px] w-32 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.45)]" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Artist name */}
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Artist Name
                  </span>

                  <input
                    id="rap-name"
                    name="rapName"
                    value={data.rapName}
                    onChange={(event) =>
                      update("rapName", event.target.value)
                    }
                    autoComplete="nickname"
                    placeholder="Your artist name"
                    className="w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-4 text-sm font-medium text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                  />
                </label>

                {/* Username */}
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Username
                  </span>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-600">
                      @
                    </span>

                    <input
                      id="username"
                      name="username"
                      value={data.username}
                      onChange={(event) =>
                        update(
                          "username",
                          event.target.value.replace(/^@+/, ""),
                        )
                      }
                      autoComplete="username"
                      placeholder="yourusername"
                      className="w-full rounded-xl border border-zinc-800 bg-black/70 py-4 pl-8 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                    />
                  </div>

                  {data.username.trim() && (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">
                      ✓ Username ready
                    </p>
                  )}
                </label>
              </div>

              {/* Bio */}
              <label className="mt-6 block">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Bio
                  </span>

                  <span
                    className={`text-[10px] font-bold ${
                      data.bio.length >= MAX_BIO_LENGTH
                        ? "text-orange-500"
                        : "text-zinc-600"
                    }`}
                  >
                    {data.bio.length} / {MAX_BIO_LENGTH}
                  </span>
                </div>

                <textarea
                  id="bio"
                  name="bio"
                  value={data.bio}
                  onChange={(event) =>
                    update("bio", event.target.value)
                  }
                  maxLength={MAX_BIO_LENGTH}
                  rows={5}
                  autoComplete="off"
                  placeholder="Tell the Yard who you are..."
                  className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black/70 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                />
              </label>

              {/* Genre / city */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Genre
                  </span>

                  <div className="rounded-xl border border-zinc-800 bg-black/70 p-3">
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map((genre) => {
                        const selected =
                          data.genres.includes(genre);

                        return (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => toggleGenre(genre)}
                            aria-pressed={selected}
                            className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wide transition ${
                              selected
                                ? "border-orange-500 bg-orange-500 text-black"
                                : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-orange-500/50 hover:text-orange-300"
                            }`}
                          >
                            {genre}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    City
                  </span>

                  <input
                    id="city"
                    name="city"
                    value={data.city}
                    onChange={(event) =>
                      update("city", event.target.value)
                    }
                    autoComplete="address-level2"
                    placeholder="Houston, TX"
                    className="w-full rounded-xl border border-zinc-800 bg-black/70 px-4 py-4 text-sm font-medium text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                  />
                </label>
              </div>

              {/* Primary role */}
              <div className="mt-7">
                <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                  Your Lane
                </span>

                <div className="grid gap-3 md:grid-cols-3">
                  {ROLES.map((role) => {
                    const selected =
                      data.primaryRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() =>
                          update("primaryRole", role.id)
                        }
                        aria-pressed={selected}
                        className={`rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-orange-500 bg-orange-500/[0.08] shadow-[0_0_25px_rgba(249,115,22,0.08)]"
                            : "border-zinc-800 bg-black/50 hover:border-orange-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-black uppercase tracking-wide ${
                              selected
                                ? "text-orange-400"
                                : "text-white"
                            }`}
                          >
                            {role.label}
                          </span>

                          {selected && (
                            <span className="text-xs text-orange-500">
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs leading-5 text-zinc-600">
                          {role.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Profile picture */}
              <div className="mt-8 border-t border-zinc-900 pt-8">
                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">
                    Profile Picture
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Your performer identity across the Yard.
                  </p>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative h-36 w-36 shrink-0">
                    <div className="h-full w-full overflow-hidden rounded-full border-2 border-orange-500 bg-zinc-900 shadow-[0_0_45px_rgba(249,115,22,0.16)]">
                      {data.avatarUrl ? (
                        <img
                          src={data.avatarUrl}
                          alt="RapYard profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-5xl font-black text-orange-500">
                            {(
                              data.rapName ||
                              data.username ||
                              "R"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-orange-500 text-black shadow-xl transition hover:bg-orange-400"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </label>

                    <input
                      id="avatar-upload"
                      name="avatar"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={uploadAvatar}
                      className="sr-only"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="avatar-upload"
                      className="inline-flex cursor-pointer items-center rounded-xl border border-orange-500/50 bg-orange-500/[0.06] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-orange-500 transition hover:border-orange-500 hover:bg-orange-500/10"
                    >
                      Upload Image
                    </label>

                    {data.avatarUrl && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="ml-3 rounded-xl border border-zinc-800 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500 transition hover:border-red-500/50 hover:text-red-400"
                      >
                        Remove
                      </button>
                    )}

                    <p className="mt-3 text-xs text-zinc-600">
                      JPG, PNG or WEBP. Maximum size 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Preview */}
            <aside className="xl:sticky xl:top-6 xl:self-start">
              <div className="rounded-2xl border border-orange-500/40 bg-[#080808]/95 p-5 shadow-[0_0_50px_rgba(249,115,22,0.06)] md:p-6">
                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-500">
                    Live Preview
                  </p>

                  <div className="mt-2 h-[2px] w-28 bg-orange-500" />
                </div>

                {/* Preview card */}
                <div className="overflow-hidden rounded-2xl border border-orange-500/50 bg-[#090909]">
                  <div className="relative flex justify-center border-b border-white/[0.06] bg-[radial-gradient(circle_at_50%_25%,rgba(255,110,0,0.13),transparent_50%)] p-7">
                    <div className="relative h-36 w-36">
                      <div className="h-full w-full overflow-hidden rounded-full border border-orange-500 bg-zinc-900 shadow-[0_0_35px_rgba(249,115,22,0.18)]">
                        {data.avatarUrl ? (
                          <img
                            src={data.avatarUrl}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-5xl font-black text-orange-500">
                              {(
                                data.rapName ||
                                data.username ||
                                "R"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="absolute -right-1 top-1 flex items-center gap-1 rounded-full border border-black bg-black/90 px-2 py-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="truncate text-2xl font-black uppercase tracking-tight">
                      {data.rapName || "Your Name"}
                    </h3>

                    <p className="mt-1 text-xs font-bold text-orange-500">
                      @{data.username || "username"}
                    </p>

                    <p className="mt-4 text-xs text-zinc-500">
                      {data.city || "Your City"}
                    </p>

                    <div className="my-5 h-px bg-white/[0.08]" />

                    <p className="min-h-[72px] whitespace-pre-line text-sm leading-6 text-zinc-400">
                      {data.bio ||
                        "Your story will appear here. Build your identity and make your record."}
                    </p>

                    <div className="mt-5 grid grid-cols-3 border-t border-white/[0.08] pt-5">
                      <div>
                        <p className="text-xl font-black text-orange-500">
                          0
                        </p>
                        <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-zinc-600">
                          Projects
                        </p>
                      </div>

                      <div>
                        <p className="text-xl font-black text-orange-500">
                          0
                        </p>
                        <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-zinc-600">
                          Recordings
                        </p>
                      </div>

                      <div>
                        <p className="text-xl font-black text-orange-500">
                          0
                        </p>
                        <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-zinc-600">
                          Battles
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-orange-500/40 bg-orange-500/[0.04] px-3 py-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                        ★ Built For The Culture ★
                      </p>
                    </div>
                  </div>
                </div>

                {/* Setup progress */}
                <div className="mt-7">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">
                      Setup Progress
                    </p>

                    <p className="text-xs font-black text-emerald-500">
                      {setupProgress}%
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.45)] transition-all duration-500"
                      style={{
                        width: `${Math.max(setupProgress, 4)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="mt-7">
                  <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                    RapYard Benefits
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        icon: "◆",
                        title: "Full Access",
                        text: "Unlock the Yard.",
                      },
                      {
                        icon: "●",
                        title: "Your Identity",
                        text: "Your name. Your brand. Your legacy.",
                      },
                      {
                        icon: "★",
                        title: "Platform Ownership",
                        text: "You own your music. Always.",
                      },
                      {
                        icon: "⚡",
                        title: "Built For Artists",
                        text: "Tools made for the culture.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/[0.06] text-orange-500">
                          {item.icon}
                        </div>

                        <div>
                          <p className="text-xs font-black text-white">
                            {item.title}
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-zinc-600">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Error / success */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-500/30 bg-red-500/[0.08] px-5 py-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {saved && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] px-5 py-4 text-sm text-emerald-400"
            >
              Rap Sheet saved. Entering The Yard...
            </div>
          )}

          {/* Save */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={saving}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-orange-400 bg-orange-500 px-6 py-5 text-sm font-black uppercase tracking-[0.22em] text-black shadow-[0_0_40px_rgba(249,115,22,0.18)] transition hover:bg-orange-400 hover:shadow-[0_0_60px_rgba(249,115,22,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10">
                {saving
                  ? "Saving Your Rap Sheet..."
                  : "Save & Enter The Yard"}
              </span>

              {!saving && (
                <span className="relative z-10 ml-4 text-xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              )}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              />
            </button>

            <p className="mt-4 text-center text-[9px] font-black uppercase tracking-[0.35em] text-zinc-700">
              Respect isn't earned. It's recorded.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}