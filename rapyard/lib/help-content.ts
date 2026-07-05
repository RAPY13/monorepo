import type { YardRole } from "@/lib/onboarding-profile";

export type HelpCategory =
  | "Getting Started"
  | "Licensing"
  | "Battles"
  | "Studio"
  | "Marketplace"
  | "Royalties"
  | "Account & Privacy";

export type HelpArticle = {
  id: string;
  category: HelpCategory;
  title: string;
  content: string;
  roles?: YardRole[];
  tenants?: string[];
  tags?: string[];
};

export const HELP_CATEGORIES: HelpCategory[] = [
  "Getting Started",
  "Licensing",
  "Battles",
  "Studio",
  "Marketplace",
  "Royalties",
  "Account & Privacy",
];

export const BASE_HELP_ARTICLES: HelpArticle[] = [
  {
    id: "start-role-tenant",
    category: "Getting Started",
    title: "How do I complete onboarding?",
    content:
      "After sign-in, complete Gate, choose your role, then create or join a tenant. Once onboarding is complete, you will land in your tenant dashboard.",
    tags: ["onboarding", "tenant", "role"],
  },
  {
    id: "start-switch-role",
    category: "Getting Started",
    title: "Can I change my role later?",
    content:
      "Yes. Role changes are supported from profile settings and may affect which tools appear in Studio and Marketplace modules.",
    tags: ["role", "settings"],
  },
  {
    id: "licensing-beat-rights",
    category: "Licensing",
    title: "What rights come with a beat license?",
    content:
      "License terms vary by listing. Non-exclusive licenses allow multiple buyers; exclusive licenses reserve usage rights for one buyer under the listing agreement.",
    roles: ["producer", "rapper"],
    tags: ["license", "beats"],
  },
  {
    id: "licensing-dispute",
    category: "Licensing",
    title: "How do I report a licensing dispute?",
    content:
      "Open a support ticket from Help Center with links to the listing, transaction ID, and usage context. The moderation team reviews disputes in priority order.",
    tags: ["license", "dispute", "support"],
  },
  {
    id: "battles-enter",
    category: "Battles",
    title: "How do I enter a battle?",
    content:
      "Go to Battles, pick an open challenge, upload your round, and confirm submission before the lock timer ends.",
    roles: ["rapper", "producer"],
    tags: ["battles", "submission"],
  },
  {
    id: "battles-voting",
    category: "Battles",
    title: "How does battle voting work?",
    content:
      "Listeners vote during the active window. Weighted anti-spam protections and moderation checks are applied before final tallies.",
    tags: ["battles", "voting", "listener"],
  },
  {
    id: "studio-upload",
    category: "Studio",
    title: "How do I upload a new draft or beat?",
    content:
      "Open Studio and choose Upload. Add title, BPM or key metadata, and visibility settings before publishing.",
    roles: ["rapper", "producer"],
    tags: ["studio", "upload"],
  },
  {
    id: "studio-collab",
    category: "Studio",
    title: "Can I collaborate with other tenants?",
    content:
      "Cross-tenant collaborations are allowed if both sides approve and the collaboration includes clear split settings.",
    tags: ["studio", "collaboration", "tenants"],
  },
  {
    id: "marketplace-sell",
    category: "Marketplace",
    title: "How do I list beats in Marketplace?",
    content:
      "From Marketplace, create a listing with preview audio, pricing, license terms, and attribution requirements.",
    roles: ["producer"],
    tags: ["marketplace", "listing", "producer"],
  },
  {
    id: "marketplace-buy",
    category: "Marketplace",
    title: "How do I buy and download licensed assets?",
    content:
      "After purchase confirmation, downloads and license records appear in your account history and royalties panel.",
    roles: ["rapper", "listener"],
    tags: ["marketplace", "purchase"],
  },
  {
    id: "royalties-calc",
    category: "Royalties",
    title: "How are royalties calculated?",
    content:
      "Royalties are calculated based on configured splits, qualified activity, and payout thresholds. Statements are visible per period.",
    tags: ["royalties", "splits", "statements"],
  },
  {
    id: "royalties-delay",
    category: "Royalties",
    title: "Why is my payout pending?",
    content:
      "Payouts may be pending while anti-fraud checks, threshold verification, or payment provider settlement windows are in progress.",
    tags: ["royalties", "payout"],
  },
  {
    id: "privacy-email",
    category: "Account & Privacy",
    title: "Is my email public in RapYard?",
    content:
      "No. Email remains private and is used for authentication and support contact only. Username is public identity.",
    tags: ["privacy", "email"],
  },
  {
    id: "account-delete",
    category: "Account & Privacy",
    title: "How do I request account deletion?",
    content:
      "Submit a support request with category Account & Privacy. Compliance workflows process deletion and data retention requirements.",
    tags: ["privacy", "account", "deletion"],
  },
  {
    id: "tenant-bleedtha-block",
    category: "Getting Started",
    title: "Bleed Tha Block: onboarding playbook",
    content:
      "Bleed Tha Block tenants should configure battle cadence first, then studio templates and split presets for consistent drops.",
    tenants: ["bleed-tha-block"],
    tags: ["tenant", "bleed-tha-block"],
  },
  {
    id: "tenant-yard-lords",
    category: "Getting Started",
    title: "Yard Lords: launch checklist",
    content:
      "Yard Lords teams should assign moderator roles, publish house rules, and set marketplace quality standards before opening public entries.",
    tenants: ["yard-lords"],
    tags: ["tenant", "yard-lords"],
  },
  {
    id: "tenant-southside-syndicate",
    category: "Getting Started",
    title: "Southside Syndicate: studio standards",
    content:
      "Southside Syndicate should enable versioned drafts, release windows, and split templates for collab-heavy production cycles.",
    tenants: ["southside-syndicate"],
    tags: ["tenant", "southside-syndicate"],
  },
];
