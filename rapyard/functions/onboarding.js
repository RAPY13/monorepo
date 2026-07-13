export async function onRequestPost(context) {
  const body = await context.request.json();
  const event = body.type;
  const user = body.record;

  const supabaseUrl = context.env.SUPABASE_URL;
  const serviceKey = context.env.SUPABASE_SERVICE_ROLE_KEY;

  const headers = {
    "apikey": serviceKey,
    "Authorization": `Bearer ${serviceKey}`,
    "Content-Type": "application/json"
  };

  async function updateUserMetadata(id, metadata) {
    return await fetch(`${supabaseUrl}/rest/v1/auth.users?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(metadata)
    });
  }

  async function getFounderCount() {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/auth.users?user_metadata->>role=eq.founder`,
      { headers }
    );
    const founders = await res.json();
    return founders.length;
  }

  // -----------------------------
  // FLOW LOGIC
  // -----------------------------

  // 1. User signed up → CreateAccount
  if (event === "auth.user_signed_up") {
    await updateUserMetadata(user.id, {
      user_metadata: {
        role: "member",
        flow_stage: "CreateAccount"
      }
    });
  }

  // 2. Email verified → FounderBadge or ProfileCreated
  if (event === "auth.user_confirmed") {
    const founderCount = await getFounderCount();

    if (founderCount < 500) {
      await updateUserMetadata(user.id, {
        user_metadata: {
          role: "founder",
          flow_stage: "FounderBadge"
        }
      });
    } else {
      await updateUserMetadata(user.id, {
        user_metadata: {
          role: "member",
          flow_stage: "ProfileCreated"
        }
      });
    }
  }

  // 3. User logged in → PickYourLane
  if (event === "auth.user_signed_in") {
    await updateUserMetadata(user.id, {
      user_metadata: {
        flow_stage: "PickYourLane"
      }
    });
  }

  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" }
  });
}
