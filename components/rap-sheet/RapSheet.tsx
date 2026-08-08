// components/rap-sheet/RapSheet.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { completeRapSheet } from "@/app/actions/completeRapSheet";
import { createClient } from "@/lib/supabase/client";

type RapSheetProps = {
  user: User;
};

type PrimaryRole =
  | "listener"
  | "artist"
  | "producer"
  | "engineer"
  | "";

const MALE_AVATAR = "/images/avatars/male-default.jpeg";
const FEMALE_AVATAR = "/images/avatars/female-default.jpeg";

const GENRES = [
  "Hip-Hop",
  "Trap",
  "Boom Bap",
  "Drill",
  "R&B",
  "Soul",
  "Freestyle",
];

const ROLES: Array<{
  value: Exclude<PrimaryRole, "">;
  label: string;
}> = [
  {
    value: "artist",
    label: "Artist / Rapper",
  },
  {
    value: "producer",
    label: "Producer",
  },
  {
    value: "engineer",
    label: "Engineer",
  },
  {
    value: "listener",
    label: "Listener",
  },
];

export default function RapSheet({
  user,
}: RapSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [rapName, setRapName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<PrimaryRole>("");
  const [genres, setGenres] = useState<string[]>([]);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [visualChoice, setVisualChoice] = useState<
    "male" | "female" | ""
  >("");

  /*
   * Load the existing profile so returning users
   * do not lose previously entered information.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser || currentUser.id !== user.id) {
        if (!cancelled) {
          setError("Your session could not be verified.");
          setLoading(false);
        }

        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select(
            "rap_name, username, avatar_url, bio, city, genres, primary_role, role",
          )
          .eq("id", currentUser.id)
          .maybeSingle();

      if (cancelled) return;

      if (profileError) {
        console.error(
          "[RapSheet] Profile load failed:",
          profileError,
        );

        setError("We couldn't load your Rap Sheet.");
        setLoading(false);
        return;
      }

      if (profile) {
        setRapName(profile.rap_name ?? "");
        setUsername(profile.username ?? "");
        setCity(profile.city ?? "");
        setBio(profile.bio ?? "");

        setGenres(
          Array.isArray(profile.genres)
            ? profile.genres.filter(
                (genre): genre is string =>
                  typeof genre === "string",
              )
            : [],
        );

        const existingRole =
          profile.primary_role ??
          profile.role ??
          "";

        if (
          existingRole === "listener" ||
          existingRole === "artist" ||
          existingRole === "producer" ||
          existingRole === "engineer"
        ) {
          setRole(existingRole);
        }

        const existingAvatar =
          profile.avatar_url ?? "";

        setAvatarUrl(existingAvatar);

        if (existingAvatar === MALE_AVATAR) {
          setVisualChoice("male");
        } else if (
          existingAvatar === FEMALE_AVATAR
        ) {
          setVisualChoice("female");
        }
      }

      setLoading(false);
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  function selectMale() {
    setVisualChoice("male");
    setAvatarUrl(MALE_AVATAR);
    setError("");
  }

  function selectFemale() {
    setVisualChoice("female");
    setAvatarUrl(FEMALE_AVATAR);
    setError("");
  }

  function toggleGenre(genre: string) {
    setGenres((current) =>
      current.includes(genre)
        ? current.filter((item) => item !== genre)
        : [...current, genre],
    );
  }

  function validate(): boolean {
    setError("");
    setSuccess("");

    if (!visualChoice) {
      setError(
        "Choose a visual identity before entering the Yard.",
      );
      return false;
    }

    if (!rapName.trim()) {
      setError(
        "Add your Rap Name before entering the Yard.",
      );
      return false;
    }

    if (!username.trim()) {
      setError(
        "Choose a username before entering the Yard.",
      );
      return false;
    }

    if (!bio.trim()) {
      setError(
        "Tell the Yard a little about yourself.",
      );
      return false;
    }

    if (bio.trim().length > 300) {
      setError(
        "Your bio must be 300 characters or less.",
      );
      return false;
    }

    if (!role) {
      setError("Choose your primary role.");
      return false;
    }

    return true;
  }

  function handleSubmit() {
    if (!validate()) return;

    startTransition(async () => {
      try {
        await completeRapSheet({
          userId: user.id,
          rapName: rapName.trim(),
          username: username.trim(),
          avatarUrl,
          bio: bio.trim(),
          city: city.trim(),
          genres,
          primaryRole: role,
        });

        setSuccess(
          "Rap Sheet saved. Welcome to the Yard.",
        );

        /*
         * Only navigate after completeRapSheet resolves
         * successfully.
         */
        window.setTimeout(() => {
          router.push("/yard");
          router.refresh();
        }, 350);
      } catch (submissionError) {
        console.error(
          "[RapSheet] Completion failed:",
          submissionError,
        );

        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Unable to save your Rap Sheet. Please try again.",
        );
      }
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-orange-500">
            RapYard
          </p>

          <h1 className="mt-4 text-4xl font-black uppercase">
            Loading Rap Sheet
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Preparing your creator record...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10 lg:py-16">
        {/* Header */}
        <header className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-orange-500">
            RapYard
          </p>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
                Rap Sheet
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                This is your identity inside the Yard.
                Build the record before you enter.
              </p>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                Creator Record
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-400">
                Build Your Identity
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr]">
          {/* Main Form */}
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
            {/* Visual Identity */}
            <div>
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                  Visual Identity
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase">
                  Choose your avatar
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Choose how you want to appear inside
                  the Yard.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Male */}
                <button
                  type="button"
                  onClick={selectMale}
                  aria-pressed={
                    visualChoice === "male"
                  }
                  className={`group overflow-hidden rounded-2xl border text-left transition ${
                    visualChoice === "male"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-zinc-800 bg-black hover:border-zinc-600"
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={MALE_AVATAR}
                      alt="Male RapYard avatar"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Option 01
                    </p>

                    <p className="mt-2 text-xl font-black uppercase">
                      Male
                    </p>

                    {visualChoice === "male" && (
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-orange-500">
                        Selected
                      </p>
                    )}
                  </div>
                </button>

                {/* Female */}
                <button
                  type="button"
                  onClick={selectFemale}
                  aria-pressed={
                    visualChoice === "female"
                  }
                  className={`group overflow-hidden rounded-2xl border text-left transition ${
                    visualChoice === "female"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-zinc-800 bg-black hover:border-zinc-600"
                  }`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={FEMALE_AVATAR}
                      alt="Female RapYard avatar"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Option 02
                    </p>

                    <p className="mt-2 text-xl font-black uppercase">
                      Female
                    </p>

                    {visualChoice === "female" && (
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-orange-500">
                        Selected
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="my-10 h-px bg-zinc-900" />

            {/* Identity Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="rap-name"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-zinc-400"
                >
                  Rap Name
                </label>

                <input
                  id="rap-name"
                  name="rapName"
                  value={rapName}
                  onChange={(event) =>
                    setRapName(event.target.value)
                  }
                  autoComplete="nickname"
                  placeholder="Your stage name"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-zinc-400"
                >
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  autoComplete="username"
                  placeholder="@yourname"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-zinc-400"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  autoComplete="address-level2"
                  placeholder="South, TX"
                  className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-zinc-400"
                >
                  Primary Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as PrimaryRole,
                    )
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none focus:border-orange-500"
                >
                  <option value="">
                    Select your role
                  </option>

                  {ROLES.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="bio"
                  className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400"
                >
                  Bio
                </label>

                <span className="text-xs text-zinc-600">
                  {bio.length}/300
                </span>
              </div>

              <textarea
                id="bio"
                name="bio"
                rows={5}
                maxLength={300}
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                placeholder="Tell the Yard who you are..."
                className="w-full resize-none rounded-xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition placeholder:text-zinc-700 focus:border-orange-500"
              />
            </div>

            {/* Genres */}
            <div className="mt-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                Genres
              </p>

              <div className="flex flex-wrap gap-3">
                {GENRES.map((genre) => {
                  const selected =
                    genres.includes(genre);

                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() =>
                        toggleGenre(genre)
                      }
                      aria-pressed={selected}
                      className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                        selected
                          ? "border-orange-500 bg-orange-500 text-black"
                          : "border-zinc-800 bg-black text-zinc-400 hover:border-orange-500 hover:text-white"
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account */}
            <div className="mt-8 rounded-xl border border-zinc-800 bg-black p-5 text-sm text-zinc-500">
              Signed in as{" "}
              <span className="font-semibold text-white">
                {user.email}
              </span>
            </div>

            {/* Error */}
            {error ? (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-300"
              >
                {error}
              </div>
            ) : null}

            {/* Success */}
            {success ? (
              <div
                role="status"
                className="mt-6 rounded-xl border border-orange-500/40 bg-orange-500/10 px-5 py-4 text-sm font-semibold text-orange-300"
              >
                {success}
              </div>
            ) : null}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="mt-8 w-full rounded-2xl bg-orange-500 py-5 text-sm font-black uppercase tracking-[0.3em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Saving Rap Sheet..."
                : "Enter The Yard →"}
            </button>
          </section>

          {/* Live Preview */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950">
              <div className="border-b border-zinc-900 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                  Live Preview
                </p>
              </div>

              <div className="p-6">
                <div className="aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Rap Sheet avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-700">
                      Choose Avatar
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                    Rap Name
                  </p>

                  <h2 className="mt-2 text-3xl font-black uppercase">
                    {rapName || "Your Rap Name"}
                  </h2>

                  <p className="mt-1 text-sm text-orange-500">
                    {username
                      ? `@${username.replace(/^@/, "")}`
                      : "@username"}
                  </p>
                </div>

                <div className="mt-6 border-t border-zinc-900 pt-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                    Role
                  </p>

                  <p className="mt-2 font-semibold text-zinc-300">
                    {role
                      ? ROLES.find(
                          (item) =>
                            item.value === role,
                        )?.label
                      : "Choose your role"}
                  </p>
                </div>

                <div className="mt-5 border-t border-zinc-900 pt-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                    Location
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    {city || "Your city"}
                  </p>
                </div>

                <div className="mt-5 border-t border-zinc-900 pt-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                    Bio
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {bio ||
                      "This is where your story starts."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                Your Record
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Build your identity, choose your lane,
                and step into the Yard.
              </p>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                Respect isn't earned. It's recorded.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}