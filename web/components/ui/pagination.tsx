import type * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

/**
 * Pagination — Octuple v2.5
 * SVG spec:
 *   Large  44×44 rx=8 | Medium 36×36 rx=6 | Small 28×28 rx=4
 *   Default bg #F6F7F8 | Hover bg #EBFDFF | Active/selected bg #B0F3FE border #1999AC
 */

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      data-slot="pagination"
      role="navigation"
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex items-center gap-1", className)}
      data-slot="pagination-content"
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  /** @default 'lg' */
  size?: "sm" | "md" | "lg"
} & React.ComponentProps<"a">

const SIZES = {
  lg: "size-11 rounded-[8px] text-sm",
  md: "size-9 rounded-[6px] text-sm",
  sm: "size-7 rounded-[4px] text-xs",
}

function PaginationLink({
  className,
  isActive,
  size = "lg",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      data-slot="pagination-link"
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none",
        SIZES[size],
        isActive
          ? "bg-[#B0F3FE] text-[#054D7B] ring-1 ring-[#1999AC]"
          : "bg-[#F6F7F8] text-[#1A212E] hover:bg-[#EBFDFF]",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  size = "lg",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size={size}
      className={cn("gap-1 px-3", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  size = "lg",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size={size}
      className={cn("gap-1 px-3", className)}
      {...props}
    >
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-11 items-center justify-center text-[#69717F] [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
