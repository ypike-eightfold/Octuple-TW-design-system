"use client";

import { Component, Fragment, useEffect, useState, type ReactNode } from 'react'
import { Menu, Palette, LayoutGrid, PanelTop, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Navbar,
  Header,
  HeaderGroup,
  HeaderTitle,
  HeaderToolbar,
  HeaderTextGroup,
  HeaderSecondary,
  ProductBackground,
} from '@tonyh-2-eightfold/ef-design-system'
import {
  EIGHTFOLD_LOGO_PATH,
  getNavbarProductConfig,
  PRIMARY_NAVBAR_PRODUCT_IDS,
  EMPLOYEE_NON_MANAGER_TABS,
  EMPLOYEE_AVATAR_MENU_ITEMS,
  MANAGER_TABS,
  CAREER_HUB_CHRO_TABS,
  CAREER_HUB_HRBP_TABS,
  TALENT_ACQUISITION_RECRUITER_TABS,
  TALENT_ACQUISITION_SEARCH_PLACEHOLDER,
  TALENT_ACQUISITION_ACTION_BUTTONS,
  SPACING_TOKENS,
  CORNER_RADIUS_TOKENS,
} from '@tonyh-2-eightfold/ef-design-system'

type PrimaryNavbarProductId = (typeof PRIMARY_NAVBAR_PRODUCT_IDS)[number]
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { UICatalog } from './UICatalog'

/** shadcn components shown in UICatalog; id slug used for scroll target */
const SHADCN_COMPONENTS = [
  'Accordion',
  'Alert',
  'Alert Dialog',
  'Aspect Ratio',
  'Avatar',
  'Breadcrumb',
  'Button',
  'Calendar',
  'Card',
  'Checkbox',
  'Chip',
  'Collapsible',
  'Context Menu',
  'DateTimePicker',
  'Dialog',
  'Dropdown Menu',
  'Empty',
  'FloatingActionButton',
  'Hover Card',
  'InfoBar',
  'Input',
  'Insight Cards',
  'Kbd',
  'MessageBar',
  'Navigation Menu',
  'Number Badge',
  'Object Cards',
  'Pagination',
  'Panel',
  'Popover',
  'Progress',
  'Radio Group',
  'Resizable',
  'Scroll Area',
  'SegmentedProgress',
  'Select',
  'Separator',
  'Sheet',
  'Skill Tag',
  'Skeleton',
  'Slider',
  'Snackbar',
  'Stat Card',
  'Stepper',
  'Switch',
  'Table',
  'Tabs',
  'Tag',
  'Textarea',
  'Timeline',
  'Toggle',
  'Toggle Group',
  'Tooltip',
  'Uploader',
] as const

function slug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

/** Token page section ids for sidebar and scroll targets */
const TOKEN_SECTIONS = [
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'corner-radius', label: 'Corner radius' },
  { id: 'colors', label: 'Colors' },
  { id: 'semantic-colors', label: 'Semantic colors' },
  { id: 'palette', label: 'Palette' },
] as const

const TOKEN_SECTION_IDS = TOKEN_SECTIONS.map((s) => s.id)

const SIDEBAR_GROUPS = [
  {
    label: 'Tokens',
    items: TOKEN_SECTIONS.map((s) => ({ id: s.id, label: s.label, icon: Palette, href: undefined as string | undefined })),
  },
  {
    label: 'Components',
    items: [
      { id: 'navbar', label: 'Navbar', icon: Menu, href: undefined as string | undefined },
      { id: 'header', label: 'Header', icon: PanelTop, href: undefined as string | undefined },
      ...SHADCN_COMPONENTS.map((label) => ({
        id: `ui-${slug(label)}` as const,
        label,
        icon: LayoutGrid,
        href: undefined as string | undefined,
      })),
    ],
  },
  {
    label: 'Examples',
    items: [
      { id: 'ex-overview', label: 'Talent Forge overview', icon: ExternalLink, href: '/examples/' },
      { id: 'ex-growth-hub', label: 'Employee growth hub', icon: ExternalLink, href: '/examples/employee-growth-hub/' },
      { id: 'ex-teams-agent', label: 'Hiring pipeline agent', icon: ExternalLink, href: '/examples/teams-hm-agent/' },
      { id: 'ex-perform-360', label: 'Perform 360', icon: ExternalLink, href: '/examples/perform-360/' },
    ],
  },
]

/** Type specs for each typography token (Octuple DS Theme 2, Figma node 47-3). */
const TYPOGRAPHY_SPECS: Record<string, { weight: number; size: string; lineHeight: string; letterSpacing?: string }> = {
  display1: { weight: 400, size: '96px', lineHeight: '1.17', letterSpacing: '-0.03em' },
  display2: { weight: 400, size: '80px', lineHeight: '1.2', letterSpacing: '-0.03em' },
  display3: { weight: 400, size: '64px', lineHeight: '1.125', letterSpacing: '-0.02em' },
  display4: { weight: 400, size: '56px', lineHeight: '1.14', letterSpacing: '-0.02em' },
  header1: { weight: 600, size: '40px', lineHeight: '1.2', letterSpacing: '-0.02em' },
  header2: { weight: 600, size: '32px', lineHeight: '1.25', letterSpacing: '-0.01em' },
  header3: { weight: 600, size: '24px', lineHeight: '1.33' },
  header4: { weight: 600, size: '20px', lineHeight: '1.4' },
  'header4-large': { weight: 600, size: '28px', lineHeight: '1.25' },
  header5: { weight: 600, size: '16px', lineHeight: '1.5' },
  header6: { weight: 600, size: '14px', lineHeight: '1.43' },
  subtitle1: { weight: 400, size: '32px', lineHeight: '1.25', letterSpacing: '-0.015em' },
  subtitle2: { weight: 600, size: '24px', lineHeight: '1.33', letterSpacing: '-0.01em' },
  'pre-display': { weight: 600, size: '20px', lineHeight: '1.4' },
  body1: { weight: 400, size: '18px', lineHeight: '1.33' },
  body2: { weight: 500, size: '16px', lineHeight: '1.5' },
  body3: { weight: 500, size: '14px', lineHeight: '1.43' },
  button1: { weight: 600, size: '18px', lineHeight: '1.33' },
  button2: { weight: 600, size: '16px', lineHeight: '1.25' },
  button3: { weight: 600, size: '14px', lineHeight: '1.14' },
  caption: { weight: 400, size: '12px', lineHeight: '1.33' },
  'caption-medium': { weight: 500, size: '12px', lineHeight: '1.33' },
  'caption-semibold': { weight: 600, size: '12px', lineHeight: '1.33' },
}

/** Typography tokens from Octuple DS Theme 2 (Figma node 47-3). Grouped for standard type scale display. */
const TYPOGRAPHY_GROUPS = [
  {
    title: 'Display',
    tokens: [
      { name: 'display1', var: '--typography-display1', sample: 'Display 1', letterSpacingVar: '--typography-display1-letter-spacing' },
      { name: 'display2', var: '--typography-display2', sample: 'Display 2', letterSpacingVar: '--typography-display2-letter-spacing' },
      { name: 'display3', var: '--typography-display3', sample: 'Display 3', letterSpacingVar: '--typography-display3-letter-spacing' },
      { name: 'display4', var: '--typography-display4', sample: 'Display 4', letterSpacingVar: '--typography-display4-letter-spacing' },
    ],
  },
  {
    title: 'Headings',
    tokens: [
      { name: 'header1', var: '--typography-header1', sample: 'Heading 1', letterSpacingVar: '--typography-header1-letter-spacing' },
      { name: 'header2', var: '--typography-header2', sample: 'Heading 2', letterSpacingVar: '--typography-header2-letter-spacing' },
      { name: 'header3', var: '--typography-header3', sample: 'Heading 3', letterSpacingVar: undefined },
      { name: 'header4', var: '--typography-header4', sample: 'Heading 4', letterSpacingVar: undefined },
      { name: 'header4-large', var: '--typography-header4-large', sample: 'Heading 4 Large', letterSpacingVar: undefined },
      { name: 'header5', var: '--typography-header5', sample: 'Heading 5', letterSpacingVar: undefined },
      { name: 'header6', var: '--typography-header6', sample: 'Heading 6', letterSpacingVar: undefined },
    ],
  },
  {
    title: 'Subtitle',
    tokens: [
      { name: 'subtitle1', var: '--typography-subtitle1', sample: 'Subtitle 1', letterSpacingVar: '--typography-subtitle1-letter-spacing' },
      { name: 'subtitle2', var: '--typography-subtitle2', sample: 'Subtitle 2', letterSpacingVar: '--typography-subtitle2-letter-spacing' },
    ],
  },
  {
    title: 'Pre-display',
    tokens: [
      { name: 'pre-display', var: '--typography-pre-display', sample: 'Pre-display', letterSpacingVar: undefined },
    ],
  },
  {
    title: 'Body',
    tokens: [
      { name: 'body1', var: '--typography-body1', sample: 'Body 1 – The quick brown fox jumps over the lazy dog.', letterSpacingVar: undefined },
      { name: 'body2', var: '--typography-body2', sample: 'Body 2 – The quick brown fox jumps over the lazy dog.', letterSpacingVar: undefined },
      { name: 'body3', var: '--typography-body3', sample: 'Body 3 – The quick brown fox jumps over the lazy dog.', letterSpacingVar: undefined },
    ],
  },
  {
    title: 'Button / Label',
    tokens: [
      { name: 'button1', var: '--typography-button1', sample: 'Button 1', letterSpacingVar: undefined },
      { name: 'button2', var: '--typography-button2', sample: 'Button 2', letterSpacingVar: undefined },
      { name: 'button3', var: '--typography-button3', sample: 'Button 3', letterSpacingVar: undefined },
    ],
  },
  {
    title: 'Caption',
    tokens: [
      { name: 'caption', var: '--typography-caption', sample: 'Caption – Secondary or helper text.', letterSpacingVar: undefined },
      { name: 'caption-medium', var: '--typography-caption-medium', sample: 'Caption medium', letterSpacingVar: undefined },
      { name: 'caption-semibold', var: '--typography-caption-semibold', sample: 'Caption semibold', letterSpacingVar: undefined },
    ],
  },
] as const

const COLOR_TOKENS = [
  { name: 'background3-orange', var: '--color-background3-orange' },
  { name: 'background2-orange', var: '--color-background2-orange' },
  { name: 'primary-orange', var: '--color-primary-orange' },
  { name: 'background2-blue-green', var: '--color-background2-blue-green' },
  { name: 'background3-blue-green', var: '--color-background3-blue-green' },
  { name: 'primary-blue-green', var: '--color-primary-blue-green' },
  { name: 'font-family', var: '--font-family', isFont: true },
] as const

/** Octuple palette families (Figma node 11686:119298); scale 100 → 10, 0 */
const PALETTE_FAMILIES = [
  'grey', 'blue', 'blue-green', 'blue-violet', 'violet', 'violet-red',
  'red', 'red-orange', 'orange', 'yellow', 'yellow-green', 'green',
] as const
const PALETTE_STEPS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10] as const

type ColorTokenRow = { name: string; var: string; kind: 'bg' | 'fg' | 'border'; hexLight: string; hexDark: string }

/** Resolved hex for design system tokens (light: Octuple DS; dark: extrapolated from same palette). */
const SHADCN_MAIN_COLOR_TOKENS: ColorTokenRow[] = [
  { name: 'background', var: '--background', kind: 'bg', hexLight: '#FFFFFF', hexDark: '#1A212E' },
  { name: 'foreground', var: '--foreground', kind: 'fg', hexLight: '#1A212E', hexDark: '#F6F7F8' },
  { name: 'card', var: '--card', kind: 'bg', hexLight: '#FFFFFF', hexDark: '#1A212E' },
  { name: 'card-foreground', var: '--card-foreground', kind: 'fg', hexLight: '#1A212E', hexDark: '#F6F7F8' },
  { name: 'popover', var: '--popover', kind: 'bg', hexLight: '#FFFFFF', hexDark: '#1A212E' },
  { name: 'popover-foreground', var: '--popover-foreground', kind: 'fg', hexLight: '#1A212E', hexDark: '#F6F7F8' },
  { name: 'primary', var: '--primary', kind: 'bg', hexLight: '#054D7B', hexDark: '#2C8CC9' },
  { name: 'primary-foreground', var: '--primary-foreground', kind: 'fg', hexLight: '#FFFFFF', hexDark: '#FFFFFF' },
  { name: 'secondary', var: '--secondary', kind: 'bg', hexLight: '#D9DCE1', hexDark: '#343C4C' },
  { name: 'secondary-foreground', var: '--secondary-foreground', kind: 'fg', hexLight: '#1A212E', hexDark: '#F6F7F8' },
  { name: 'muted', var: '--muted', kind: 'bg', hexLight: '#F6F7F8', hexDark: '#343C4C' },
  { name: 'muted-foreground', var: '--muted-foreground', kind: 'fg', hexLight: '#69717F', hexDark: '#A1A6B1' },
  { name: 'accent', var: '--accent', kind: 'bg', hexLight: '#BCE4FF', hexDark: '#8ED0FA' },
  { name: 'accent-foreground', var: '--accent-foreground', kind: 'fg', hexLight: '#1A212E', hexDark: '#1A212E' },
  { name: 'destructive', var: '--destructive', kind: 'bg', hexLight: '#993838', hexDark: '#C15151' },
  { name: 'destructive-foreground', var: '--destructive-foreground', kind: 'fg', hexLight: '#FFFFFF', hexDark: '#FFFFFF' },
  { name: 'border', var: '--border', kind: 'border', hexLight: '#D9DCE1', hexDark: '#4F5666' },
  { name: 'input', var: '--input', kind: 'border', hexLight: '#D9DCE1', hexDark: '#4F5666' },
  { name: 'ring', var: '--ring', kind: 'border', hexLight: '#2C8CC9', hexDark: '#47A4DF' },
]

/** Spacing & corner radius: Figma node 11686:120880 */
const SPACING_ENTRIES = (Object.entries(SPACING_TOKENS) as [string, number][]).map(([key, value]) => ({ key, value, var: `--spacing-${key}` }))
const RADIUS_ENTRIES = (Object.entries(CORNER_RADIUS_TOKENS) as [string, number][]).map(([key, value]) => ({ key, value, var: `--radius-${key}` }))

function TokensShowcase({ scrollToId }: { scrollToId?: string }) {
  const [copiedCell, setCopiedCell] = useState<string | null>(null)

  useEffect(() => {
    if (scrollToId) {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [scrollToId])

  const copyHex = async (hex: string, cellId: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedCell(cellId)
      setTimeout(() => setCopiedCell(null), 2000)
    } catch {
      setCopiedCell(null)
    }
  }

  return (
    <div className="space-y-12">
      <section id="typography" className="scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Typography</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Octuple DS Theme 2 scale (Figma node 47-3). Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">var(--typography-*)</code> in CSS;
          for subtitle/header/display, add <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">letter-spacing: var(--typography-*-letter-spacing)</code>.
          {' '}
          <a
            href="https://www.figma.com/design/SlKRC7oKF7XZyHMv2op4ch/Octuple-DS--Theme-2-?m=auto&node-id=47-3&t=U5vdCSqYRyJXQTfj-1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            View in Figma →
          </a>
        </p>
        <div className="mt-4 inline-flex items-baseline gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <code className="font-mono text-xs text-muted-foreground">var(--font-family)</code>
          <span
            className="text-sm text-foreground"
            style={{ fontFamily: 'var(--font-family)' } as React.CSSProperties}
          >
            Gilroy, Inter, system-ui
          </span>
        </div>
        <div className="mt-8 space-y-12">
          {TYPOGRAPHY_GROUPS.map(({ title, tokens }) => (
            <div key={title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </h3>
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {tokens.map(({ name, var: varName, sample, letterSpacingVar }) => {
                  const spec = TYPOGRAPHY_SPECS[name]
                  return (
                    <div
                      key={name}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p
                        className="min-h-[2.5em] break-words text-foreground"
                        style={{
                          font: `var(${varName})`,
                          ...(letterSpacingVar ? { letterSpacing: `var(${letterSpacingVar})` } : {}),
                        } as React.CSSProperties}
                      >
                        {sample}
                      </p>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-border pt-3 text-xs">
                        <code className="font-mono text-muted-foreground">{varName}</code>
                        {spec && (
                          <span className="text-muted-foreground">
                            {spec.weight} · {spec.size} · {spec.lineHeight}
                            {spec.letterSpacing != null ? ` · ${spec.letterSpacing}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Token reference table */}
        <div className="mt-12">
          <h3 className="text-base font-semibold text-foreground">Token reference</h3>
          <p className="mt-1 text-sm text-muted-foreground">All typography tokens and their raw values.</p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead className="w-[260px]">Token</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="text-right">Line&nbsp;height</TableHead>
                  <TableHead className="text-right">Tracking</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TYPOGRAPHY_GROUPS.map(({ title, tokens }) => (
                  <Fragment key={title}>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell
                        colSpan={6}
                        className="py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        {title}
                      </TableCell>
                    </TableRow>
                    {tokens.map(({ name, var: varName, letterSpacingVar }) => {
                      const spec = TYPOGRAPHY_SPECS[name]
                      return (
                        <TableRow key={name}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {varName}
                          </TableCell>
                          <TableCell>
                            <div style={{ height: '2rem', overflow: 'hidden', display: 'flex', alignItems: 'flex-start' }}>
                              <span
                                className="text-foreground"
                                style={{
                                  font: `var(${varName})`,
                                  lineHeight: '1',
                                  ...(letterSpacingVar ? { letterSpacing: `var(${letterSpacingVar})` } : {}),
                                } as React.CSSProperties}
                              >
                                Aa
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {spec?.size ?? '—'}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {spec?.weight ?? '—'}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {spec?.lineHeight ?? '—'}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {spec?.letterSpacing ?? '—'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section id="spacing" className="scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Spacing</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Octuple DS Theme 2 spacing scale (Figma node 11686:120880). Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">var(--spacing-*)</code> for margins, padding, gap.
          {' '}
          <a
            href="https://www.figma.com/design/SlKRC7oKF7XZyHMv2op4ch/Octuple-DS--Theme-2-?m=auto&node-id=11686-120880"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            View in Figma →
          </a>
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-6">
          {SPACING_ENTRIES.map(({ key, value, var: varName }) => (
            <div key={String(key)} className="flex flex-col items-center gap-2">
              <div
                className="w-full min-w-[24px] rounded-sm border border-border bg-muted"
                style={{ width: value === 0 ? 24 : Math.max(value, 4), height: value === 0 ? 8 : Math.max(value, 4) } as React.CSSProperties}
                title={`${value}px`}
              />
              <code className="font-mono text-xs text-muted-foreground">{varName}</code>
              <span className="text-xs text-muted-foreground">{value}px</span>
            </div>
          ))}
        </div>
      </section>

      <section id="corner-radius" className="scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Corner radius</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Octuple DS Theme 2 corner radius scale (Figma node 11686:120880). Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">var(--radius-*)</code> for border-radius.
          {' '}
          <a
            href="https://www.figma.com/design/SlKRC7oKF7XZyHMv2op4ch/Octuple-DS--Theme-2-?m=auto&node-id=11686-120880"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            View in Figma →
          </a>
        </p>
        <div className="mt-6 flex flex-wrap gap-6 rounded-lg border border-border bg-card p-6">
          {RADIUS_ENTRIES.map(({ key, value, var: varName }) => (
            <div key={String(key)} className="flex flex-col items-center gap-2">
              <div
                className="h-14 w-14 shrink-0 border-2 border-border bg-muted"
                style={{ borderRadius: `var(${varName})` } as React.CSSProperties}
                title={`${value}px`}
              />
              <code className="font-mono text-xs text-muted-foreground">{varName}</code>
              <span className="text-xs text-muted-foreground">{value === 9999 ? 'full' : `${value}px`}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="colors" className="scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Colors</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Main UI tokens used by Button, Input, Card, etc. Light: Octuple DS; dark: extrapolated from the same palette (apply <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">class=&quot;dark&quot;</code> to enable).
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Variable</TableHead>
                <TableHead>Tailwind</TableHead>
                <TableHead className="font-mono text-xs">Light</TableHead>
                <TableHead className="font-mono text-xs">Dark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SHADCN_MAIN_COLOR_TOKENS.map(({ name, var: varName, kind, hexLight, hexDark }) => {
                const twClass = kind === 'bg' ? `bg-${name}` : kind === 'fg' ? `text-${name}` : `border-${name}`
                return (
                  <TableRow key={varName}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{varName}</code>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{twClass}</code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-5 w-5 shrink-0 rounded border border-border"
                          style={{ backgroundColor: hexLight } as React.CSSProperties}
                        />
                        <button
                          type="button"
                          onClick={() => copyHex(hexLight, `${varName}-light`)}
                          className={cn(
                            'font-mono text-xs rounded px-1 -mx-1 transition-colors cursor-pointer',
                            copiedCell === `${varName}-light` ? 'text-primary' : 'hover:text-foreground hover:bg-muted'
                          )}
                          title="Copy hex"
                        >
                          {copiedCell === `${varName}-light` ? 'Copied!' : hexLight}
                        </button>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-5 w-5 shrink-0 rounded border border-border"
                          style={{ backgroundColor: hexDark } as React.CSSProperties}
                        />
                        <button
                          type="button"
                          onClick={() => copyHex(hexDark, `${varName}-dark`)}
                          className={cn(
                            'font-mono text-xs rounded px-1 -mx-1 transition-colors cursor-pointer',
                            copiedCell === `${varName}-dark` ? 'text-primary' : 'hover:text-foreground hover:bg-muted'
                          )}
                          title="Copy hex"
                        >
                          {copiedCell === `${varName}-dark` ? 'Copied!' : hexDark}
                        </button>
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="semantic-colors" className="scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Semantic colors</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Palette-based tokens used by Pills, cards, Button variants, and other components. Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">var(--color-*)</code> in CSS.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Preview</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Variable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COLOR_TOKENS.filter((t) => !('isFont' in t && t.isFont)).map(({ name, var: varName }) => (
                <TableRow key={varName}>
                  <TableCell className="py-2">
                    <div
                      className="h-8 w-12 rounded border border-border shrink-0"
                      style={{ backgroundColor: `var(${varName})` } as React.CSSProperties}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{varName}</code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section id="palette" className="scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Palette</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Octuple DS Theme 2 color scale (Figma node 11686:119298). Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">var(--color-{'{family}'}-{'{step}'})</code> (e.g. --color-grey-80, --color-blue-70).
        </p>
        <div className="mt-6 space-y-6 rounded-lg border border-border bg-card p-6">
          {PALETTE_FAMILIES.map((family) => {
            const steps = family === 'grey' ? [...PALETTE_STEPS, 0] : [...PALETTE_STEPS]
            return (
              <div key={family}>
                <p className="mb-2 text-sm font-medium capitalize text-foreground">{family.replace(/-/g, '-')}</p>
                <div className="flex flex-wrap gap-1">
                  {steps.map((step) => {
                    const varName = `--color-${family}-${step}`
                    return (
                      <div
                        key={varName}
                        className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-end rounded-md border border-border/80"
                        style={{ backgroundColor: `var(${varName})` } as React.CSSProperties}
                        title={varName}
                      >
                        <span className="mb-0.5 font-mono text-[10px] text-white mix-blend-difference opacity-90" style={{ textShadow: '0 0 2px #000' }}>
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

const NAVBAR_PRODUCTS: {
  id: PrimaryNavbarProductId
  label: string
  personas: {
    id: string
    label: string
    tabs: typeof EMPLOYEE_NON_MANAGER_TABS
    searchPlaceholder?: string
    actionButtons: typeof TALENT_ACQUISITION_ACTION_BUTTONS
    user?: { name: string; avatarType: 'photo' | 'initials'; avatarPhotoSrc?: string; avatarInitials?: string; avatarColor?: string }
  }[]
}[] = [
  {
    id: 'career-hub',
    label: 'Career Hub',
    personas: [
      { id: 'employee', label: 'Employee (non-manager)', tabs: EMPLOYEE_NON_MANAGER_TABS, actionButtons: [] },
      { id: 'manager', label: 'Manager', tabs: MANAGER_TABS, actionButtons: [], user: { name: 'Dana Tanaka', avatarType: 'photo', avatarPhotoSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face' } },
      { id: 'chro', label: 'CHRO', tabs: CAREER_HUB_CHRO_TABS, actionButtons: [] },
      { id: 'hrbp', label: 'HRBP', tabs: CAREER_HUB_HRBP_TABS, actionButtons: [] },
    ],
  },
  {
    id: 'talent-acquisition',
    label: 'Talent Acquisition',
    personas: [
      {
        id: 'recruiter',
        label: 'Recruiter',
        tabs: TALENT_ACQUISITION_RECRUITER_TABS,
        searchPlaceholder: TALENT_ACQUISITION_SEARCH_PLACEHOLDER,
        actionButtons: TALENT_ACQUISITION_ACTION_BUTTONS,
      },
    ],
  },
]

/** Card: CH chevron background + in-flow Navbar + layered Header (demo shell only). */
function CareerHubAssembledBlock({
  eyebrow,
  chevronsVariant,
  header,
}: {
  eyebrow: { title: string; code: string; height: string }
  chevronsVariant: 'profile' | 'default'
  header: ReactNode
}) {
  const product = getNavbarProductConfig('career-hub')
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <div>
          <p className="text-sm font-semibold text-foreground">{eyebrow.title}</p>
          <code className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{eyebrow.code}</code>
        </div>
        <span className="rounded-md bg-background px-2 py-0.5 font-mono text-xs text-foreground ring-1 ring-border">
          {eyebrow.height}
        </span>
      </div>
      <ProductBackground variant="career-hub" chevronsVariant={chevronsVariant} className="relative min-h-0">
        <div className="header-assembled-ch-shell flex min-h-0 flex-col">
          <Navbar
            logoSrc={EIGHTFOLD_LOGO_PATH}
            productName={product.productName}
            productIconSrc={product.productIconSrc}
            tabs={EMPLOYEE_NON_MANAGER_TABS}
            avatarMenuItems={EMPLOYEE_AVATAR_MENU_ITEMS}
            actionButtons={[]}
            user={{
              name: 'Avery Chen',
              avatarType: 'initials',
              avatarInitials: 'AC',
            }}
          />
          {header}
        </div>
      </ProductBackground>
    </div>
  )
}

function HeaderShowcase() {
  const specRows = [
    {
      label: 'Talent Acquisition',
      prop: 'variant="talent-acquisition"',
      height: '—',
      note: 'Blue rule; chSize ignored',
    },
    {
      label: 'Career Hub · profile',
      prop: 'chSize="profile"',
      height: '408px',
      note: 'Profile / hero',
    },
    {
      label: 'Career Hub · parent',
      prop: 'chSize="parent" (default)',
      height: '160px',
      note: 'Section pages',
    },
    {
      label: 'Career Hub · child',
      prop: 'chSize="child"',
      height: '116px',
      note: 'Nested / detail',
    },
  ] as const

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-8">
      <header className="border-b border-border pb-6">
        <h2 className="scroll-mt-20 text-2xl font-semibold tracking-tight text-foreground">Header</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Page bar under the Navbar. <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">HeaderTitle</code>{' '}
          uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">--typography-header2</code> (32px).
          Stack title + <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">HeaderSecondary</code> in{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">HeaderTextGroup</code> (left-aligned); secondary
          uses <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">--typography-body2</code> (16px). Toolbar
          horizontal inset is <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">--spacing-12</code> (24px).
          Use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">variant</code> for product chrome; Career Hub{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">chSize</code> sets toolbar height;{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">overlayBackground</code> makes the bar transparent
          over <code className="rounded bg-muted px-1 font-mono text-[11px]">ProductBackground</code>. Top-right actions
          use <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">HeaderToolbar</code>{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">actions=…</code> (or <code className="rounded bg-muted px-1 font-mono text-[11px]">HeaderActions</code>
          ) with the same 24px top inset as the title group. For full-width
          hero or page wash, use{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">ProductBackground</code> with the same{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">variant</code> (see UI Catalog).
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="header-product-bg">
        <div>
          <h3 id="header-product-bg" className="text-base font-semibold text-foreground">
            ProductBackground
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            All background variants — gradients, chevrons, hexagons, blue hexagons, and photo (
            <code className="rounded bg-muted px-1 font-mono text-[10px]">src</code>).
          </p>
        </div>

        {/* Gradients */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Gradients</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProductBackground variant="talent-acquisition" className="min-h-20 overflow-hidden rounded-md border border-border">
              <div className="flex min-h-20 items-center px-[var(--spacing-12)] text-sm font-medium text-foreground">
                talent-acquisition
              </div>
            </ProductBackground>
            <ProductBackground variant="career-hub" className="min-h-20 overflow-hidden rounded-md border border-border">
              <div className="flex min-h-20 items-center px-[var(--spacing-12)] text-sm font-medium text-foreground">
                career-hub
              </div>
            </ProductBackground>
          </div>
        </div>

        {/* Chevrons */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Chevrons</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProductBackground
              variant="career-hub"
              chevronsVariant="default"
              className="min-h-36 overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-36 items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                default
              </div>
            </ProductBackground>
            <ProductBackground
              variant="career-hub"
              chevronsVariant="profile"
              className="min-h-36 overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-36 items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                profile
              </div>
            </ProductBackground>
          </div>
        </div>

        {/* Hexagons */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Hexagons</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProductBackground
              variant="career-hub"
              hexagonsVariant="default"
              className="min-h-36 overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-36 items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                default
              </div>
            </ProductBackground>
            <ProductBackground
              variant="career-hub"
              hexagonsVariant="profile"
              className="min-h-[200px] overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-[200px] items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                profile
              </div>
            </ProductBackground>
          </div>
        </div>

        {/* Blue Hexagons */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Blue Hexagons</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProductBackground
              variant="career-hub"
              blueHexagonsVariant="default"
              className="min-h-36 overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-36 items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                default
              </div>
            </ProductBackground>
            <ProductBackground
              variant="career-hub"
              blueHexagonsVariant="profile"
              className="min-h-[200px] overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-[200px] items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                profile
              </div>
            </ProductBackground>
          </div>
        </div>

        {/* Waves */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Waves</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProductBackground
              variant="career-hub"
              wavesVariant="default"
              className="min-h-36 overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-36 items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                default
              </div>
            </ProductBackground>
            <ProductBackground
              variant="career-hub"
              wavesVariant="profile"
              className="min-h-[200px] overflow-hidden rounded-md border border-border"
            >
              <div className="flex min-h-[200px] items-end px-[var(--spacing-12)] pb-3 text-sm font-medium text-foreground">
                profile
              </div>
            </ProductBackground>
          </div>
        </div>
      </section>

      <section aria-labelledby="header-spec">
        <h3 id="header-spec" className="sr-only">
          API summary
        </h3>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="border-b border-border bg-muted/50 px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick reference</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Variant</th>
                  <th className="px-4 py-2 font-medium">Props</th>
                  <th className="px-4 py-2 font-medium">Toolbar height</th>
                  <th className="px-4 py-2 font-medium">Use</th>
                </tr>
              </thead>
              <tbody>
                {specRows.map((row) => (
                  <tr key={row.label} className="border-b border-border/80 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-foreground">{row.prop}</td>
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{row.height}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Talent Acquisition</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Single bar height (~60px); link-primary styling on breadcrumbs in context.</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
            <code className="font-mono text-xs text-foreground">variant=&quot;talent-acquisition&quot;</code>
          </div>
          <Header variant="talent-acquisition">
            <HeaderToolbar
              actions={
                <>
                  <Button type="button" size="sm" variant="outline">
                    Filters
                  </Button>
                  <Button type="button" size="sm">
                    Post job
                  </Button>
                </>
              }
            >
              <HeaderGroup className="min-w-0 flex-1 flex-col items-stretch gap-2 md:flex-row md:items-start">
                <HeaderTextGroup className="md:mr-4">
                  <HeaderTitle>Open requisitions</HeaderTitle>
                  <HeaderSecondary>Engineering · 12 open roles</HeaderSecondary>
                </HeaderTextGroup>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Positions</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Engineering</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </HeaderGroup>
            </HeaderToolbar>
          </Header>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Career Hub</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Same <code className="rounded bg-muted px-1 font-mono text-[11px]">variant=&quot;career-hub&quot;</code> — pick{' '}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">chSize</code> for profile, parent, or child.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          {(
            [
              {
                key: 'profile',
                title: 'Profile',
                height: '408px',
                code: 'chSize="profile"',
                header: (
                  <Header variant="career-hub" chSize="profile">
                    <HeaderToolbar
                      actions={
                        <>
                          <Button type="button" size="sm" variant="outline">
                            Message
                          </Button>
                          <Button type="button" size="sm">
                            Connect
                          </Button>
                        </>
                      }
                    >
                      <HeaderGroup className="min-w-0 flex-1">
                        <HeaderTextGroup>
                          <HeaderTitle>Avery Chen</HeaderTitle>
                          <HeaderSecondary>Senior Engineer · San Francisco</HeaderSecondary>
                        </HeaderTextGroup>
                      </HeaderGroup>
                    </HeaderToolbar>
                  </Header>
                ),
              },
              {
                key: 'parent',
                title: 'Parent',
                height: '160px',
                code: 'chSize="parent"',
                header: (
                  <Header variant="career-hub" chSize="parent">
                    <HeaderToolbar
                      actions={
                        <>
                          <Button type="button" size="sm" variant="secondary">
                            Share
                          </Button>
                          <Button type="button" size="sm">
                            Add goal
                          </Button>
                        </>
                      }
                    >
                      <HeaderGroup className="min-w-0 flex-1">
                        <HeaderTextGroup>
                          <HeaderTitle className="shrink-0">My learning goals</HeaderTitle>
                          <HeaderSecondary data-lines="2">
                            Track progress and add new goals anytime
                          </HeaderSecondary>
                        </HeaderTextGroup>
                      </HeaderGroup>
                    </HeaderToolbar>
                  </Header>
                ),
              },
              {
                key: 'child',
                title: 'Child',
                height: '116px',
                code: 'chSize="child"',
                header: (
                  <Header variant="career-hub" chSize="child">
                    <HeaderToolbar
                      actions={
                        <Button type="button" size="sm" variant="ghost">
                          Back
                        </Button>
                      }
                    >
                      <HeaderGroup className="min-w-0 flex-1">
                        <HeaderTextGroup className="min-w-0 max-w-full sm:max-w-md">
                          <HeaderTitle className="max-w-full">Complete skills assessment</HeaderTitle>
                          <HeaderSecondary>Due in 5 days · Goals</HeaderSecondary>
                        </HeaderTextGroup>
                      </HeaderGroup>
                    </HeaderToolbar>
                  </Header>
                ),
              },
            ] as const
          ).map((item) => (
            <div
              key={item.key}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <code className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{item.code}</code>
                </div>
                <span className="rounded-md bg-background px-2 py-0.5 font-mono text-xs text-foreground ring-1 ring-border">
                  {item.height}
                </span>
              </div>
              <div className="min-h-0 flex-1">{item.header}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="header-assembled-ch">
        <div>
          <h3 id="header-assembled-ch" className="text-base font-semibold text-foreground">
            Fully assembled · Career Hub
          </h3>
          <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
            <code className="rounded bg-muted px-1 font-mono text-[11px]">ProductBackground</code> (chevrons, top-aligned
            art) with the{' '}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">Navbar</code> and{' '}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">Header</code> uses{' '}
            <code className="rounded bg-muted px-1 font-mono text-[10px]">overlayBackground</code> so the chevron wash
            shows through; Navbar uses <code className="rounded bg-muted px-1 font-mono text-[10px]">position:relative</code>{' '}
            in this preview only (
            <code className="rounded bg-muted px-1 font-mono text-[10px]">.header-assembled-ch-shell</code> in the demo).
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <CareerHubAssembledBlock
            eyebrow={{
              title: 'Profile',
              code: 'chevronsVariant="profile" · chSize="profile"',
              height: '60px nav + 408px header',
            }}
            chevronsVariant="profile"
            header={
              <Header variant="career-hub" chSize="profile" overlayBackground className="relative z-[5]">
                <HeaderToolbar
                  actions={
                    <>
                      <Button type="button" size="sm" variant="outline">
                        Message
                      </Button>
                      <Button type="button" size="sm">
                        Connect
                      </Button>
                    </>
                  }
                >
                  <HeaderGroup className="min-w-0 flex-1">
                    <HeaderTextGroup>
                      <HeaderTitle>Avery Chen</HeaderTitle>
                      <HeaderSecondary>Senior Engineer · San Francisco</HeaderSecondary>
                    </HeaderTextGroup>
                  </HeaderGroup>
                </HeaderToolbar>
              </Header>
            }
          />
          <CareerHubAssembledBlock
            eyebrow={{
              title: 'Parent',
              code: 'chevronsVariant="default" · chSize="parent"',
              height: '60px nav + 160px header',
            }}
            chevronsVariant="default"
            header={
              <Header variant="career-hub" chSize="parent" overlayBackground className="relative z-[5]">
                <HeaderToolbar
                  actions={
                    <>
                      <Button type="button" size="sm" variant="secondary">
                        Share
                      </Button>
                      <Button type="button" size="sm">
                        Add goal
                      </Button>
                    </>
                  }
                >
                  <HeaderGroup className="min-w-0 flex-1">
                    <HeaderTextGroup>
                      <HeaderTitle className="shrink-0">My learning goals</HeaderTitle>
                      <HeaderSecondary data-lines="2">
                        Track progress and add new goals anytime
                      </HeaderSecondary>
                    </HeaderTextGroup>
                  </HeaderGroup>
                </HeaderToolbar>
              </Header>
            }
          />
          <CareerHubAssembledBlock
            eyebrow={{
              title: 'Child',
              code: 'chevronsVariant="default" · chSize="child"',
              height: '60px nav + 116px header',
            }}
            chevronsVariant="default"
            header={
              <Header variant="career-hub" chSize="child" overlayBackground className="relative z-[5]">
                <HeaderToolbar
                  actions={
                    <Button type="button" size="sm" variant="ghost">
                      Back
                    </Button>
                  }
                >
                  <HeaderGroup className="min-w-0 flex-1">
                    <HeaderTextGroup className="min-w-0 max-w-full sm:max-w-md">
                      <HeaderTitle className="max-w-full">Complete skills assessment</HeaderTitle>
                      <HeaderSecondary>Due in 5 days · Goals</HeaderSecondary>
                    </HeaderTextGroup>
                  </HeaderGroup>
                </HeaderToolbar>
              </Header>
            }
          />
        </div>
      </section>
    </div>
  )
}

function NavbarShowcase() {
  const [productId, setProductId] = useState<PrimaryNavbarProductId>('career-hub')
  const [personaId, setPersonaId] = useState<string>('employee')

  const product = NAVBAR_PRODUCTS.find((p) => p.id === productId) ?? NAVBAR_PRODUCTS[0]
  const persona = product.personas.find((p) => p.id === personaId) ?? product.personas[0]

  const productConfig = getNavbarProductConfig(productId)

  const handleProductChange = (nextProductId: PrimaryNavbarProductId) => {
    setProductId(nextProductId)
    const nextProduct = NAVBAR_PRODUCTS.find((p) => p.id === nextProductId) ?? NAVBAR_PRODUCTS[0]
    setPersonaId(nextProduct.personas[0].id)
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="scroll-mt-20 text-2xl font-semibold tracking-tight text-foreground">Navbar</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          App shell with product logo, tabs, search, and avatar menu. Choose product, then persona.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="navbar-product" className="text-sm font-medium text-foreground">
              Product
            </label>
            <select
              id="navbar-product"
              value={productId}
              onChange={(e) => handleProductChange(e.target.value as PrimaryNavbarProductId)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {NAVBAR_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="navbar-persona" className="text-sm font-medium text-foreground">
              Persona
            </label>
            <select
              id="navbar-persona"
              value={personaId}
              onChange={(e) => setPersonaId(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              {product.personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 overflow-visible rounded-lg border border-border">
          <Navbar
            logoSrc={EIGHTFOLD_LOGO_PATH}
            productName={productConfig.productName}
            productIconSrc={productConfig.productIconSrc}
            tabs={persona.tabs}
            avatarMenuItems={EMPLOYEE_AVATAR_MENU_ITEMS}
            searchPlaceholder={persona.searchPlaceholder}
            actionButtons={persona.actionButtons}
            user={persona.user ?? {
              name: 'Demo User',
              avatarType: 'initials',
              avatarInitials: 'DU',
            }}
          />
        </div>
      </section>
    </div>
  )
}

class PageErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-semibold">This page failed to load</p>
          <pre className="mt-2 overflow-auto text-sm">{this.state.error.message}</pre>
          <pre className="mt-2 overflow-auto text-xs opacity-80">{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function DemoContent({ page }: { page: string }) {
  if ((TOKEN_SECTION_IDS as readonly string[]).includes(page)) return <TokensShowcase scrollToId={page} />
  if (page === 'header') {
    return (
      <PageErrorBoundary>
        <HeaderShowcase />
      </PageErrorBoundary>
    )
  }
  if (page === 'navbar') {
    if (typeof Navbar !== 'function') {
      return (
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-200">
          <p className="font-semibold">Navbar component failed to load</p>
          <p className="mt-1 text-sm">Check the browser console for errors. The design system may not have resolved from source.</p>
        </div>
      )
    }
    return (
      <PageErrorBoundary>
        <NavbarShowcase />
      </PageErrorBoundary>
    )
  }
  if (page.startsWith('ui-')) {
    const scrollToId = page.slice(3)
    return <UICatalog scrollToId={scrollToId} />
  }
  return <TokensShowcase scrollToId={TOKEN_SECTION_IDS[0]} />
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  navbar: { title: 'Navbar', description: 'App shell with tabs, search, and avatar menu.' },
  header: {
    title: 'Header',
    description: 'Talent Acquisition & Career Hub variants — page bar below Navbar.',
  },
}

const TOKENS_DESCRIPTION = 'Typography, spacing, corner radius, and color tokens from Octuple DS Theme 2.'

function getPageTitle(page: string): { title: string; description: string } {
  if (PAGE_TITLES[page]) return PAGE_TITLES[page]
  if ((TOKEN_SECTION_IDS as readonly string[]).includes(page)) {
    const section = TOKEN_SECTIONS.find((s) => s.id === page)
    return { title: section?.label ?? 'Tokens', description: TOKENS_DESCRIPTION }
  }
  if (page.startsWith('ui-')) {
    const name = titleFromSlug(page.slice(3))
    return { title: name, description: `shadcn ${name} component.` }
  }
  return { title: 'Tokens', description: TOKENS_DESCRIPTION }
}

export default function App() {
  const [page, setPage] = useState<string>('typography')
  const { title, description } = getPageTitle(page)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-background">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <img src={EIGHTFOLD_LOGO_PATH} alt="" className="h-6 w-6 shrink-0 object-contain" />
          <span className="font-semibold tracking-tight text-foreground">Design System</span>
        </div>
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-hidden">
          <p className="mb-4 px-2 text-xs text-muted-foreground">
            Last updated: {process.env.NEXT_PUBLIC_LAST_UPDATED
              ? new Date(process.env.NEXT_PUBLIC_LAST_UPDATED + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '—'}
          </p>
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = page === item.id
                  const itemClass = cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                  return (
                    <li key={item.id}>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className={itemClass}>
                          <Icon className="h-4 w-4 shrink-0 opacity-70" />
                          {item.label}
                        </a>
                      ) : (
                        <button onClick={() => setPage(item.id)} className={itemClass}>
                          <Icon className="h-4 w-4 shrink-0 opacity-70" />
                          {item.label}
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="min-h-screen pl-56">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-6 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1.5 text-base text-muted-foreground">{description}</p>
        </header>
        <div className="px-6 py-8">
          <div className="mx-auto max-w-3xl">
            <DemoContent page={page} />
          </div>
        </div>
      </main>
    </div>
  )
}
