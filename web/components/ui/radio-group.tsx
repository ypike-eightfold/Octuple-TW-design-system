import type * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * RadioGroup — Octuple v2.5
 * Source: Octuple svg files/Radio ✅.svg
 *
 * States (from SVG circles):
 *   Unchecked default : white fill, #4F5666 (grey-60) stroke, no inner dot
 *   Hover             : #EBFDFF (blue-green-10) fill, #146DA6 (blue-70) stroke
 *   Pressed/active    : #B0F3FE (blue-green-20) fill, #146DA6 stroke
 *   Checked           : #146DA6 fill, #146DA6 stroke, white inner dot
 *   Disabled          : opacity 0.5
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid w-full gap-3", className)}
      data-slot="radio-group"
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Base layout
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full outline-none",
        // Extended hit area
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        // Default — white bg, grey border
        "border border-[#4F5666] bg-white transition-colors",
        // Hover — light teal bg, blue border
        "hover:border-[#146DA6] hover:bg-[#EBFDFF]",
        // Pressed/active — medium teal bg
        "active:bg-[#B0F3FE] active:border-[#146DA6]",
        // Focus ring
        "focus-visible:border-[#146DA6] focus-visible:ring-2 focus-visible:ring-[#146DA6]/30",
        // Checked — teal bg (#B0F3FE), blue border (#146DA6)
        "data-[state=checked]:border-[#146DA6] data-[state=checked]:bg-[#B0F3FE]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className="flex size-4 items-center justify-center"
        data-slot="radio-group-indicator"
      >
        {/* Blue inner dot (#146DA6) — centered in the 16×16 circle */}
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#146DA6]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
