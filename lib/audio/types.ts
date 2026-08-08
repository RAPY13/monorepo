export interface RecordingTake {
  id: string;
  session_id: string;
  take_number: number;
  title: string | null;
  storage_path: string;
  duration: number;
  size: number | null;
  mime_type: string | null;
  waveform: Record<string, unknown> | null;
  analysis: Record<string, unknown> | null;
  mastered_path: string | null;
  favorite: boolean;
  created_at: string;
}

export interface UploadRecordingResult {
  take: RecordingTake;
  signedUrl?: string;
}