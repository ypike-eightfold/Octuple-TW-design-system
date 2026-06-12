/* Small date/number helpers used across the prototype screens.
   Kept dependency-free — no date-fns import — so the prototype stays
   light. */

/* timeZone is pinned to UTC: the mock timestamps are fixed, and without
   it the server (UTC on Vercel) and the browser (user's zone) format
   different text — a React hydration mismatch (error #418). */

export function formatDateLong(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
}

export function formatRelativeFromNow(iso: string, now: Date = new Date('2026-05-22T12:00:00Z')): string {
  const then = new Date(iso)
  const diffMs = then.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'tomorrow'
  if (diffDays === -1) return 'yesterday'
  if (diffDays > 0 && diffDays < 7) return `in ${diffDays} days`
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`
  return formatDateLong(iso)
}
