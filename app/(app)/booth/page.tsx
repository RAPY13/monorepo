import RecordingBooth from "@/components/recording/RecordingBooth";
import RecordingBoothHome from "@/components/recording/RecordingBoothHome";

type BoothPageProps = {
  searchParams: Promise<{
    projectId?: string;
    sessionId?: string;
    instant?: string;
  }>;
};

export default async function BoothPage({
  searchParams,
}: BoothPageProps) {
  const { projectId, sessionId, instant } =
    await searchParams;

  if (instant === "1") {
    const { default: InstantRecorder } = await import(
      "@/components/recording/InstantRecorder"
    );

    return <InstantRecorder />;
  }

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