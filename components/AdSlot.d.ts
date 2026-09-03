import type { ReactNode } from "react";

export default function AdSlot(props: {
  size?: string;
  position?: string;
  fallbackContent?: ReactNode;
  lazy?: boolean;
  className?: string;
}): ReactNode;
