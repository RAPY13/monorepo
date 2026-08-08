import { notFound } from "next/navigation";

import { getProject } from "@/lib/projects/getProject";
import { getProjectSessions } from "@/lib/recording/getProjectSessions";

import ProjectWorkspace from "@/components/projects/ProjectWorkspace";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({
  params,
}: Props) {
  const { projectId } = await params;

  console.log(
    "[ProjectPage] projectId:",
    projectId,
  );

  if (!projectId) {
    notFound();
  }

  const data =
    await getProject(projectId);

  if (!data) {
    notFound();
  }

  const sessions =
    await getProjectSessions(projectId);

  return (
    <ProjectWorkspace
      project={data.project}
      recordings={data.recordings}
      sessions={sessions}
    />
  );
}