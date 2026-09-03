import type { ReactNode } from "react";

export default function WeatherSection(props: {
  variant?: "home" | "full";
  showHeading?: boolean;
  showMoreLink?: boolean;
}): ReactNode;
