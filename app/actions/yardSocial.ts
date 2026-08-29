"use server";

import { createClient } from "@/lib/supabase/server";

type Reaction = "fire" | "bolt" | "sunglasses";
type ActivityType = "comment" | "repost" | "boost";

export async function toggleYardReaction({
  contentId,
  reaction,
}: {
  contentId: string;
  reaction: Reaction;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to react.");

  const { data: existing, error: lookupError } = await supabase
    .from("yard_reactions")
    .select("id, reaction")
    .eq("user_id", user.id)
    .eq("content_id", contentId)
    .eq("content_type", "feed_item")
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing?.reaction === reaction) {
    const { error } = await supabase.from("yard_reactions").delete().eq("id", existing.id);
    if (error) throw error;
    return { active: false, reaction: null };
  }

  const { error } = await supabase.from("yard_reactions").upsert(
    { user_id: user.id, content_id: contentId, content_type: "feed_item", reaction },
    { onConflict: "user_id,content_id,content_type" },
  );
  if (error) throw error;
  return { active: true, reaction };
}

export async function createYardActivity({
  contentId,
  activityType,
  body,
}: {
  contentId: string;
  activityType: ActivityType;
  body?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to continue.");

  const { error } = await supabase.from("yard_activity").insert({
    actor_id: user.id,
    content_id: contentId,
    content_type: "feed_item",
    activity_type: activityType,
    body: body?.trim() || null,
  });
  if (error) throw error;
  return { success: true };
}
