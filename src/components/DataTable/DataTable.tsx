import * as React from 'react'
import { cn } from '@/lib/utils'

/* ─── DataTable (scroll wrapper + table) ─── */

function DataTable({
  className,
  bordered,
  children,
  ...props
}: React.ComponentProps<'table'> & {
  /** Wrap in a rounded border container */
  bordered?: boolean
}) {
  const table = (
    <div data-slot="data-table-scroll" className="relative w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <table
        data-slot="data-table"
        className={cn('w-full border-collapse text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
  if (!bordered) return table
  return (
    <div data-slot="data-table-bordered" className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
      {table}
    </div>
  )
}

/* ─── Header (thead) ─── */

function DataTableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="data-table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  )
}

/* ─── Body (tbody) ─── */

function DataTableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="data-table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

/* ─── Row (tr) ─── */

function DataTableRow({
  className,
  variant = 'default',
  onClick,
  ...props
}: React.ComponentProps<'tr'> & {
  variant?: 'default' | 'warn'
  onClick?: React.MouseEventHandler<HTMLTableRowElement>
}) {
  return (
    <tr
      data-slot="data-table-row"
      className={cn(
        'border-b border-[#f1f5f9] transition-colors',
        variant === 'warn' && '',
        onClick && 'cursor-pointer hover:bg-[#fafbff]',
        !onClick && 'hover:bg-muted/50',
        className,
      )}
      onClick={onClick}
      {...props}
    />
  )
}

/* ─── Head cell (th) ─── */

function DataTableHead({
  className,
  align,
  numeric,
  metric,
  shrink,
  sortable,
  sorted,
  onSort,
  children,
  ...props
}: React.ComponentProps<'th'> & {
  /** Column alignment. Defaults to 'left'; numeric columns default to 'right'. */
  align?: 'left' | 'right'
  /** Right-aligns header (shorthand for align="right") */
  numeric?: boolean
  /** Min-width for metric/progress bar columns */
  metric?: boolean
  /** Collapse width for action columns */
  shrink?: boolean
  /** Enables sort toggle on this column */
  sortable?: boolean
  /** Current sort direction, or false if unsorted */
  sorted?: 'asc' | 'desc' | false
  /** Called when the user clicks the sort toggle */
  onSort?: () => void
}) {
  const resolvedAlign = align ?? (numeric ? 'right' : 'left')
  const sortIcon = sorted === 'asc' ? 'arrow_upward' : sorted === 'desc' ? 'arrow_downward' : 'unfold_more'
  const ariaSort = sortable ? (sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none') : undefined
  return (
    <th
      data-slot="data-table-head"
      aria-sort={ariaSort}
      className={cn(
        'px-5 py-2.5 text-left font-[var(--typography-caption-semibold)] text-[color:#64748b] uppercase tracking-[0.05em] text-xs font-semibold bg-[#f8fafc] whitespace-nowrap',
        resolvedAlign === 'right' && 'text-right',
        metric && 'min-w-[108px]',
        shrink && 'w-[1%] pl-3 pr-5',
        sortable && 'cursor-pointer select-none',
        className,
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      {sortable ? (
        <span className="inline-flex items-center gap-1">
          {children}
          <span className="material-symbols-outlined" style={{ fontSize: 14, opacity: sorted ? 1 : 0.4 }}>{sortIcon}</span>
        </span>
      ) : children}
    </th>
  )
}

/* ─── Cell (td) ─── */

function DataTableCell({
  className,
  align = 'left',
  metric,
  numeric,
  ...props
}: React.ComponentProps<'td'> & {
  align?: 'left' | 'right'
  /** Min-width for metric/progress bar columns */
  metric?: boolean
  /** Tabular-nums for numeric values */
  numeric?: boolean
}) {
  return (
    <td
      data-slot="data-table-cell"
      className={cn(
        'px-5 py-3 align-middle whitespace-nowrap text-sm text-[#0f172a]',
        align === 'right' && 'text-right',
        metric && 'min-w-[108px]',
        numeric && 'tabular-nums',
        className,
      )}
      {...props}
    />
  )
}

export {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
}
