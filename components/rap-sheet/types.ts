export interface RapSheetData {
  // Identity
  rapName: string;
  username: string;
  avatarUrl?: string;

  // Profile
  bio: string;
  city: string;

  // Music
  genres: string[];

  // Creator
  primaryRole:
    | "listener"
    | "artist"
    | "producer"
    | "engineer"
    | "";
}