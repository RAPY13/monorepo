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
    throw new Error(
      "Your bio must be 300 characters or less.",
    );
  }

  const genres = Array.isArray(input.genres)
    ? input.genres.filter(
        (genre): genre is string =>
          typeof genre === "string" &&
          genre.trim().length > 0,
      )
    : [];

  // ------------------------------------------------------------
  // Avatar
  //
  // Browser blob URLs are temporary and cannot be stored
  // as permanent avatar URLs.
  // ------------------------------------------------------------

  const avatarUrl =
    input.avatarUrl &&
    !input.avatarUrl.startsWith("blob:")
      ? input.avatarUrl
      : null;

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
  // Find existing profile
  // ------------------------------------------------------------

  const {
    data: existingById,
    error: lookupByIdError,
  } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupByIdError) {
    console.error(
      "[RapSheet] Profile lookup by id failed:",
      lookupByIdError,
    );
  }

  let profileExists = Boolean(existingById);

  // Some schema versions use user_id instead of id.
  if (!profileExists) {
    const {
      data: existingByUserId,
      error: lookupByUserIdError,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupByUserIdError) {
      console.error(
        "[RapSheet] Profile lookup by user_id failed:",
        lookupByUserIdError,
      );
    }

    profileExists = Boolean(existingByUserId);
  }

  // ------------------------------------------------------------
  // Save profiles
  // ------------------------------------------------------------

  if (profileExists) {
    const byId = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id);

    if (!byId.error) {
      await syncCreatorProfile({
        userId: user.id,
        rapName,
        avatarUrl,
        bio,
      });

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
      await syncCreatorProfile({
        userId: user.id,
        rapName,
        avatarUrl,
        bio,
      });

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
    await syncCreatorProfile({
      userId: user.id,
      rapName,
      avatarUrl,
      bio,
    });

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
    await syncCreatorProfile({
      userId: user.id,
      rapName,
      avatarUrl,
      bio,
    });

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

// ============================================================
// Sync creator_profiles
// ============================================================

async function syncCreatorProfile({
  userId,
  rapName,
  avatarUrl,
  bio,
}: {
  userId: string;
  rapName: string;
  avatarUrl: string | null;
  bio: string;
}) {
  const supabase = await createClient();

  const {
    data: existingCreatorProfile,
    error: lookupError,
  } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (lookupError) {
    console.error(
      "[RapSheet] Creator profile lookup failed:",
      lookupError,
    );

    throw new Error(
      lookupError.message ||
        "Unable to load creator profile.",
    );
  }

  // ------------------------------------------------------------
  // Existing creator profile
  // ------------------------------------------------------------

  if (existingCreatorProfile) {
    const { error } = await supabase
      .from("creator_profiles")
      .update({
        stage_name: rapName,
        avatar_url: avatarUrl,
        bio: bio || null,
      })
      .eq("user_id", userId);

    if (error) {
      console.error(
        "[RapSheet] Creator profile sync failed:",
        error,
      );

      throw new Error(
        error.message ||
          "Unable to update creator profile.",
      );
    }

    return;
  }

  // ------------------------------------------------------------
  // Create creator profile
  // ------------------------------------------------------------

  const { error } = await supabase
    .from("creator_profiles")
    .insert({
      user_id: userId,
      stage_name: rapName,
      avatar_url: avatarUrl,
      bio: bio || null,
      stats: {
        battles: 0,
        wins: 0,
        losses: 0,
        tapes: 0,
      },
    });

  if (error) {
    console.error(
      "[RapSheet] Creator profile creation failed:",
      error,
    );

    throw new Error(
      error.message ||
        "Unable to create creator profile.",
    );
  }
}