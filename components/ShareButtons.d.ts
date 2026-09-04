import type { ReactNode } from "react";

export default function ShareButtons(props: {
  title?: string;
  path?: string;
  url?: string;
  hash?: string;
  label?: string;
  variant?: "inline" | "floating" | "both";
  compact?: boolean;
  className?: string;
}): ReactNode;
