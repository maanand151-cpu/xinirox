export type VentureStatus = "active" | "beta" | "under_development" | "paused" | "archived";

export const VENTURE_STATUSES: VentureStatus[] = [
  "active",
  "beta",
  "under_development",
  "paused",
  "archived",
];

export const ventureStatusMeta: Record<VentureStatus, {
  label: string;
  badgeClass: string;
  dotClass: string;
  ctaLabel: string;
  ctaDisabled: boolean;
  hideFromShowcase: boolean;
  description: string;
}> = {
  active: {
    label: "Active",
    badgeClass: "bg-green-500/15 text-green-400 border-green-500/30",
    dotClass: "bg-green-500",
    ctaLabel: "Visit",
    ctaDisabled: false,
    hideFromShowcase: false,
    description: "Fully operational",
  },
  beta: {
    label: "Beta",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    dotClass: "bg-blue-500",
    ctaLabel: "Try Beta",
    ctaDisabled: false,
    hideFromShowcase: false,
    description: "Experimental — usable",
  },
  under_development: {
    label: "Under Development",
    badgeClass: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    dotClass: "bg-yellow-500",
    ctaLabel: "Coming Soon",
    ctaDisabled: true,
    hideFromShowcase: false,
    description: "Still being built",
  },
  paused: {
    label: "Paused",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30",
    dotClass: "bg-red-500",
    ctaLabel: "Temporarily Unavailable",
    ctaDisabled: true,
    hideFromShowcase: false,
    description: "Temporarily inactive",
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
    ctaLabel: "Archived",
    ctaDisabled: true,
    hideFromShowcase: true,
    description: "Historical / inactive",
  },
};

export const getVentureStatus = (s: string | null | undefined): VentureStatus => {
  if (s && (VENTURE_STATUSES as string[]).includes(s)) return s as VentureStatus;
  return "active";
};
