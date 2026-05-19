/**
 * Input — primitive bare <input> element used by InputGroup, InputOTP, and
 * other shadcn composite components. NOT the same as the Octuple DS Input.
 *
 * For standalone form inputs use the Octuple DS component:
 *   import { Input } from '@/components/Input/Input'
 *
 * This file is the low-level primitive that composite components (InputGroup,
 * InputOTP, etc.) need — a plain <input> with the standard ring/border styling.
 */
import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
