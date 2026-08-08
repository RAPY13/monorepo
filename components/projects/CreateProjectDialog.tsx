"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  FolderPlus,
  X,
  Loader2,
} from "lucide-react";

import { createProject } from "@/lib/projects/createProject";

type Props = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateProjectDialog({
  userId: _userId,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function handleOpen() {
    setError("");
    onOpenChange(true);
  }

  function handleClose() {
    if (loading) return;

    setError("");
    onOpenChange(false);
  }

  async function handleCreate() {
    if (!title.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const project = await createProject({
        title: title.trim(),
        description: description.trim(),
      });

      onOpenChange(false);

      setTitle("");
      setDescription("");

      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error("[Projects] Create project failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create project.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* New Project Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          bg-orange-500
          px-6
          py-4
          font-bold
          text-black
          transition
          hover:bg-orange-400
        "
      >
        <FolderPlus size={22} />
        New Project
      </button>

      {/* Dialog */}
      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-5
            backdrop-blur-sm
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-project-title"
        >
          <div
            className="
              w-full
              max-w-xl
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-950
              p-8
              shadow-2xl
            "
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2
                  id="create-project-title"
                  className="text-3xl font-black text-white"
                >
                  Create Project
                </h2>

                <p className="mt-2 text-zinc-500">
                  Every great record starts here.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                aria-label="Close create project dialog"
                className="
                  rounded-xl
                  p-2
                  text-zinc-400
                  transition
                  hover:bg-zinc-900
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <X size={22} />
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="
                  mt-6
                  rounded-xl
                  border
                  border-red-500/30
                  bg-red-500/10
                  px-4
                  py-3
                  text-sm
                  text-red-300
                "
              >
                {error}
              </div>
            )}

            {/* Form */}
            <div className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="project-title"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Project Name
                </label>

                <input
                  id="project-title"
                  name="projectTitle"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Summer EP"
                  autoComplete="off"
                  disabled={loading}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-zinc-700
                    bg-black
                    px-4
                    py-3
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-orange-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="project-description"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  name="projectDescription"
                  rows={5}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe your project..."
                  disabled={loading}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-zinc-700
                    bg-black
                    px-4
                    py-3
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-orange-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="
                  rounded-xl
                  border
                  border-zinc-700
                  px-5
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:border-zinc-500
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreate}
                disabled={loading || !title.trim()}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-6
                  py-3
                  font-bold
                  text-black
                  transition
                  hover:bg-orange-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {loading
                  ? "Creating..."
                  : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}