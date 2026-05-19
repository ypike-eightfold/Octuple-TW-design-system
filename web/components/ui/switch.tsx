"use client"

import type * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Switch (Toggle) — Octuple v2.5
 * Source: Octuple svg files/Toggle (switch) ✅.svg
 *
 * Track states (from SVG rects, w×h):
 *   Default size  : 42×22 (outer frame), 38×18 inner track
 *   Small size    : 30.25×14.25 track
 *
 *   OFF default   : white bg, #4F5666 (grey-60) border, grey thumb #4F5666
 *   ON  default   : #B0F3FE (blue-green-20) bg, #146DA6 (blue-70) border, blue thumb #146DA6
 *   Hover any     : #EBFDFF (blue-green-10) bg, #146DA6 border
 *   Focus ring    : #146DA6/30
 *   Disabled      : opacity 0.5
 *
 * Thumb travel (translate-x):
 *   OFF → ON : translate-x-[2px] → translate-x-[22px]  (both sizes)
 */
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-size={size}
      data-slot="switch"
      className={cn(
        // Base layout
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full",
        "border transition-all outline-none cursor-pointer",
        // Extended hit area
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        // Sizes
        "data-[size=default]:h-[22px] data-[size=default]:w-[42px]",
        "data-[size=sm]:h-[18px] data-[size=sm]:w-[38px]",
        // OFF state — white bg, grey border
        "data-[state=unchecked]:bg-white data-[state=unchecked]:border-[#4F5666]",
        // ON state — teal bg, blue border
        "data-[state=checked]:bg-[#B0F3FE] data-[state=checked]:border-[#146DA6]",
        // Hover (both states) → light teal + blue border
        "hover:bg-[#EBFDFF] hover:border-[#146DA6]",
        // Focus ring
        "focus-visible:ring-[3px] focus-visible:ring-[#146DA6]/30",
        // Invalid
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        // Disabled
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full transition-transform",
          // Sizes
          "group-data-[size=default]/switch:size-[18px]",
          "group-data-[size=sm]/switch:size-[14px]",
          // Thumb travel — OFF: left edge (+2px), ON: right edge (+22px)
          "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-[2px]",
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-[22px]",
          "group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-[2px]",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[22px]",
          // Thumb colors — grey when OFF, blue when ON
          "data-[state=unchecked]:bg-[#4F5666]",
          "data-[state=checked]:bg-[#146DA6]",
        )}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
