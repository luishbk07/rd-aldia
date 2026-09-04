import type { ReactNode } from "react";

export function relativeUpdateLabel(updatedAt: string | number | Date): string;
export function clockUpdateLabel(
  updatedAt: string | number | Date,
  style?: "auto" | "time" | "date",
): string | null;

export default function DataStatusBadge(props: {
  source?: "live" | "cached";
  updatedAt?: string | number | Date;
  lastUpdated?: string | number | Date;
  clock?: "auto" | "time" | "date";
  showClock?: boolean;
  className?: string;
  tone?: "light" | "dark";
}): ReactNode;
