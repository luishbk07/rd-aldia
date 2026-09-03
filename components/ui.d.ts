import type { ButtonHTMLAttributes, ReactNode } from "react";

export const ui: {
  card: string;
  cardAccent: string;
  sectionTitle: string;
  sectionEyebrow: string;
  sectionRule: string;
  button: Record<string, string>;
  badge: Record<string, string>;
};

export function Card(props: {
  children: ReactNode;
  href?: string;
  className?: string;
  [key: string]: unknown;
}): ReactNode;

export function SectionTitle(props: {
  children: ReactNode;
  eyebrow?: string;
  as?: string;
  className?: string;
}): ReactNode;

export function Button(
  props: {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline" | string;
    href?: string;
    className?: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  } & Record<string, unknown>,
): ReactNode;

export function Badge(props: {
  children: ReactNode;
  tone?: string;
  className?: string;
}): ReactNode;

export function ThemeToggle(props: { className?: string }): ReactNode;
