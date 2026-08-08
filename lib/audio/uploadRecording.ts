import { createClient } from "@/lib/supabase/client";

export interface UploadRecordingParams {
  userId: string;
  projectId: string;
  sessionId: string;

  blob: Blob;

  duration: number;

  waveform?: Record<string, unknown>;

  title?: string;
}

export async function uploadRecording({
  userId,
  projectId,
  sessionId,
  blob,
  duration,
  waveform,
  title,
}: UploadRecordingParams) {
  const supabase = createClient();

  if (blob.size === 0) {
    throw new Error("Recording is empty.");
  }

  // ------------------------------------------------------------
  // Normalize duration
  // recording_takes.duration is an integer in the database.
  // ------------------------------------------------------------

  const normalizedDuration = Math.max(
    0,
    Math.round(duration),
  );

  // ------------------------------------------------------------
  // Find next take number
  // ------------------------------------------------------------

  const {
    data: existing,
    error: takeError,
  } = await supabase
    .from("recording_takes")
    .select("take_number")
    .eq("session_id", sessionId)
    .order("take_number", {
      ascending: false,
    })
    .limit(1);

  if (takeError) {
    throw takeError;
  }

  const nextTake =
    existing && existing.length > 0
      ? existing[0].take_number + 1
      : 1;

  // ------------------------------------------------------------
  // Build storage path
  // ------------------------------------------------------------

  const fileName = `take-${String(nextTake).padStart(
    3,
    "0",
  )}.webm`;

  const storagePath =
    `${userId}/${projectId}/${sessionId}/${fileName}`;

  // ------------------------------------------------------------
  // Upload recording
  // ------------------------------------------------------------

  const {
    error: uploadError,
  } = await supabase.storage
    .from("recordings")
    .upload(storagePath, blob, {
      upsert: false,
      contentType:
        blob.type || "audio/webm",
    });

  if (uploadError) {
    throw uploadError;
  }

  // ------------------------------------------------------------
  // Save database row
  // ------------------------------------------------------------

  const {
    data: take,
    error: dbError,
  } = await supabase
    .from("recording_takes")
    .insert({
      session_id: sessionId,

      take_number: nextTake,

      title:
        title ??
        `Take ${nextTake}`,

      storage_path: storagePath,

      duration: normalizedDuration,

      size: blob.size,

      mime_type:
        blob.type || "audio/webm",

      waveform:
        waveform ?? null,

      favorite: false,
    })
    .select()
    .single();

  // ------------------------------------------------------------
  // Roll back Storage upload if database insert fails
  // ------------------------------------------------------------

  if (dbError) {
    await supabase.storage
      .from("recordings")
      .remove([storagePath]);

    throw dbError;
  }

  return take;
}