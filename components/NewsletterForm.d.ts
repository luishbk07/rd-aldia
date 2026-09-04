import type { ReactNode } from "react";

export function markNewsletterSubscribed(): void;
export function hasNewsletterSubscription(): boolean;

export default function NewsletterForm(props: {
  variant?: "default" | "footer";
  id?: string;
  onSuccess?: () => void;
}): ReactNode;
