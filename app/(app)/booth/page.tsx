import RecordingBooth from "@/components/recording/RecordingBooth";
import RecordingBoothHome from "@/components/recording/RecordingBoothHome";

type BoothPageProps = {
  searchParams: Promise<{
    projectId?: string;
    sessionId?: string;
  }>;
};

export default async function BoothPage({
  searchParams,
}: BoothPageProps) {
  const { projectId, sessionId } =
    await searchParams;

  if (!projectId || !sessionId) {
    return <RecordingBoothHome />;
  }

  return (
    <RecordingBooth
      projectId={projectId}
      sessionId={sessionId}
    />
  );
}