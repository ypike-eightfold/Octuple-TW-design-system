import type * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

/**
 * Checkbox — Octuple v2.5
 * Source: Octuple svg files/Checkbox ✅.svg
 *
 * States (from SVG):
 *   Unchecked default : white bg, #69717F (grey-60) border
 *   Hover             : #EBFDFF (blue-green-10) bg, #146DA6 (blue-70) border
 *   Pressed/active    : #B0F3FE (blue-green-20) bg, #146DA6 border
 *   Checked           : #146DA6 bg, #146DA6 border, white checkmark
 *   Disabled          : opacity 0.5
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base layout
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[3px] outline-none",
        // Extended hit area
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        // Default state — white bg, grey border
        "border border-[#69717F] bg-white transition-colors",
        // Hover — light teal bg, blue border
        "hover:border-[#146DA6] hover:bg-[#EBFDFF]",
        // Pressed — medium teal bg
        "active:bg-[#B0F3FE] active:border-[#146DA6]",
        // Focus ring
        "focus-visible:border-[#146DA6] focus-visible:bg-[#EBFDFF] focus-visible:ring-[3px] focus-visible:ring-[#146DA6]/30",
        // Checked — teal bg (#B0F3FE), blue border + blue checkmark (#146DA6)
        "data-[state=checked]:border-[#146DA6] data-[state=checked]:bg-[#B0F3FE] data-[state=checked]:text-[#146DA6]",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50",
        // Invalid
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
        data-slot="checkbox-indicator"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
