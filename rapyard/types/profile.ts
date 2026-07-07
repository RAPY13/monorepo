export type ProfileRow = {
  username: string | null;
  avatar_url: string | null;
  badges: string[] | null;
};

export type OnboardingProfile = {
  username: string | null;
  avatar_url: string | null;
  badges: string[] | null;
  role: string | null;
  tenant: string | null;
};
