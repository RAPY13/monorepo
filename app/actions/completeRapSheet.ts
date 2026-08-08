"use server";

import { createClient } from "@/lib/supabase/server";

type CompleteRapSheetInput = {
  userId: string;
  rapName: string;
  username: string;
  avatarUrl?: string;
  bio: string;
  city: string;
  genres: string[];
  primaryRole: string;
};

export async function completeRapSheet(
  input: CompleteRapSheetInput,
) {
  const supabase = await createClient();

  // ------------------------------------------------------------
  // Verify authentication
  // ------------------------------------------------------------

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(
      "You must be signed in to complete your Rap Sheet.",
    );
  }

  // ------------------------------------------------------------
  // Prevent modifying another user's profile
  // ------------------------------------------------------------

  if (user.id !== input.userId) {
    throw new Error("Unauthorized Rap Sheet update.");
  }

  // ------------------------------------------------------------
  // Validate required fields
  // ------------------------------------------------------------

  const rapName = input.rapName.trim();
  const username = input.username.trim().replace(/^@/, "");
  const bio = input.bio.trim();
  const city = input.city.trim();

  if (!rapName) {
    throw new Error("Rap Name is required.");
  }

  if (!username) {
    throw new Error("Username is required.");
  }

  if (bio.length > 300) {
    throw new Error("Your bio must be 300 characters or less.");
  }

  const genres = Array.isArray(input.genres)
    ? input.genres.filter(
        (genre): genre is string =>
          typeof genre === "string" &&
          genre.trim().length > 0,
      )
    : [];

  /*
   * Browser blob URLs cannot be stored as permanent avatar URLs.
   * Keep only real/persistent URLs.
   */
  const avatarUrl =
    input.avatarUrl &&
    !input.avatarUrl.startsWith("blob:")
      ? input.avatarUrl
      : null;

  // ------------------------------------------------------------
  // Make sure the profile exists
  // ------------------------------------------------------------

  const { data: existingById, error: lookupByIdError } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

  if (lookupByIdError) {
    console.error(
      "[RapSheet] Profile lookup failed:",
      lookupByIdError,
    );
  }

  let profileExists = Boolean(existingById);

  // Some versions of the schema use user_id instead of id.
  if (!profileExists) {
    const { data: existingByUserId, error: lookupByUserIdError } =
      await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (lookupByUserIdError) {
      console.error(
        "[RapSheet] user_id profile lookup failed:",
        lookupByUserIdError,
      );
    }

    profileExists = Boolean(existingByUserId);
  }

  // ------------------------------------------------------------
  // Profile patch
  // ------------------------------------------------------------

  const patch = {
    username,
    rap_name: rapName,
    avatar_url: avatarUrl,
    bio: bio || null,
    city: city || null,
    genres,
    primary_role: input.primaryRole || null,
    role: input.primaryRole || null,
    onboarding_complete: true,
  };

  // ------------------------------------------------------------
  // Update existing profile
  // ------------------------------------------------------------

  if (profileExists) {
    const byId = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id);

    if (!byId.error) {
      return {
        success: true,
      };
    }

    console.warn(
      "[RapSheet] Update by id failed, trying user_id:",
      byId.error,
    );

    const byUserId = await supabase
      .from("profiles")
      .update(patch)
      .eq("user_id", user.id);

    if (!byUserId.error) {
      return {
        success: true,
      };
    }

    console.error(
      "[RapSheet] Profile update failed:",
      byUserId.error,
    );

    throw new Error(
      byUserId.error.message ||
        "Unable to save your Rap Sheet.",
    );
  }

  // ------------------------------------------------------------
  // No profile exists — create it
  // ------------------------------------------------------------

  const insertById = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      ...patch,
    });

  if (!insertById.error) {
    return {
      success: true,
    };
  }

  console.warn(
    "[RapSheet] Insert by id failed, trying user_id:",
    insertById.error,
  );

  const insertByUserId = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      ...patch,
    });

  if (!insertByUserId.error) {
    return {
      success: true,
    };
  }

  console.error(
    "[RapSheet] Profile insert failed:",
    insertByUserId.error,
  );

  throw new Error(
    insertByUserId.error.message ||
      "Unable to create your Rap Sheet.",
  );
}