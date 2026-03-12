import "./globals.css";
import type { ReactNode } from "react";

/**
 * Root layout: minimal shell.
 * html / body / lang attribute are rendered in src/app/[lang]/layout.tsx
 * so that the lang attribute can be set dynamically per locale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children as React.ReactElement;
}
