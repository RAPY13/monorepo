"use client";

type Project = {
  visibility: string;
  created_at?: string;
  updated_at: string;
};

export default function ProjectInfo({
  project,
}: {
  project: Project;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">

      <h2 className="text-xl font-bold uppercase">
        Project Info
      </h2>

      <div className="mt-6 space-y-5">

        <InfoRow
          label="Visibility"
          value={project.visibility}
        />

        {project.created_at && (
          <InfoRow
            label="Created"
            value={new Date(
              project.created_at
            ).toLocaleDateString()}
          />
        )}

        <InfoRow
          label="Updated"
          value={new Date(
            project.updated_at
          ).toLocaleDateString()}
        />

      </div>

    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">

      <span className="text-zinc-500">
        {label}
      </span>

      <span className="font-medium capitalize">
        {value}
      </span>

    </div>
  );
}