"use client";

import type { ComponentProps } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Thin client wrapper so the server-rendered layout.tsx can still mount
 *  the (client-only) next-themes provider. Props are pass-through. */
export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
