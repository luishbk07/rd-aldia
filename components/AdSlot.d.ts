import type { ReactNode } from "react";

export default function AdSlot(props: {
  slotId?: string;
  format?: string;
  layout?: string;
  size?: string;
  position?: string;
  fallbackContent?: ReactNode;
  lazy?: boolean;
  className?: string;
}): ReactNode;
