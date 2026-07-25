const baseUrl = process.env.VERIFY_BASE_URL || "https://rapyard.club";

const checks = [
  { path: "/", expected: 200 },
  { path: "/help", expected: 307, location: "/gate" },
  { path: "/role", expected: 307, location: "/gate" },
  { path: "/tenant", expected: 307, location: "/gate" },
  { path: "/feed", expected: 307, location: "/gate" },
  { path: "/profile", expected: 307, location: "/gate" },
  { path: "/api/waitlist", expected: 200 },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function checkRoute({ path, expected, location }) {
  const url = new URL(path, baseUrl);
  const response = await fetch(url, { redirect: "manual" });
  const actualLocation = response.headers.get("location");

  assert(
    response.status === expected,
    `${url.pathname}: expected ${expected}, got ${response.status}`
  );

  if (location) {
    assert(
      actualLocation === location,
      `${url.pathname}: expected redirect to ${location}, got ${actualLocation || "(none)"}`
    );
  }

  console.log(`${response.status} ${url.pathname}${actualLocation ? ` -> ${actualLocation}` : ""}`);
}

async function main() {
  console.log(`Verifying production at ${baseUrl}`);
  for (const check of checks) {
    await checkRoute(check);
  }
  console.log("Production verification passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
