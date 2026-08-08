import Link from "next/link";
import { ArrowLeft, Mic2 } from "lucide-react";

type Props = {
  session: {
    id: string;
    title: string;
    project_id: string;
    projects:
      | {
          id: string;
          title: string;
        }
      | null;
  };
};

export default function SessionHeader({
  session,
}: Props) {
  return (
    <header className="mb-8">
      <Link
        href={`/booth?projectId=${session.project_id}&sessionId=${session.id}`}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-600 transition hover:text-orange-500"
      >
        <ArrowLeft size={14} />
        Back to Booth
      </Link>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-500">
            Recording Session
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
            {session.title}
          </h1>

          {session.projects && (
            <p className="mt-3 text-sm text-zinc-500">
              Project:{" "}
              <span className="text-zinc-300">
                {session.projects.title}
              </span>
            </p>
          )}
        </div>

        <Link
          href={`/booth?projectId=${session.project_id}&sessionId=${session.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400"
        >
          <Mic2 size={17} />
          Open Booth
        </Link>
      </div>
    </header>
  );
}