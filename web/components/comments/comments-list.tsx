"use client";

import { useState } from "react";
import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import type { ThreadData } from "@liveblocks/client";
import { Button } from "@tonyh-2-eightfold/ef-design-system";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { firstCommentText } from "./comment-layer";
import { displayNameFor } from "./identity";

/* The Comments control in the prototype toolbar. Clicking it opens a
 * popover listing every comment thread on the design (Figma-style),
 * plus a "Comment mode" switch that turns the click-to-add pin overlay
 * on/off. Clicking a comment card asks the parent to jump: navigate to
 * that comment's screen, restore the prototype's state (persona/flow),
 * and open the thread. */

function screenLabel(thread: ThreadData): string {
  const s = thread.metadata.screen;
  if (typeof s !== "string" || !s) return "This design";
  // Composite key is `<pathname+search>#<h1>` — prefer the h1 (the human
  // screen title); fall back to the last path segment.
  const hash = s.includes("#") ? s.split("#").slice(1).join("#").trim() : "";
  if (hash) return hash;
  const seg = s.split("#")[0].split("?")[0].split("/").filter(Boolean).pop();
  return seg ? seg.replace(/-/g, " ") : "Home";
}

function timeAgo(value: string | number | Date): string {
  const then = new Date(value).getTime();
  const days = (Date.now() - then) / 86_400_000;
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 14) return `${Math.floor(days)}d ago`;
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CommentsControl({
  commentsOn,
  onCommentsOnChange,
  onJump,
}: {
  commentsOn: boolean;
  onCommentsOnChange: (on: boolean) => void;
  /** Open a comment in context — parent navigates to its screen, restores
   *  prototype state, and opens the thread. */
  onJump: (thread: ThreadData) => void;
}) {
  // The trigger button needs the open-thread count, which needs the room
  // data — so the whole control lives behind a suspense boundary, with a
  // plain button as the fallback so the toolbar never shifts.
  return (
    <ClientSideSuspense
      fallback={
        <Button
          variant="secondary"
          size="sm"
          leadingIcon={
            <span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden>
              comment
            </span>
          }
        >
          Comments
        </Button>
      }
    >
      <CommentsControlInner
        commentsOn={commentsOn}
        onCommentsOnChange={onCommentsOnChange}
        onJump={onJump}
      />
    </ClientSideSuspense>
  );
}

function CommentsControlInner({
  commentsOn,
  onCommentsOnChange,
  onJump,
}: {
  commentsOn: boolean;
  onCommentsOnChange: (on: boolean) => void;
  onJump: (thread: ThreadData) => void;
}) {
  const { threads } = useThreads();
  const [open, setOpen] = useState(false);

  // Newest first; the badge counts only threads needing attention.
  const sorted = [...threads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const openCount = threads.filter((t) => !t.resolved).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={commentsOn ? "primary" : "secondary"}
          size="sm"
          aria-expanded={open}
          {...(openCount > 0 ? { badge: openCount } : {})}
          leadingIcon={
            <span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden>
              comment
            </span>
          }
        >
          Comments
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        {/* Header: title + comment-mode switch (the old toggle behavior). */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--foreground)]">Comments</div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--muted-foreground)]">
            Comment mode
            <Switch
              checked={commentsOn}
              onCheckedChange={onCommentsOnChange}
              aria-label="Comment mode — click the frame to add a comment"
            />
          </label>
        </div>

        {sorted.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No comments yet. Turn on <span className="font-medium">Comment mode</span> and click
            anywhere on the prototype to leave one.
          </div>
        ) : (
          <ul className="max-h-[420px] overflow-y-auto py-1">
            {sorted.map((thread) => {
              const author = displayNameFor(thread.comments[0]?.userId ?? "");
              const text = firstCommentText(thread) || "(no text)";
              const replies = Math.max(0, thread.comments.length - 1);
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onJump(thread);
                      setOpen(false);
                    }}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--muted)]/50 focus-visible:bg-[var(--muted)]/50 focus-visible:outline-none"
                  >
                    <span
                      aria-hidden
                      className={
                        "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full rounded-bl-none text-[10px] font-semibold text-white " +
                        (thread.resolved ? "bg-[#94a3b8]" : "bg-[#FF3366]")
                      }
                    >
                      {thread.resolved ? "✓" : ""}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-[var(--foreground)]">
                          {author}
                        </span>
                        <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                          {timeAgo(thread.createdAt)}
                        </span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-[var(--muted-foreground)]">
                        {text}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined" style={{ fontSize: 13 }} aria-hidden>
                            movie
                          </span>
                          {screenLabel(thread)}
                        </span>
                        {replies > 0 && (
                          <span aria-label={`${replies} ${replies === 1 ? "reply" : "replies"}`}>
                            · {replies} {replies === 1 ? "reply" : "replies"}
                          </span>
                        )}
                        {thread.resolved && <span>· resolved</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
