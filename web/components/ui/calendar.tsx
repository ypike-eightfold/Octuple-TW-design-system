/**
 * @deprecated BLOCKED — do NOT use Calendar in new code.
 *
 * Use `DateTimePicker` from `@/components/ef-design-system` instead.
 * DateTimePicker provides the same date-selection functionality with full
 * Octuple DS styling, theming support, and the correct visual spec.
 *
 * @example
 * // ✅ CORRECT
 * import { DateTimePicker } from '@/components/ef-design-system'
 * <DateTimePicker value={date} onChange={setDate} />
 * <DateTimePicker value={date} onChange={setDate} showTime />  // with time picker
 *
 * // ❌ WRONG — this shadcn Calendar is blocked
 * import { Calendar } from '@/components/ui/calendar'
 */

// Throw a descriptive runtime error so any stray import fails loudly.
export function Calendar(): never {
  throw new Error(
    '[Calendar] This component is blocked. Import DateTimePicker from "@/components/ef-design-system" instead.'
  )
}

export function CalendarDayButton(): never {
  throw new Error(
    '[CalendarDayButton] Calendar is blocked. Import DateTimePicker from "@/components/ef-design-system" instead.'
  )
}
