'use client'

import NextLink from 'next/link'
import { useMemo, useState } from 'react'
import { Button, Tag } from '@tonyh-2-eightfold/ef-design-system'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { usePrototype } from '../_lib/PrototypeContext'
import { MOCK_DATA } from '../_lib/mock-data'
import type {
  ActionItem,
  IntegrationItem,
  SyncSubjectId,
} from '../_lib/types'

export interface MeetingCanvasProps {
  subjectId: SyncSubjectId
}

export function MeetingCanvas({ subjectId }: MeetingCanvasProps) {
  const { dataState } = usePrototype()
  const subject = MOCK_DATA.syncSubjects[subjectId]

  if (dataState === 'loading') return <CanvasSkeleton />
  if (dataState === 'error') return <CanvasError />
  if (dataState === 'empty') return <CanvasEmpty />

  return (
    <main className="mx-auto max-w-7xl px-6 pb-8 pt-4">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <NotesPane counterpartFirst={subject.counterpartName.split(' ')[0]} />
          <ActionItemsTracker subjectId={subjectId} />
        </div>
        <RecentActivityPane />
      </div>
    </main>
  )
}

function NotesPane({ counterpartFirst }: { counterpartFirst: string }) {
  const { persona } = usePrototype()
  const { agendaItems } = usePrototype()
  const [showPrivate, setShowPrivate] = useState(false)
  const [sharedNotes, setSharedNotes] = useState(
    'Talking points:\n• OAuth2 refresh — production rollout plan\n• PLAT-902 dependency on IDP team\n• Q3 mentorship pairing\n'
  )
  const [privateNotes, setPrivateNotes] = useState(
    persona === 'sam'
      ? 'Manager-only context:\n• Alex is ready for a staff-track conversation soon — bring up in calibration.\n• Watch for burnout signs after the auth migration ship.'
      : 'Private thoughts (only you see this):\n• Want to push back on the Q3 scope add — feels rushed.'
  )

  return (
    <section
      aria-label="Notes"
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {showPrivate ? 'Private notes' : 'Shared notes'}
          </h2>
          {showPrivate && (
            <Tag
              size="24"
              color="orange"
              leadingIcon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 12 }}
                  aria-hidden
                >
                  lock
                </span>
              }
            >
              Only you
            </Tag>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <span>Shared</span>
          <Switch
            checked={showPrivate}
            onCheckedChange={setShowPrivate}
            size="sm"
            aria-label="Toggle private notes"
          />
          <span>Private</span>
        </label>
      </div>

      {agendaItems.length > 0 && !showPrivate && (
        <div className="mb-3 rounded-md border border-dashed border-primary/30 bg-primary/5 p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            From your agenda
          </div>
          <ul className="space-y-0.5 text-sm text-foreground">
            {agendaItems.map((a, i) => (
              <li key={i}>• {a}</li>
            ))}
          </ul>
        </div>
      )}

      <textarea
        value={showPrivate ? privateNotes : sharedNotes}
        onChange={(e) =>
          showPrivate ? setPrivateNotes(e.target.value) : setSharedNotes(e.target.value)
        }
        rows={10}
        className="w-full resize-y rounded-md border border-input bg-background p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Start typing your notes…"
      />

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Autosaved · last edit just now</span>
        {!showPrivate && (
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            Visible to both you and {counterpartFirst}
          </span>
        )}
      </div>
    </section>
  )
}

function ActionItemsTracker({ subjectId }: { subjectId: SyncSubjectId }) {
  const {
    persona,
    checkedActionItems,
    toggleActionItem,
    generatedActionItems,
    generateActionItems,
    isGeneratingActionItems,
  } = usePrototype()

  /* Manager unblocking lane appears only when Sam is viewing a report's sync. */
  const showUnblocking = persona === 'sam' && subjectId.startsWith('sam-with-') && subjectId !== 'sam-with-pat'

  const carryOver = useMemo<ActionItem[]>(() => {
    const lastMeeting = MOCK_DATA.pastMeetings[0]
    const earlier = MOCK_DATA.pastMeetings.slice(1, 3)
    const ownItems = lastMeeting.actionItems
      .filter((a) => a.owner === persona)
      .map((a) => ({ ...a, carriedOver: true }))
    const unblocking = showUnblocking
      ? earlier
          .flatMap((m) => m.actionItems)
          .filter((a) => a.owner === 'sam' && a.unblocking)
          .map((a) => ({ ...a, carriedOver: true }))
      : []
    return [...ownItems, ...unblocking]
  }, [persona, showUnblocking])

  const items = [...carryOver, ...generatedActionItems]
  const unblockingItems = items.filter((a) => a.unblocking)
  const regularItems = items.filter((a) => !a.unblocking)

  return (
    <section
      aria-label="Action items"
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Action items</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={generateActionItems}
          disabled={isGeneratingActionItems}
          leadingIcon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14 }}
              aria-hidden
            >
              {isGeneratingActionItems ? 'autorenew' : 'auto_awesome'}
            </span>
          }
        >
          {isGeneratingActionItems ? 'Generating…' : 'Generate action items'}
        </Button>
      </div>

      {regularItems.length === 0 && unblockingItems.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-background p-3 text-xs text-muted-foreground">
          No carry-over items. Use AI to suggest some based on this week&rsquo;s notes
          and recent activity.
        </p>
      ) : (
        <>
          {regularItems.length > 0 && (
            <ul className="mb-3 space-y-1">
              {regularItems.map((a) => (
                <ActionItemRow
                  key={a.id}
                  item={a}
                  checked={checkedActionItems.has(a.id)}
                  onToggle={() => toggleActionItem(a.id)}
                />
              ))}
            </ul>
          )}

          {showUnblocking && unblockingItems.length > 0 && (
            <div className="rounded-md bg-warning/5 p-3">
              <div className="mb-2">
                <Tag
                  size="24"
                  color="orange"
                  leadingIcon={
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 12 }}
                      aria-hidden
                    >
                      flag
                    </span>
                  }
                >
                  Unblocking
                </Tag>
              </div>
              <ul className="space-y-1">
                {unblockingItems.map((a) => (
                  <ActionItemRow
                    key={a.id}
                    item={a}
                    checked={checkedActionItems.has(a.id)}
                    onToggle={() => toggleActionItem(a.id)}
                  />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function ActionItemRow({
  item,
  checked,
  onToggle,
}: {
  item: ActionItem
  checked: boolean
  onToggle: () => void
}) {
  return (
    <li className="flex items-start gap-3 rounded-md bg-background px-3 py-2">
      <Checkbox
        id={`ai-${item.id}`}
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <label
        htmlFor={`ai-${item.id}`}
        className={
          'flex-1 cursor-pointer text-sm ' +
          (checked ? 'text-muted-foreground line-through' : 'text-foreground')
        }
      >
        {item.label}
      </label>
      {item.carriedOver && (
        <Tag size="24" color="grey">
          Carried over
        </Tag>
      )}
    </li>
  )
}

const ACTIVITY_META: Record<
  IntegrationItem['type'],
  { icon: string; bg: string; fg: string; label: string }
> = {
  Jira: { icon: 'task_alt', bg: 'bg-info/10', fg: 'text-info', label: 'Jira' },
  GitHub: { icon: 'code', bg: 'bg-foreground/5', fg: 'text-foreground', label: 'GitHub' },
  Slack: { icon: 'chat', bg: 'bg-warning/10', fg: 'text-warning', label: 'Slack' },
}

const STATUS_TAG_COLOR: Record<
  IntegrationItem['status'],
  'green' | 'blue' | 'orange' | 'grey'
> = {
  Merged: 'green',
  'In Progress': 'blue',
  Open: 'orange',
  Closed: 'grey',
  Active: 'orange',
}

function RecentActivityPane() {
  const { isPullingPRs, pullRecentPRs, pulledPRsHighlighted } = usePrototype()
  const items = MOCK_DATA.recentActivity

  return (
    <aside
      aria-label="Recent activity"
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Recent activity</h2>
          <p className="text-[11px] text-muted-foreground">Last 7 days</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={pullRecentPRs}
          disabled={isPullingPRs}
          leadingIcon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14 }}
              aria-hidden
            >
              {isPullingPRs ? 'autorenew' : 'sync'}
            </span>
          }
        >
          {isPullingPRs ? 'Pulling…' : 'Pull recent PRs'}
        </Button>
      </div>

      <ul
        className={
          'space-y-2 rounded-lg transition-colors ' +
          (pulledPRsHighlighted ? 'bg-primary/5 outline outline-1 outline-primary/30' : '')
        }
      >
        {items.map((it) => {
          const meta = ACTIVITY_META[it.type]
          return (
            <li
              key={it.id}
              className="flex items-start gap-3 rounded-lg bg-background p-3"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${meta.bg} ${meta.fg}`}
                aria-hidden
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {meta.icon}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {meta.label}
                  </span>
                  <Tag size="24" color={STATUS_TAG_COLOR[it.status]}>
                    {it.status}
                  </Tag>
                </div>
                <div className="mt-1 text-sm text-foreground">{it.item}</div>
                <div className="text-[11px] text-muted-foreground">
                  {new Date(it.updatedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZone: 'UTC',
                  })}
                </div>
              </div>
              <Button variant="secondary" size="icon-xs" aria-label="Pin to notes">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  push_pin
                </span>
              </Button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

function CanvasSkeleton() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-6 pb-8 pt-4">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="h-72 rounded-xl bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
        </div>
        <div className="h-96 rounded-xl bg-muted" />
      </div>
    </main>
  )
}

function CanvasError() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <span
        className="material-symbols-outlined mx-auto block text-destructive"
        style={{ fontSize: 56 }}
        aria-hidden
      >
        cloud_off
      </span>
      <h2 className="mt-3 text-xl font-semibold text-foreground">
        Couldn&rsquo;t load the canvas
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We can&rsquo;t reach your notes right now. Your last autosave is safe — retry
        when you&rsquo;re back online.
      </p>
      <Button variant="primary" className="mt-5">
        Retry
      </Button>
    </main>
  )
}

function CanvasEmpty() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <span
        className="material-symbols-outlined mx-auto block text-muted-foreground"
        style={{ fontSize: 56 }}
        aria-hidden
      >
        edit_note
      </span>
      <h2 className="mt-3 text-xl font-semibold text-foreground">
        Nothing on the agenda yet
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Add a talking point to start. We&rsquo;ll pull in recent PRs and tickets so
        the conversation has context.
      </p>
      <Button asChild variant="primary" className="mt-5">
        <NextLink href="/careerhub/team/sync">Go back to sync</NextLink>
      </Button>
    </main>
  )
}
