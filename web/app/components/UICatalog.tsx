"use client";

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
// Alert component is blocked — using inline divs instead
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import { Tag, TagGroup } from '@tonyh-2-eightfold/ef-design-system'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
// Calendar component is blocked — using placeholder div instead
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import {
  Button as DSButton,
  Input,
  InsightCard,
  CourseObjectCard,
  ProjectObjectCard,
  PeopleObjectCard,
  MentorInsightCard,
  NumberBadge,
  SkillTag,
  StatCard,
  StatCardGroup,
  ButtonDropdown,
  DropdownMenu as DSDropdownMenu,
  ProductBackground,
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
  // New components
  InfoBar,
  MessageBar,
  Snackbar,
  Panel,
  Chip,
  DateTimePicker,
  SegmentedProgress,
  Timeline,
  TimelineItem,
  Uploader,
  UploaderFileItem,
  FloatingActionButton,
} from '@tonyh-2-eightfold/ef-design-system'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Inbox, FileText, Bell, Tag as TagIcon, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Kbd } from '@/components/ui/kbd'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
function MaterialIcon({ name, className }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className ?? ''}`} style={{ fontSize: '1em' }}>{name}</span>
}

function slug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

function Block({
  title,
  id: idProp,
  children,
  plain,
}: {
  title: string
  id?: string
  children: React.ReactNode
  /** No bordered/muted wrapper; for design-system components that should match Figma (e.g. object cards) */
  plain?: boolean
}) {
  const id = idProp ?? slug(title)
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div
        className={cn(
          plain
            ? 'flex flex-wrap items-start gap-6 bg-background p-6'
            : 'flex min-h-[80px] flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/30 p-4'
        )}
      >
        {children}
      </div>
    </section>
  )
}

export function UICatalog({
  scrollToId,
  onScrolled,
}: {
  scrollToId?: string | null
  onScrolled?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sliderVal, setSliderVal] = useState([50])
  const [stepperStep, setStepperStep] = useState(1)
  const [tableSort, setTableSort] = useState<'asc' | 'desc' | false>(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!scrollToId) return
    const el = document.getElementById(scrollToId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      onScrolled?.()
    }
  }, [scrollToId, onScrolled])

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">
        All shadcn/ui components in one place. Use the sidebar to jump to a component.
      </p>

      <div className="space-y-8">
        <Block title="Accordion">
          <div className="w-full">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Example</p>
            <Accordion type="single" collapsible className="w-full max-w-md">
              <AccordionItem value="1">
                <AccordionTrigger>Item 1</AccordionTrigger>
                <AccordionContent>Content for item 1.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger>Item 2</AccordionTrigger>
                <AccordionContent>Content for item 2.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Block>

        <Block title="Alert">
          <div className="space-y-4 w-full">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Variants</p>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-md border border-border bg-background px-4 py-3 text-sm">
                  <p className="font-medium">Default</p>
                  <p className="text-muted-foreground">Description text for the alert.</p>
                </div>
                <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <p className="font-medium">Destructive</p>
                  <p>Destructive variant.</p>
                </div>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Alert Dialog">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Open</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm</AlertDialogTitle>
                <AlertDialogDescription>Are you sure?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="secondary">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button>Continue</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Block>

        <Block title="Aspect Ratio">
          <AspectRatio ratio={16 / 9} className="w-48 overflow-hidden rounded-md bg-muted">
            <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
              16:9
            </div>
          </AspectRatio>
        </Block>

        <Block title="Avatar">
          <div className="grid gap-10 sm:grid-cols-2">
            {/* Single avatars */}
            <div className="flex flex-col gap-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Single</h4>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes</p>
                  <div className="flex flex-wrap items-end gap-3 grayscale">
                    {[
                      { size: 'sm' as const, label: 'sm' },
                      { size: 'default' as const, label: 'default' },
                      { size: 'lg' as const, label: 'lg' },
                    ].map(({ size, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1">
                        <Avatar size={size}>
                          <AvatarImage src="https://github.com/shadcn.png" alt="" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">With image</p>
                  <div className="flex flex-wrap items-center gap-4 grayscale">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="https://github.com/evilrabbit.png" alt="" />
                      <AvatarFallback>ER</AvatarFallback>
                      <AvatarBadge className="bg-[var(--color-primary-green)]" />
                    </Avatar>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Fallback only</p>
                  <div className="flex flex-wrap items-end gap-3">
                    {[
                      { size: 'sm' as const, label: 'sm', fallback: 'S', className: 'bg-[var(--color-primary-blue-violet)] text-white' },
                      { size: 'default' as const, label: 'default', fallback: 'AB', className: 'bg-[var(--color-avatar-initials-bg)] text-[var(--color-avatar-initials-text)]' },
                      { size: 'lg' as const, label: 'lg', fallback: 'XY', className: 'bg-[var(--color-primary-violet)] text-white' },
                    ].map(({ size, label, fallback, className }) => (
                      <div key={label} className="flex flex-col items-center gap-1">
                        <Avatar size={size}>
                          <AvatarFallback className={className}>{fallback}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Groups */}
            <div className="flex flex-col gap-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Groups</h4>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Default</p>
                  <AvatarGroup className="grayscale">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="https://github.com/maxleiter.png" alt="" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="https://github.com/evilrabbit.png" alt="" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount>+3</AvatarGroupCount>
                  </AvatarGroup>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Small</p>
                  <AvatarGroup className="grayscale">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="https://github.com/maxleiter.png" alt="" />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="https://github.com/evilrabbit.png" alt="" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount>+3</AvatarGroupCount>
                  </AvatarGroup>
                </div>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Tag">
          <div className="space-y-6 w-full">
            <p className="text-xs text-muted-foreground">
              Octuple DS Theme 2 — <a href="https://www.figma.com/design/SlKRC7oKF7XZyHMv2op4ch/Octuple-DS--Theme-2-?m=auto&node-id=14403-166977" target="_blank" rel="noreferrer" className="underline hover:text-foreground">Figma (node 14403-166977)</a>. Selectable chips via TagGroup (single/multiple) or standalone with optional remove. Sizes: 24h, 30h, 44h (same as Badge).
            </p>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Standalone</p>
              <div className="flex flex-wrap gap-2">
                <Tag>Default</Tag>
                <Tag variant="selected">Selected</Tag>
                <Tag variant="disabled">Disabled</Tag>
                <Tag onRemove={() => {}}>With remove</Tag>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Leading / trailing icons</p>
              <div className="flex flex-wrap gap-2">
                <Tag leadingIcon={<TagIcon className="size-3" />}>With leading</Tag>
                <Tag trailingIcon={<X className="size-3" />}>With trailing</Tag>
                <Tag leadingIcon={<TagIcon className="size-3" />} trailingIcon={<X className="size-3" />}>Both</Tag>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes</p>
              <div className="flex flex-wrap gap-2">
                <Tag size="24">24h</Tag>
                <Tag size="30">30h</Tag>
                <Tag size="44">44h</Tag>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Color variants</p>
              <div className="flex flex-wrap gap-2">
                <Tag color="grey" size="24">Grey</Tag>
                <Tag color="blue" size="24">Blue</Tag>
                <Tag color="green" size="24">Green</Tag>
                <Tag color="red" size="24">Red</Tag>
                <Tag color="orange" size="24">Orange</Tag>
                <Tag color="violet" size="24">Violet</Tag>
                <Tag color="blue-green" size="24">Blue-green</Tag>
                <Tag color="blue-violet" size="24">Blue-violet</Tag>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">TagGroup (single selection)</p>
              <TagGroup type="single" defaultValue={['design']} size="30">
                <Tag value="design">Design</Tag>
                <Tag value="engineering">Engineering</Tag>
                <Tag value="product">Product</Tag>
              </TagGroup>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">TagGroup (multiple selection)</p>
              <TagGroup type="multiple" defaultValue={['react', 'typescript']} size="30">
                <Tag value="react">React</Tag>
                <Tag value="typescript">TypeScript</Tag>
                <Tag value="node">Node</Tag>
              </TagGroup>
            </div>
          </div>
        </Block>

        <Block title="Breadcrumb" id="breadcrumb">
          <div className="w-full max-w-3xl space-y-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Octuple{' '}
              <a
                href="https://www.figma.com/design/SlKRC7oKF7XZyHMv2op4ch/Octuple-DS--Theme-2-?node-id=10130-66481"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
              >
                Breadcrumb
              </a>
              — slash separators, link color{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">#146DA6</code>
              , current page default text.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/50 px-4 py-3">
                  <h3 className="text-sm font-semibold text-foreground">Full trail</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Three links + current page (Figma “Max 4 links”).
                  </p>
                </div>
                <div className="flex min-h-[3.5rem] items-center px-4 py-4">
                  <Breadcrumb className="w-full min-w-0">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Products</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Category</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Subcategory</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Detail view</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>

              <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/50 px-4 py-3">
                  <h3 className="text-sm font-semibold text-foreground">Truncated</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    <code className="font-mono text-[10px]">BreadcrumbEllipsis</code> collapses middle
                    segments.
                  </p>
                </div>
                <div className="flex min-h-[3.5rem] items-center px-4 py-4">
                  <Breadcrumb className="w-full min-w-0">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbEllipsis />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Section</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Current</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-border/80 bg-muted/15 px-4 py-3">
              <p className="text-[11px] font-medium text-muted-foreground">Compact</p>
              <div className="mt-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">App</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Button">
          <div className="space-y-6 w-full">
            <p className="text-xs text-muted-foreground">Library (Octuple DS). Variants, sizes, icons, badge.</p>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Variants</p>
              <div className="flex flex-wrap items-center gap-2">
                <DSButton variant="default">Default</DSButton>
                <DSButton variant="primary">Primary</DSButton>
                <DSButton variant="destructive">Destructive</DSButton>
                <DSButton variant="secondary">Secondary</DSButton>
                <DSButton variant="outline">Outline</DSButton>
                <DSButton variant="ghost">Ghost</DSButton>
                <DSButton variant="orange">Orange</DSButton>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Button dropdown</p>
              <div className="flex flex-wrap items-center gap-2">
                <ButtonDropdown
                  menu={
                    <>
                      <DSDropdownMenu.Item onSelect={() => {}}>Save</DSDropdownMenu.Item>
                      <DSDropdownMenu.Item>Export</DSDropdownMenu.Item>
                      <DSDropdownMenu.Separator />
                      <DSDropdownMenu.Item>Log out</DSDropdownMenu.Item>
                    </>
                  }
                >
                  Actions
                </ButtonDropdown>
                <ButtonDropdown
                  variant="primary"
                  menu={
                    <>
                      <DSDropdownMenu.Item>Profile</DSDropdownMenu.Item>
                      <DSDropdownMenu.Item>Settings</DSDropdownMenu.Item>
                    </>
                  }
                >
                  Account
                </ButtonDropdown>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">With icon / badge</p>
              <div className="flex flex-wrap items-center gap-2">
                <DSButton variant="outline" leadingIcon={<MaterialIcon name="arrow_back" />}>Back</DSButton>
                <DSButton variant="outline" trailingIcon={<MaterialIcon name="arrow_forward" />}>Next</DSButton>
                <DSButton variant="secondary" leadingIcon={<MaterialIcon name="add" />}>Add item</DSButton>
                <DSButton variant="secondary" badge={3}>Notifications</DSButton>
                <DSButton variant="outline" badge={12}>Inbox</DSButton>
                <DSButton variant="primary" badge={99}>Alerts</DSButton>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes (text)</p>
              <div className="flex flex-wrap items-end gap-4">
                {(['xs', 'sm', 'default', 'lg'] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <Button size={s}>{s}</Button>
                    <span className="text-[10px] text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes (icon)</p>
              <div className="flex flex-wrap items-end gap-4">
                {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <Button size={s} aria-label={s}><MaterialIcon name="more_vert" /></Button>
                    <span className="text-[10px] text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Block>

        <Block title="Calendar">
          <div className="rounded-md border border-border px-4 py-3 text-sm text-muted-foreground">
            Calendar — use DateTimePicker from @tonyh-2-eightfold/ef-design-system
          </div>
        </Block>

        <Block title="Card">
          <div className="w-full">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Example</p>
            <Card className="w-[280px]">
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Card description.</CardDescription>
              </CardHeader>
              <CardContent>Content here.</CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </Block>

        <Block title="Number Badge" id="number-badge">
          <div className="flex w-full min-w-0 flex-col gap-6">
            <div className="w-full space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Colors × Sizes</p>
              <table className="text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="pr-6 pb-2 text-left font-medium"></th>
                    <th className="pr-6 pb-2 text-center font-medium">sm</th>
                    <th className="pr-6 pb-2 text-center font-medium">md</th>
                    <th className="pb-2 text-center font-medium">lg</th>
                  </tr>
                </thead>
                <tbody>
                  {(['red', 'orange', 'amber', 'yellow', 'lime', 'teal', 'mint', 'sky', 'blue', 'purple', 'pink', 'grey'] as const).map(color => (
                    <tr key={color}>
                      <td className="pr-6 py-1.5 text-muted-foreground font-medium">{color}</td>
                      <td className="pr-6 py-1.5 text-center"><NumberBadge value={8} color={color} size="sm" /></td>
                      <td className="pr-6 py-1.5 text-center"><NumberBadge value={8} color={color} size="md" /></td>
                      <td className="py-1.5 text-center"><NumberBadge value={8} color={color} size="lg" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Block>

        <Block title="Skill Tag" id="skill-tag">
          <div className="flex w-full min-w-0 flex-col gap-8">
            {/* Sizes × Variants */}
            <div className="w-full space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Variants × Sizes</p>
              <table className="text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="pr-4 pb-2 text-left font-medium"></th>
                    <th className="pr-4 pb-2 text-left font-medium">Default</th>
                    <th className="pr-4 pb-2 text-left font-medium">w/ endorse</th>
                    <th className="pr-4 pb-2 text-left font-medium">w/ save</th>
                    <th className="pr-4 pb-2 text-left font-medium">Matched</th>
                    <th className="pr-4 pb-2 text-left font-medium">Highlighted</th>
                    <th className="pr-4 pb-2 text-left font-medium">Highlighted + endorse</th>
                    <th className="pb-2 text-left font-medium">Highlighted + save</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pr-4 py-2 text-muted-foreground font-medium">Small</td>
                    <td className="pr-4 py-2"><SkillTag size="sm">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" action="save">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" variant="matched">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" variant="highlighted">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" variant="highlighted" action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag size="sm" variant="highlighted" action="save">Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-2 text-muted-foreground font-medium">Medium</td>
                    <td className="pr-4 py-2"><SkillTag size="md">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" action="save">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" variant="matched">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" variant="highlighted">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" variant="highlighted" action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag size="md" variant="highlighted" action="save">Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-2 text-muted-foreground font-medium">Large</td>
                    <td className="pr-4 py-2"><SkillTag size="lg">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" action="save">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" variant="matched">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" variant="highlighted">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" variant="highlighted" action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag size="lg" variant="highlighted" action="save">Time travel</SkillTag></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Trends */}
            <div className="w-full space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Trends</p>
              <table className="text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="pr-4 pb-2 text-left font-medium"></th>
                    <th className="pr-4 pb-2 text-left font-medium">Exceed</th>
                    <th className="pr-4 pb-2 text-left font-medium">Meet</th>
                    <th className="pr-4 pb-2 text-left font-medium">Below</th>
                    <th className="pr-4 pb-2 text-left font-medium">Exceed + Upskilling</th>
                    <th className="pr-4 pb-2 text-left font-medium">Meet + Upskilling</th>
                    <th className="pb-2 text-left font-medium">Below + Upskilling</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pr-4 py-2 text-muted-foreground font-medium">Small</td>
                    <td className="pr-4 py-2"><SkillTag size="sm" trend="exceed">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" trend="meet">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" trend="below">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" trend="exceed" upskilling>Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="sm" trend="meet" upskilling>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag size="sm" trend="below" upskilling>Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-2 text-muted-foreground font-medium">Medium</td>
                    <td className="pr-4 py-2"><SkillTag size="md" trend="exceed">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" trend="meet">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" trend="below">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" trend="exceed" upskilling>Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="md" trend="meet" upskilling>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag size="md" trend="below" upskilling>Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-4 py-2 text-muted-foreground font-medium">Large</td>
                    <td className="pr-4 py-2"><SkillTag size="lg" trend="exceed">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" trend="meet">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" trend="below">Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" trend="exceed" upskilling>Time travel</SkillTag></td>
                    <td className="pr-4 py-2"><SkillTag size="lg" trend="meet" upskilling>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag size="lg" trend="below" upskilling>Time travel</SkillTag></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions: before/after */}
            <div className="w-full space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Actions · before / after</p>
              <table className="text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="pr-6 pb-2 text-left font-medium"></th>
                    <th className="pr-6 pb-2 text-left font-medium">Before</th>
                    <th className="pb-2 text-left font-medium">After</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pr-6 py-2 text-muted-foreground font-medium">Add</td>
                    <td className="pr-6 py-2"><SkillTag action="add">Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag action="add" active>Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-6 py-2 text-muted-foreground font-medium">Save</td>
                    <td className="pr-6 py-2"><SkillTag action="save">Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag action="save" active>Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-6 py-2 text-muted-foreground font-medium">Endorse</td>
                    <td className="pr-6 py-2"><SkillTag action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag action="endorse" endorseCount={8} active>Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-6 py-2 text-muted-foreground font-medium">Highlighted + Save</td>
                    <td className="pr-6 py-2"><SkillTag variant="highlighted" action="save">Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag variant="highlighted" action="save" active>Time travel</SkillTag></td>
                  </tr>
                  <tr>
                    <td className="pr-6 py-2 text-muted-foreground font-medium">Highlighted + Endorse</td>
                    <td className="pr-6 py-2"><SkillTag variant="highlighted" action="endorse" endorseCount={8}>Time travel</SkillTag></td>
                    <td className="py-2"><SkillTag variant="highlighted" action="endorse" endorseCount={8} active>Time travel</SkillTag></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Block>

        <Block title="Stat Card" id="stat-card">
          <div className="flex w-full min-w-0 flex-col gap-8">
            {/* Outlined (default) */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Outlined{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">variant="outlined"</code>
              </p>
              <div className="flex flex-wrap items-start gap-4">
                <StatCard icon="person" label="Label" value={2} pct="5%" color="green" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="red" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="teal" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="blue" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="dark" size="lg" />
              </div>
            </div>

            {/* Filled */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Filled{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">variant="filled"</code>
              </p>
              <div className="flex flex-wrap items-start gap-4">
                <StatCard icon="person" label="Label" value={2} pct="5%" color="green" size="lg" variant="filled" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" variant="filled" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="red" size="lg" variant="filled" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="teal" size="lg" variant="filled" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="blue" size="lg" variant="filled" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="dark" size="lg" variant="filled" />
              </div>
            </div>

            {/* Ghost */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Ghost{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">variant="ghost"</code>
              </p>
              <div className="flex flex-wrap items-start gap-4">
                <StatCard icon="person" label="Label" value={2} pct="5%" color="green" size="lg" variant="ghost" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="red" size="lg" variant="ghost" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="blue" size="lg" variant="ghost" />
              </div>
            </div>

            {/* Icon badge */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Icon badge{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">iconBadge</code>
              </p>
              <div className="flex flex-wrap items-start gap-4">
                <StatCard icon="person" label="Alert" value={2} pct="5%" color="grey" size="lg" iconBadge="alert" />
                <StatCard icon="person" label="Success" value={2} pct="5%" color="grey" size="lg" iconBadge="success" />
                <StatCard icon="person" label="Info" value={2} pct="5%" color="grey" size="lg" iconBadge="info" />
                <StatCard icon="person" label="Alert" value={2} pct="5%" color="grey" size="md" iconBadge="alert" />
                <StatCard icon="person" label="Alert" value={2} pct="5%" color="grey" size="sm" iconBadge="alert" />
              </div>
            </div>

            {/* Sizes */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Sizes
              </p>
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col items-center gap-2">
                  <StatCard icon="person" label="Label" value={2} pct="5%" color="green" size="lg" />
                  <code className="text-[10px] text-muted-foreground">lg</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <StatCard icon="person" label="Label" value={2} pct="5%" color="green" size="md" />
                  <code className="text-[10px] text-muted-foreground">md</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <StatCard icon="person" label="Label" value={2} pct="5%" color="green" size="sm" />
                  <code className="text-[10px] text-muted-foreground">sm</code>
                </div>
              </div>
            </div>

            {/* Group */}
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Group{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">StatCardGroup</code>
              </p>
              <StatCardGroup size="lg">
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" />
                <StatCard icon="person" label="Label" value={2} pct="5%" color="grey" size="lg" />
              </StatCardGroup>
            </div>
          </div>
        </Block>

        <Block title="Object Cards" id="object-cards" plain>
          <p className="w-full text-sm text-muted-foreground">
            CourseObjectCard, ProjectObjectCard, PeopleObjectCard — Octuple DS Theme 2 (Figma).
          </p>

          <div className="w-full space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Course card · <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">bottomBar</code> variants
            </p>
            <div className="flex flex-wrap items-start gap-6">
              {/* completedBy */}
              <div className="flex flex-col items-center gap-2">
                <CourseObjectCard
                  course={{
                    title: 'Introduction to React',
                    provider: 'Acme Learning',
                    duration: '4h',
                    skills: ['React', 'JavaScript'],
                  }}
                  bottomBar={{
                    type: 'completedBy',
                    avatars: [
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face',
                    ],
                  }}
                  href="#"
                  renderFacepile={({ avatarUrls }: { avatarUrls: string[] }) => {
                    const display = avatarUrls.slice(0, 3)
                    const extra = avatarUrls.length - display.length
                    return (
                      <AvatarGroup>
                        {display.map((src: string, i: number) => (
                          <Avatar key={i}>
                            <AvatarImage src={src} alt="" />
                            <AvatarFallback>{String(i + 1)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {extra > 0 && <AvatarGroupCount>+{extra}</AvatarGroupCount>}
                      </AvatarGroup>
                    )
                  }}
                />
                <code className="text-[10px] text-muted-foreground">completedBy</code>
              </div>

              {/* openTo */}
              <div className="flex flex-col items-center gap-2">
                <CourseObjectCard
                  course={{
                    title: 'AI Prompt Engineering',
                    provider: 'Acme Learning',
                    duration: '2h',
                    skills: ['AI', 'Prompting'],
                  }}
                  bottomBar={{ type: 'openTo', items: ['mentoring', 'coffee'] }}
                  href="#"
                />
                <code className="text-[10px] text-muted-foreground">openTo</code>
              </div>

              {/* buttons */}
              <div className="flex flex-col items-center gap-2">
                <CourseObjectCard
                  course={{
                    title: 'Advanced TypeScript',
                    provider: 'Acme Learning',
                    duration: '6h',
                    skills: ['TypeScript', 'Node'],
                  }}
                  bottomBar={{
                    type: 'buttons',
                    children: (
                      <Button variant="outline" size="xs">Not started</Button>
                    ),
                  }}
                  href="#"
                />
                <code className="text-[10px] text-muted-foreground">buttons</code>
              </div>

              {/* none */}
              <div className="flex flex-col items-center gap-2">
                <CourseObjectCard
                  course={{
                    title: 'Data Visualization',
                    provider: 'Acme Learning',
                    duration: '3h',
                    skills: ['D3', 'Charts'],
                  }}
                  bottomBar={{ type: 'none' }}
                  href="#"
                />
                <code className="text-[10px] text-muted-foreground">none</code>
              </div>
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Project · People
            </p>
            <div className="flex flex-wrap items-start gap-6">
              <ProjectObjectCard
                project={{
                  title: 'Platform migration',
                  owner: 'Engineering',
                  status: '3 hrs/week',
                  skills: ['React', 'Node'],
                  projectManager: {
                    name: 'Jordan Lee',
                    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
                  },
                }}
                href="#"
                showBottomBar={false}
              />
              <PeopleObjectCard
                person={{
                  name: 'Jordan Lee',
                  title: 'Senior Engineer',
                  email: 'jordan.lee@example.com',
                  avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
                  openTo: 'mentoring',
                }}
                href="#"
                renderAvatar={({ src, alt, fallback }: { src: string; alt: string; fallback: string }) => (
                  <Avatar size="lg" className="people-object-card__avatar">
                    <AvatarImage src={src} alt={alt} />
                    <AvatarFallback>{fallback}</AvatarFallback>
                  </Avatar>
                )}
              />
            </div>
          </div>
        </Block>

        <Block title="Insight Cards" id="insight-cards" plain>
          <p className="w-full text-sm text-muted-foreground">
            InsightCard, MentorInsightCard — Learning path and mentor insight cards (Octuple DS Theme 2).
          </p>
          <div className="flex flex-wrap items-start gap-6">
            <InsightCard
              title="Learning path"
              badge="New"
              description="Build skills with curated courses."
              recommendedLabel="Recommended for you"
              icon="school"
              bgColor="#E8F4FD"
              iconBgColor="#B3D9FC"
              iconColor="#0B5B8A"
              buttonLabel="View path"
              buttonHref="#"
            >
              <span style={{ font: 'var(--typography-body3)', color: '#4F5666' }}>Slot content</span>
            </InsightCard>
            <MentorInsightCard
              mentor={{
                name: 'Sam Chen',
                role: 'Staff Engineer',
                avatarSrc: 'https://i.pravatar.cc/128?u=sam-chen',
                matchText: 'Skills match',
                matchCount: 3,
              }}
            />
          </div>
        </Block>

        <Block title="Checkbox">
          <div className="flex items-center gap-2">
            <Checkbox id="c1" />
            <Label htmlFor="c1">Accept terms</Label>
          </div>
        </Block>

        <Block title="Collapsible">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Toggle
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
              Collapsible content.
            </CollapsibleContent>
          </Collapsible>
        </Block>

        <Block title="Context Menu">
          <ContextMenu>
            <ContextMenuTrigger className="rounded-md border border-dashed p-4 text-sm">
              Right-click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Block>

        <Block title="Dialog">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>Dialog description.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => setOpen(false)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Block>

        <Block title="Dropdown Menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Block>

        <Block title="Navigation Menu">
          <div className="space-y-6 w-full">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Variant: underline</p>
              <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink href="#" active>Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground">
                          Components
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground">
                          Templates
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground">
                          Documentation
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                          View all products →
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">About</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Variant: pill</p>
              <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink href="#" active>Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground">
                          Components
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground">
                          Templates
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground">
                          Documentation
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="#" className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                          View all products →
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">About</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
            </div>
          </div>
        </Block>

        <Block title="Empty">
          <Empty className="border border-dashed py-8">
            <EmptyMedia />
            <EmptyHeader>
              <EmptyTitle>No items</EmptyTitle>
              <EmptyDescription>Add something to get started.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Block>

        <Block title="Hover Card">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost">Hover me</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">Hover card content.</HoverCardContent>
          </HoverCard>
        </Block>

        <Block title="Input">
          <div className="space-y-4 w-full">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes</p>
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Small</span>
                  <Input size="small" placeholder="Placeholder" className="w-48" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Medium</span>
                  <Input size="medium" placeholder="Placeholder" className="w-48" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Large</span>
                  <Input size="large" placeholder="Placeholder" className="w-48" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Disabled</span>
                  <Input size="medium" placeholder="Disabled" disabled className="w-48" />
                </div>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Kbd">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <Kbd>Enter</Kbd>
        </Block>

        <Block title="Pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Block>

        <Block title="Popover">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">Popover content.</PopoverContent>
          </Popover>
        </Block>

        <Block title="Product background" id="product-background" plain>
          <div className="flex w-full max-w-5xl flex-col gap-8">
            <p className="max-w-2xl text-xs text-muted-foreground">
              <strong className="font-medium text-foreground">Fill priority:</strong>{' '}
              <code className="rounded bg-muted px-1 font-mono text-[11px]">src</code> (photo) → else CH{' '}
              <code className="rounded bg-muted px-1 font-mono text-[11px]">chevronsVariant</code> → else token{' '}
              <strong className="text-foreground">gradient</strong> (
              <code className="rounded bg-muted px-1 font-mono text-[11px]">variant</code>).
            </p>

            <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4 shadow-sm">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                1 · Token gradients
              </h4>
              <p className="text-xs text-muted-foreground">
                No <code className="rounded bg-muted px-1 font-mono text-[10px]">src</code>, no{' '}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">chevronsVariant</code>.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <ProductBackground variant="talent-acquisition" className="min-h-32 rounded-lg border border-border">
                  <div className="flex min-h-32 flex-col justify-end p-5">
                    <p className="text-sm font-semibold text-foreground">Talent Acquisition</p>
                    <p className="text-xs text-muted-foreground">Blue token gradient</p>
                  </div>
                </ProductBackground>
                <ProductBackground variant="career-hub" className="min-h-32 rounded-lg border border-border">
                  <div className="flex min-h-32 flex-col justify-end p-5">
                    <p className="text-sm font-semibold text-foreground">Career Hub</p>
                    <p className="text-xs text-muted-foreground">Grey token gradient</p>
                  </div>
                </ProductBackground>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4 shadow-sm">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                2 · Career Hub chevrons
              </h4>
              <p className="text-xs text-muted-foreground">
                <code className="rounded bg-muted px-1 font-mono text-[10px]">chevronsVariant=&quot;default&quot;</code> (toolbar) ·{' '}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">&quot;profile&quot;</code> (hero).
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <ProductBackground
                  variant="career-hub"
                  chevronsVariant="default"
                  className="min-h-32 rounded-lg border border-border"
                >
                  <div className="flex min-h-32 flex-col justify-end p-5">
                    <p className="text-sm font-semibold text-foreground">Chevrons · default</p>
                    <p className="text-xs text-muted-foreground">292px art</p>
                  </div>
                </ProductBackground>
                <ProductBackground
                  variant="career-hub"
                  chevronsVariant="profile"
                  className="min-h-48 rounded-lg border border-border md:min-h-56"
                >
                  <div className="flex min-h-48 flex-col justify-end p-5 md:min-h-56">
                    <p className="text-sm font-semibold text-foreground">Chevrons · profile</p>
                    <p className="text-xs text-muted-foreground">540px art</p>
                  </div>
                </ProductBackground>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4 shadow-sm">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                3 · Hexagons
              </h4>
              <p className="text-xs text-muted-foreground">
                <code className="rounded bg-muted px-1 font-mono text-[10px]">hexagonsVariant=&quot;default&quot;</code> (toolbar) ·{' '}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">&quot;profile&quot;</code> (hero).
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <ProductBackground
                  variant="career-hub"
                  hexagonsVariant="default"
                  className="min-h-32 rounded-lg border border-border"
                >
                  <div className="flex min-h-32 flex-col justify-end p-5">
                    <p className="text-sm font-semibold text-foreground">Hexagons · default</p>
                    <p className="text-xs text-muted-foreground">292px art</p>
                  </div>
                </ProductBackground>
                <ProductBackground
                  variant="career-hub"
                  hexagonsVariant="profile"
                  className="min-h-48 rounded-lg border border-border md:min-h-56"
                >
                  <div className="flex min-h-48 flex-col justify-end p-5 md:min-h-56">
                    <p className="text-sm font-semibold text-foreground">Hexagons · profile</p>
                    <p className="text-xs text-muted-foreground">540px art</p>
                  </div>
                </ProductBackground>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4 shadow-sm">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                4 · Photo + scrim
              </h4>
              <p className="text-xs text-muted-foreground">
                <code className="rounded bg-muted px-1 font-mono text-[10px]">src</code> wins; optional{' '}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">imageScrim=&#123;false&#125;</code>.
              </p>
              <div className="grid gap-4">
                <ProductBackground
                  variant="talent-acquisition"
                  className="min-h-36 rounded-lg border border-border"
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
                >
                  <div className="flex min-h-36 flex-col justify-end p-5">
                    <p className="text-sm font-semibold text-foreground">TA + photo</p>
                  </div>
                </ProductBackground>
                <ProductBackground
                  variant="career-hub"
                  className="min-h-36 rounded-lg border border-border"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80"
                >
                  <div className="flex min-h-36 flex-col justify-end p-5">
                    <p className="text-sm font-semibold text-foreground">CH + photo</p>
                  </div>
                </ProductBackground>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Progress">
          <div className="flex w-full min-w-0 flex-col gap-6">
            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">value=&#123;60&#125;</code>
              </p>
              <Progress value={60} className="w-full" />
            </div>
            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">value=&#123;33&#125;</code>
                {' '}· <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">max=&#123;50&#125;</code>
              </p>
              <Progress value={33} max={50} className="w-full" />
            </div>
            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">value=&#123;72&#125;</code>
              </p>
              <Progress value={72} className="w-full" />
            </div>
            <div className="flex flex-wrap items-end gap-8">
              <div className="w-44 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">value=&#123;100&#125;</code>
                </p>
                <Progress value={100} className="w-full" />
              </div>
              <div className="w-44 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Indeterminate · omit <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">value</code>
                </p>
                <Progress className="w-full" />
              </div>
            </div>
          </div>
        </Block>

        <Block title="Stepper" id="stepper">
          <div className="flex w-full min-w-0 flex-col gap-10">
            {/* Indicator states */}
            <div className="w-full space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                Indicator states
              </p>
              <div className="flex flex-wrap items-end gap-10">
                <div className="flex flex-col items-center gap-2">
                  <StepperIndicator forceState="complete" />
                  <code className="text-[10px] text-muted-foreground">complete</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <StepperIndicator forceState="active" stepDisplay={2} />
                  <code className="text-[10px] text-muted-foreground">active</code>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <StepperIndicator forceState="upcoming" stepDisplay={3} />
                  <code className="text-[10px] text-muted-foreground">upcoming</code>
                </div>
              </div>
            </div>

            {/* Default */}
            <div className="w-full max-w-2xl space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Default
              </p>
              <Stepper value={1}>
                <StepperList>
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Account</StepperTitle>
                      <StepperDescription>Sign up</StepperDescription>
                    </StepperTrigger>
                  </StepperItem>
                  <StepperSeparator />
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Workspace</StepperTitle>
                      <StepperDescription>Set up team</StepperDescription>
                    </StepperTrigger>
                  </StepperItem>
                  <StepperSeparator />
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Done</StepperTitle>
                      <StepperDescription>Finish</StepperDescription>
                    </StepperTrigger>
                  </StepperItem>
                </StepperList>
              </Stepper>
            </div>

            {/* Small · right label */}
            <div className="w-full max-w-2xl space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Small · right label{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">size="sm"</code>
              </p>
              <Stepper value={1} size="sm">
                <StepperList>
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Assign</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                  <StepperSeparator />
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Scope</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                  <StepperSeparator />
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Channels</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                  <StepperSeparator />
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Review</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                </StepperList>
              </Stepper>
            </div>

            {/* Interactive */}
            <div className="w-full max-w-2xl space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                Interactive{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">onValueChange</code>
              </p>
              <Stepper value={stepperStep} onValueChange={setStepperStep}>
                <StepperList>
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Details</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                  <StepperSeparator />
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Review</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                  <StepperSeparator />
                  <StepperItem>
                    <StepperTrigger>
                      <StepperIndicator />
                      <StepperTitle>Submit</StepperTitle>
                    </StepperTrigger>
                  </StepperItem>
                </StepperList>
              </Stepper>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={stepperStep <= 0}
                  onClick={() => setStepperStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={stepperStep >= 2}
                  onClick={() => setStepperStep((s) => Math.min(2, s + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Radio Group">
          <RadioGroup defaultValue="a" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="a" id="r1" />
              <Label htmlFor="r1">Option A</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="b" id="r2" />
              <Label htmlFor="r2">Option B</Label>
            </div>
          </RadioGroup>
        </Block>

        <Block title="Resizable">
          <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
            <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
          </ResizablePanelGroup>
        </Block>

        <Block title="Scroll Area">
          <ScrollArea className="h-24 w-48 rounded-md border p-3">
            <p className="text-sm">
              Scroll area content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </ScrollArea>
        </Block>

        <Block title="Select">
          <div className="space-y-6 w-full">
            <p className="text-xs text-muted-foreground">Library. Same radius as Button.</p>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                    <SelectItem value="c">Option C</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Primary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                    <SelectItem value="c">Option C</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Secondary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                    <SelectItem value="c">Option C</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Outline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                    <SelectItem value="c">Option C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes</p>
              <div className="flex flex-wrap items-baseline gap-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Default</span>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Small</span>
                  <Select>
                    <SelectTrigger size="sm" className="w-[140px]">
                      <SelectValue placeholder="Small" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Separator">
          <div className="space-y-4 w-full">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Vertical</p>
              <div className="flex h-5 items-center gap-2">
                <span className="text-sm">One</span>
                <Separator orientation="vertical" />
                <span className="text-sm">Two</span>
                <Separator orientation="vertical" />
                <span className="text-sm">Three</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Horizontal</p>
              <Separator className="w-48" />
            </div>
          </div>
        </Block>

        <Block title="Sheet">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet title</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Sheet content.</p>
              </div>
            </SheetContent>
          </Sheet>
        </Block>

        <Block title="Skeleton">
          <div className="space-y-4 w-full">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Examples</p>
            <div className="flex flex-wrap items-end gap-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-20 w-48" />
              <Skeleton className="size-10 rounded-full" />
            </div>
          </div>
        </Block>

        <Block title="Slider">
          <div className="space-y-2 w-full">
            <p className="text-xs font-medium text-muted-foreground">Example</p>
            <div className="flex items-center gap-4">
              <Slider
                value={sliderVal}
                onValueChange={setSliderVal}
                max={100}
                step={1}
                className="w-48"
              />
              <span className="text-sm text-muted-foreground tabular-nums">{sliderVal[0]}%</span>
            </div>
          </div>
        </Block>

        <Block title="Switch">
          <div className="space-y-4 w-full">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">States</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="s1" />
                  <Label htmlFor="s1">Off</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="s2" defaultChecked />
                  <Label htmlFor="s2">On</Label>
                </div>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Table">
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Alex Chen</TableCell>
                  <TableCell className="text-muted-foreground">Engineer</TableCell>
                  <TableCell className="text-muted-foreground">Platform</TableCell>
                  <TableCell className="text-right text-muted-foreground">Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Maria Santos</TableCell>
                  <TableCell className="text-muted-foreground">Designer</TableCell>
                  <TableCell className="text-muted-foreground">Product</TableCell>
                  <TableCell className="text-right text-muted-foreground">Active</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Jordan Lee</TableCell>
                  <TableCell className="text-muted-foreground">Manager</TableCell>
                  <TableCell className="text-muted-foreground">People</TableCell>
                  <TableCell className="text-right text-muted-foreground">On leave</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Block>

        <Block title="Data Table" id="data-table">
          <div className="w-full space-y-4">
            {/* Sort */}
            <p className="text-xs font-medium text-muted-foreground">Sortable columns</p>
            <DataTable bordered>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHead
                    sortable
                    sorted={tableSort}
                    onSort={() => setTableSort(s => s === 'asc' ? 'desc' : s === 'desc' ? false : 'asc')}
                  >Department</DataTableHead>
                  <DataTableHead numeric sortable sorted={false} onSort={() => {}}>Headcount</DataTableHead>
                  <DataTableHead metric>AI Readiness</DataTableHead>
                  <DataTableHead>Status</DataTableHead>
                  <DataTableHead shrink>Actions</DataTableHead>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                <DataTableRow onClick={() => {}}>
                  <DataTableCell className="font-semibold">Engineering</DataTableCell>
                  <DataTableCell align="right" numeric>2,100</DataTableCell>
                  <DataTableCell metric>35%</DataTableCell>
                  <DataTableCell><Tag color="green" size="24">On track</Tag></DataTableCell>
                  <DataTableCell><Button variant="secondary" size="sm">View</Button></DataTableCell>
                </DataTableRow>
                <DataTableRow variant="warn" onClick={() => {}}>
                  <DataTableCell className="font-semibold">Sales</DataTableCell>
                  <DataTableCell align="right" numeric>1,240</DataTableCell>
                  <DataTableCell metric>12%</DataTableCell>
                  <DataTableCell><Tag color="red" size="24">Immediate action</Tag></DataTableCell>
                  <DataTableCell><Button variant="secondary" size="sm">View</Button></DataTableCell>
                </DataTableRow>
                <DataTableRow onClick={() => {}}>
                  <DataTableCell className="font-semibold">Marketing</DataTableCell>
                  <DataTableCell align="right" numeric>610</DataTableCell>
                  <DataTableCell metric>23%</DataTableCell>
                  <DataTableCell><Tag color="orange" size="24">Monitor closely</Tag></DataTableCell>
                  <DataTableCell><Button variant="secondary" size="sm">View</Button></DataTableCell>
                </DataTableRow>
              </DataTableBody>
            </DataTable>

            {/* Checkboxes */}
            <p className="text-xs font-medium text-muted-foreground">Row selection</p>
            <DataTable bordered>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHead className="w-10 px-4">
                    <input
                      type="checkbox"
                      role="checkbox"
                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                      checked={selectedRows.size === 3}
                      onChange={e => setSelectedRows(e.target.checked ? new Set(['eng','sales','mkt']) : new Set())}
                    />
                  </DataTableHead>
                  <DataTableHead>Department</DataTableHead>
                  <DataTableHead numeric>Headcount</DataTableHead>
                  <DataTableHead>Status</DataTableHead>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {([
                  { id: 'eng', dept: 'Engineering', headcount: '2,100', badge: <Tag color="green" size="24">On track</Tag> },
                  { id: 'sales', dept: 'Sales', headcount: '1,240', badge: <Tag color="red" size="24">Immediate action</Tag> },
                  { id: 'mkt', dept: 'Marketing', headcount: '610', badge: <Tag color="orange" size="24">Monitor closely</Tag> },
                ] as const).map(row => (
                  <DataTableRow
                    key={row.id}
                    onClick={() => setSelectedRows(s => { const n = new Set(s); n.has(row.id) ? n.delete(row.id) : n.add(row.id); return n })}
                    className={selectedRows.has(row.id) ? 'bg-muted/40' : ''}
                  >
                    <DataTableCell className="w-10 px-4">
                      <input
                        type="checkbox"
                        role="checkbox"
                        className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                        checked={selectedRows.has(row.id)}
                        onChange={() => {}}
                      />
                    </DataTableCell>
                    <DataTableCell className="font-semibold">{row.dept}</DataTableCell>
                    <DataTableCell align="right" numeric>{row.headcount}</DataTableCell>
                    <DataTableCell>{row.badge}</DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </div>
        </Block>

        <Block title="Tabs">
          <div className="space-y-6 w-full">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Variants</p>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted-foreground">Default (pill)</span>
                  <Tabs defaultValue="1" className="mt-1">
                    <TabsList>
                      <TabsTrigger value="1">Tab 1</TabsTrigger>
                      <TabsTrigger value="2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1" className="pt-2 text-sm">Content 1</TabsContent>
                    <TabsContent value="2" className="pt-2 text-sm">Content 2</TabsContent>
                  </Tabs>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">AI agent (pill)</span>
                  <Tabs defaultValue="1" className="mt-1">
                    <TabsList variant="ai-agent">
                      <TabsTrigger value="1">Tab 1</TabsTrigger>
                      <TabsTrigger value="2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1" className="pt-2 text-sm">Content 1</TabsContent>
                    <TabsContent value="2" className="pt-2 text-sm">Content 2</TabsContent>
                  </Tabs>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Line</span>
                  <Tabs defaultValue="a" className="mt-1">
                    <TabsList variant="line">
                      <TabsTrigger value="a">Tab A</TabsTrigger>
                      <TabsTrigger value="b">Tab B</TabsTrigger>
                      <TabsTrigger value="c">Tab C</TabsTrigger>
                    </TabsList>
                    <TabsContent value="a" className="pt-2 text-sm">Content A</TabsContent>
                    <TabsContent value="b" className="pt-2 text-sm">Content B</TabsContent>
                    <TabsContent value="c" className="pt-2 text-sm">Content C</TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Default (pill) with badge</p>
              <Tabs defaultValue="t1">
                <TabsList>
                  <TabsTrigger value="t1">Tab</TabsTrigger>
                  <TabsTrigger value="t2">Tab</TabsTrigger>
                  <TabsTrigger value="t3">Tab</TabsTrigger>
                  <TabsTrigger value="t4">Tab</TabsTrigger>
                  <TabsTrigger value="t5">Tab</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Line with icon and badge</p>
              <Tabs defaultValue="inbox">
                <TabsList variant="line">
                  <TabsTrigger value="inbox"><Inbox className="size-4" />Inbox</TabsTrigger>
                  <TabsTrigger value="docs"><FileText className="size-4" />Docs</TabsTrigger>
                  <TabsTrigger value="alerts"><Bell className="size-4" />Alerts</TabsTrigger>
                </TabsList>
                <TabsContent value="inbox" className="pt-2 text-sm">Inbox content</TabsContent>
                <TabsContent value="docs" className="pt-2 text-sm">Docs content</TabsContent>
                <TabsContent value="alerts" className="pt-2 text-sm">Alerts content</TabsContent>
              </Tabs>
            </div>
          </div>
        </Block>

        <Block title="Textarea">
          <Textarea placeholder="Placeholder" className="w-64 min-h-20" />
        </Block>

        <Block title="Toggle">
          <div className="space-y-4 w-full">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Variants</p>
              <div className="flex flex-wrap gap-2">
                <Toggle>Default</Toggle>
                <Toggle variant="outline">Outline</Toggle>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sizes</p>
              <div className="flex flex-wrap items-center gap-2">
                <Toggle size="default">Default</Toggle>
                <Toggle size="sm">Small</Toggle>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Toggle Group">
          <div className="space-y-4 w-full">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Example (single)</p>
            <ToggleGroup type="single">
              <ToggleGroupItem value="a">A</ToggleGroupItem>
              <ToggleGroupItem value="b">B</ToggleGroupItem>
              <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Block>

        <Block title="Tooltip">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip text</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Block>

        {/* ── InfoBar ───────────────────────────────────────────────────── */}
        <Block title="InfoBar" id="infobar">
          <div className="w-full space-y-3">
            <InfoBar variant="neutral"  message="Your draft was auto-saved." />
            <InfoBar variant="success"  message="Review submitted successfully." onClose={() => {}} />
            <InfoBar variant="warning"  message="Deadline in 2 days. Complete your review." onClose={() => {}} />
            <InfoBar variant="error"    message="We couldn't save your changes." actionLabel="Retry" onAction={() => {}} onClose={() => {}} />
            <InfoBar variant="ai-agent" message="AI matched 12 candidates to this role." onClose={() => {}} />
          </div>
        </Block>

        {/* ── MessageBar ────────────────────────────────────────────────── */}
        <Block title="MessageBar" id="messagebar">
          <div className="w-full space-y-3">
            <MessageBar variant="neutral" title="System update" description="A new version is available. Refresh to update." />
            <MessageBar variant="success" title="Import complete" description="842 records were imported successfully." onClose={() => {}} />
            <MessageBar variant="warning" title="Action required" description="Please review the updated policy before the deadline." actionLabel="Review" onAction={() => {}} onClose={() => {}} />
            <MessageBar variant="error"   title="Sync failed" description="Could not connect to your HRIS." actionLabel="Retry" onAction={() => {}} onClose={() => {}} />
          </div>
        </Block>

        {/* ── Snackbar ──────────────────────────────────────────────────── */}
        <Block title="Snackbar" id="snackbar">
          <div className="space-y-3 w-full">
            <div className="flex flex-wrap gap-3">
              <Snackbar variant="default" message="Profile updated." onClose={() => {}} />
              <Snackbar variant="success" message="Changes saved." onClose={() => {}} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Snackbar variant="warning" message="Export may take a while." onClose={() => {}} />
              <Snackbar variant="error"   message="Failed to export." actionLabel="Retry" onAction={() => {}} onClose={() => {}} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Snackbar size="small" message="Copied to clipboard." onClose={() => {}} />
            </div>
          </div>
        </Block>

        {/* ── Panel ─────────────────────────────────────────────────────── */}
        <Block title="Panel" id="panel">
          <PanelDemo />
        </Block>

        {/* ── Chip ──────────────────────────────────────────────────────── */}
        <Block title="Chip" id="chip">
          <div className="w-full space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Person chips (large)</p>
              <div className="flex flex-wrap gap-2">
                <Chip label="Sarah Chen" avatarInitials="SC" size="large" onRemove={() => {}} />
                <Chip label="David Park" avatarInitials="DP" size="large" variant="filled" />
                <Chip label="Engineering" size="large" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Medium</p>
              <div className="flex flex-wrap gap-2">
                <Chip label="Sarah Chen" avatarInitials="SC" size="medium" onRemove={() => {}} />
                <Chip label="David Park" avatarInitials="DP" size="medium" variant="filled" />
                <Chip label="Engineering" size="medium" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Small</p>
              <div className="flex flex-wrap gap-2">
                <Chip label="Sarah Chen" avatarInitials="SC" size="small" onRemove={() => {}} />
                <Chip label="David Park" avatarInitials="DP" size="small" variant="filled" />
              </div>
            </div>
          </div>
        </Block>

        {/* ── DateTimePicker ────────────────────────────────────────────── */}
        <Block title="DateTimePicker" id="datetimepicker">
          <DateTimePickerDemo />
        </Block>

        {/* ── SegmentedProgress ─────────────────────────────────────────── */}
        <Block title="SegmentedProgress" id="segmentedprogress">
          <div className="w-full space-y-5">
            <SegmentedProgress value={0} max={5} label="0 of 5 steps complete" />
            <SegmentedProgress value={2} max={5} />
            <SegmentedProgress value={3} max={5} />
            <SegmentedProgress value={5} max={5} label="All steps complete" />
            <SegmentedProgress value={4} max={8} />
          </div>
        </Block>

        {/* ── Timeline ──────────────────────────────────────────────────── */}
        <Block title="Timeline" id="timeline">
          <div className="w-full max-w-md">
            <Timeline>
              <TimelineItem title="Application submitted" timestamp="Mar 12, 2025" status="completed" description="Resume and cover letter received." />
              <TimelineItem title="Recruiter screen" timestamp="Mar 15, 2025" status="completed" description="30-min call with talent team." />
              <TimelineItem title="Technical interview" timestamp="Mar 20, 2025" status="current" description="Live coding session with the engineering team." />
              <TimelineItem title="Final round" status="upcoming" />
              <TimelineItem title="Offer" status="upcoming" />
            </Timeline>
          </div>
        </Block>

        {/* ── Uploader ──────────────────────────────────────────────────── */}
        <Block title="Uploader" id="uploader">
          <div className="w-full max-w-md space-y-4">
            <Uploader
              accept=".pdf,.doc,.docx"
              hint="PDF, DOC up to 10 MB"
              onFiles={() => {}}
            >
              <UploaderFileItem name="resume-2025.pdf" size="142 KB" status="success" onRemove={() => {}} />
              <UploaderFileItem name="cover-letter.docx" size="38 KB" status="uploading" progress={65} onRemove={() => {}} />
              <UploaderFileItem name="portfolio.pdf" status="error" errorMessage="File exceeds 10 MB limit." onRemove={() => {}} />
            </Uploader>
          </div>
        </Block>

        {/* ── FloatingActionButton ──────────────────────────────────────── */}
        <Block title="FloatingActionButton" id="floatingactionbutton">
          <div className="w-full space-y-6">
            <div>
              <p className="mb-3 text-xs font-medium text-muted-foreground">Variants</p>
              <div className="flex items-center gap-4">
                <FloatingActionButton icon={<span className="material-symbols-outlined">add</span>} aria-label="Add" variant="primary" />
                <FloatingActionButton icon={<span className="material-symbols-outlined">add</span>} aria-label="Add" variant="secondary" />
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium text-muted-foreground">Sizes</p>
              <div className="flex items-center gap-4">
                <FloatingActionButton icon={<span className="material-symbols-outlined">add</span>} aria-label="Add" size="default" />
                <FloatingActionButton icon={<span className="material-symbols-outlined">add</span>} aria-label="Add" size="small" />
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-medium text-muted-foreground">Extended (with label)</p>
              <div className="flex items-center gap-4">
                <FloatingActionButton icon={<span className="material-symbols-outlined">add</span>} label="Add candidate" variant="primary" />
                <FloatingActionButton icon={<span className="material-symbols-outlined">add</span>} label="Add candidate" variant="secondary" size="small" />
              </div>
            </div>
          </div>
        </Block>
      </div>
    </div>
  )
}

function PanelDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>Open Panel (medium)</Button>
      </div>
      <Panel
        open={open}
        onClose={() => setOpen(false)}
        title="Edit profile"
        subtitle="Update candidate information"
        width="medium"
        confirmLabel="Save changes"
        onConfirm={() => setOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job title</label>
            <Input placeholder="Senior Engineer" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Input placeholder="Engineering" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input placeholder="San Francisco, CA" />
          </div>
        </div>
      </Panel>
    </div>
  )
}

function DateTimePickerDemo() {
  const [date, setDate] = useState<Date | null>(null)
  const [dateTime, setDateTime] = useState<Date | null>(null)
  return (
    <div className="w-full max-w-xs space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Date only</p>
        <DateTimePicker value={date} onChange={setDate} placeholder="Select date" />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Date + time</p>
        <DateTimePicker value={dateTime} onChange={setDateTime} showTime placeholder="Select date and time" />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Large size</p>
        <DateTimePicker value={date} onChange={setDate} size="large" placeholder="Select date" />
      </div>
    </div>
  )
}
