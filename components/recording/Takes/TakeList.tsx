"use client";

import {
  Check,
  Clock3,
  Loader2,
  MoreVertical,
  Pencil,
  Play,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

import { useAudio } from "@/components/audio";
import { getRecordingUrl } from "@/lib/audio/getRecordingUrl";
import { deleteTake } from "@/lib/takes/deleteTake";
import { renameTake } from "@/lib/takes/renameTake";
import { toggleFavoriteTake } from "@/lib/takes/toggleFavoriteTake";
import type { RecordingTake } from "@/lib/audio/types";

type Props = {
  takes: RecordingTake[];
  onTakesChange?: (
    takes: RecordingTake[],
  ) => void;
};

function formatDuration(duration: number) {
  const totalSeconds = Math.max(
    0,
    Math.round(duration),
  );

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds = String(
    totalSeconds % 60,
  ).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default function TakeList({
  takes,
  onTakesChange,
}: Props) {
  const {
    play,
    currentTrack,
    playing,
    loading,
  } = useAudio();

  const [items, setItems] =
    useState<RecordingTake[]>(takes);

  const [loadingTakeId, setLoadingTakeId] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [menuId, setMenuId] =
    useState<string | null>(null);

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  function updateItems(
    next: RecordingTake[],
  ) {
    setItems(next);
    onTakesChange?.(next);
  }

  async function handlePlay(
    take: RecordingTake,
  ) {
    try {
      setError(null);
      setLoadingTakeId(take.id);

      const signedUrl =
        await getRecordingUrl(
          take.storage_path,
        );

      await play({
        ...take,
        url: signedUrl,
      });
    } catch (playError) {
      console.error(
        "[TakeList] Failed to play take:",
        playError,
      );

      setError(
        playError instanceof Error
          ? playError.message
          : "Unable to play this take.",
      );
    } finally {
      setLoadingTakeId(null);
    }
  }

  function startRename(
    take: RecordingTake,
  ) {
    setEditingId(take.id);
    setEditTitle(
      take.title ??
        `Take ${take.take_number}`,
    );
    setMenuId(null);
    setError(null);
  }

  function cancelRename() {
    setEditingId(null);
    setEditTitle("");
  }

  async function handleRename(
    takeId: string,
  ) {
    const title = editTitle.trim();

    if (!title) {
      setError(
        "Take name cannot be empty.",
      );
      return;
    }

    try {
      setBusyId(takeId);
      setError(null);

      const updated =
        await renameTake(
          takeId,
          title,
        );

      const next = items.map(
        (item) =>
          item.id === takeId
            ? updated
            : item,
      );

      updateItems(next);
      cancelRename();
    } catch (renameError) {
      console.error(
        "[TakeList] Failed to rename take:",
        renameError,
      );

      setError(
        renameError instanceof Error
          ? renameError.message
          : "Unable to rename take.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleFavorite(
    take: RecordingTake,
  ) {
    try {
      setBusyId(take.id);
      setMenuId(null);
      setError(null);

      const updated =
        await toggleFavoriteTake(
          take.id,
          !take.favorite,
        );

      const next = items.map(
        (item) =>
          item.id === take.id
            ? updated
            : item,
      );

      updateItems(next);
    } catch (favoriteError) {
      console.error(
        "[TakeList] Failed to update favorite:",
        favoriteError,
      );

      setError(
        favoriteError instanceof Error
          ? favoriteError.message
          : "Unable to update favorite.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(
    take: RecordingTake,
  ) {
    const confirmed =
      window.confirm(
        `Delete ${
          take.title ??
          `Take ${take.take_number}`
        }? This cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setBusyId(take.id);
      setMenuId(null);
      setError(null);

      await deleteTake(take.id);

      const next = items.filter(
        (item) =>
          item.id !== take.id,
      );

      updateItems(next);

      if (
        currentTrack?.id === take.id
      ) {
        // The current AudioProvider owns
        // playback state, so we leave it
        // untouched here.
      }
    } catch (deleteError) {
      console.error(
        "[TakeList] Failed to delete take:",
        deleteError,
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete take.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-black">
          <Play
            size={18}
            className="text-zinc-600"
          />
        </div>

        <h3 className="mt-4 text-sm font-bold text-zinc-300">
          No takes yet
        </h3>

        <p className="mt-2 text-xs text-zinc-600">
          Your recordings will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {items.map((take) => {
        const isCurrent =
          currentTrack?.id === take.id;

        const isPlaying =
          isCurrent && playing;

        const isLoading =
          loadingTakeId === take.id ||
          (isCurrent && loading);

        const isBusy =
          busyId === take.id;

        const isEditing =
          editingId === take.id;

        return (
          <div
            key={take.id}
            className={`
              rounded-2xl
              border
              p-4
              transition
              ${
                isCurrent
                  ? "border-orange-500/40 bg-orange-500/5"
                  : "border-zinc-900 bg-zinc-950"
              }
            `}
          >
            <div className="flex items-center gap-4">
              {/* Play */}
              <button
                type="button"
                onClick={() =>
                  handlePlay(take)
                }
                disabled={
                  isLoading ||
                  isBusy ||
                  isEditing
                }
                aria-label={`Play ${
                  take.title ??
                  `Take ${take.take_number}`
                }`}
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-500
                  text-black
                  transition
                  hover:bg-orange-400
                  disabled:cursor-wait
                  disabled:opacity-70
                "
              >
                {isLoading ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Play
                    size={17}
                    fill="currentColor"
                  />
                )}
              </button>

              {/* Information */}
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="flex max-w-xl gap-2">
                    <input
                      value={editTitle}
                      onChange={(event) =>
                        setEditTitle(
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          void handleRename(
                            take.id,
                          );
                        }

                        if (
                          event.key ===
                          "Escape"
                        ) {
                          cancelRename();
                        }
                      }}
                      autoFocus
                      className="
                        min-w-0
                        flex-1
                        rounded-lg
                        border
                        border-zinc-700
                        bg-black
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        outline-none
                        focus:border-orange-500
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        void handleRename(
                          take.id,
                        )
                      }
                      disabled={isBusy}
                      className="rounded-lg bg-orange-500 p-2 text-black hover:bg-orange-400"
                      aria-label="Save name"
                    >
                      {isBusy ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={
                        cancelRename
                      }
                      disabled={isBusy}
                      className="rounded-lg border border-zinc-800 p-2 text-zinc-500 hover:text-white"
                      aria-label="Cancel rename"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <h3
                        className={`
                          truncate
                          text-sm
                          font-bold
                          ${
                            isCurrent
                              ? "text-orange-400"
                              : "text-white"
                          }
                        `}
                      >
                        {take.title ??
                          `Take ${take.take_number}`}
                      </h3>

                      {take.favorite && (
                        <Star
                          size={14}
                          fill="currentColor"
                          className="shrink-0 text-orange-500"
                        />
                      )}

                      {isPlaying && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                          Playing
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-zinc-600">
                      <span className="font-mono">
                        {formatDuration(
                          take.duration,
                        )}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={12} />

                        {new Date(
                          take.created_at,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Take number */}
              <div className="hidden text-right sm:block">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-700">
                  Take
                </div>

                <div className="mt-1 font-mono text-sm font-bold text-zinc-500">
                  {String(
                    take.take_number,
                  ).padStart(2, "0")}
                </div>
              </div>

              {/* Menu */}
              {!isEditing && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setMenuId(
                        menuId === take.id
                          ? null
                          : take.id,
                      )
                    }
                    disabled={isBusy}
                    aria-label="Take options"
                    className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
                  >
                    {isBusy ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <MoreVertical
                        size={18}
                      />
                    )}
                  </button>

                  {menuId === take.id && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl">
                      <button
                        type="button"
                        onClick={() =>
                          startRename(
                            take,
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      >
                        <Pencil size={14} />
                        Rename
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleFavorite(
                            take,
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      >
                        <Star
                          size={14}
                          fill={
                            take.favorite
                              ? "currentColor"
                              : "none"
                          }
                        />
                        {take.favorite
                          ? "Unfavorite"
                          : "Favorite"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(
                            take,
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-red-500 hover:bg-red-950/30"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}