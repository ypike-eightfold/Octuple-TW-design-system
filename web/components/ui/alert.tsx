/**
 * @deprecated BLOCKED — do NOT use Alert in new code.
 *
 * Use `InfoBar` from `@/components/ef-design-system` instead.
 * InfoBar provides the same functionality with full Octuple DS styling.
 *
 * @example
 * // ✅ CORRECT
 * import { InfoBar } from '@/components/ef-design-system'
 * <InfoBar variant="info"    title="Note"    message="Your draft was saved." />
 * <InfoBar variant="warning" title="Warning" message="Deadline in 2 days." />
 * <InfoBar variant="error"   title="Error"   message="Submission failed." />
 * <InfoBar variant="success" title="Done"    message="Review submitted." />
 *
 * // ❌ WRONG — this shadcn Alert is blocked
 * import { Alert } from '@/components/ui/alert'
 */

// Re-export InfoBar under Alert names so any stray import gets
// a descriptive runtime error instead of a silent wrong render.
export function Alert(): never {
  throw new Error(
    '[Alert] This component is blocked. Import InfoBar from "@/components/ef-design-system" instead.'
  )
}

export function AlertTitle(): never {
  throw new Error(
    '[AlertTitle] Alert is blocked. Import InfoBar from "@/components/ef-design-system" instead.'
  )
}

export function AlertDescription(): never {
  throw new Error(
    '[AlertDescription] Alert is blocked. Import InfoBar from "@/components/ef-design-system" instead.'
  )
}

export function AlertAction(): never {
  throw new Error(
    '[AlertAction] Alert is blocked. Import InfoBar from "@/components/ef-design-system" instead.'
  )
}
