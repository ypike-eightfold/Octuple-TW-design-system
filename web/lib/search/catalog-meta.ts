/**
 * Catalog page metadata shared between the rendered catalog (App.tsx)
 * and the search-index builder. Lives outside the component so the
 * Node-side indexer can import it without dragging in a React tree.
 *
 * If you add a new component / token section / document, edit it HERE.
 * The catalog UI re-exports from this module and the search index
 * picks it up automatically on the next request.
 */

/** Token page section ids — drive both the catalog sidebar and the
 *  in-page scroll targets inside TokensShowcase. */
export const TOKEN_SECTIONS = [
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'corner-radius', label: 'Corner radius' },
  { id: 'colors', label: 'Colors' },
  { id: 'semantic-colors', label: 'Semantic colors' },
  { id: 'palette', label: 'Palette' },
] as const;

/** Components rendered by UICatalog. The id slug = `ui-${kebab}` and
 *  must match the catalog's page-id convention. Bare labels are the
 *  human-readable names shown in the sidebar and search results. */
export const SHADCN_COMPONENTS = [
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
] as const;

/** Markdown documents served by the Documents sidebar section. Ids
 *  must match DOCUMENT_SOURCES in web/app/components/page.tsx. */
export const DOCUMENT_PAGES = [
  { id: 'content-design-standards', label: 'Content design standards' },
  { id: 'terms-list', label: 'Terms list' },
  { id: 'response-confidence-score', label: 'Response confidence score' },
  { id: 'guidance-layer', label: 'Guidance layer' },
  { id: 'oh-prompt-instructions', label: 'OH prompt instructions' },
  { id: 'oh-content-quality-framework', label: 'OH content quality framework' },
] as const;

/** Top-level catalog entries not driven by a list (the catalog has a
 *  couple of hand-authored landing pages too). */
export const STATIC_CATALOG_PAGES = [
  { id: 'navbar', label: 'Navbar', description: 'App shell with tabs, search, and avatar menu.' },
  { id: 'header', label: 'Header', description: 'Talent Acquisition & Career Hub variants — page bar below Navbar.' },
  { id: 'iconography', label: 'Iconography', description: 'Material Design Icons — browse the library and download the webfont.' },
  { id: 'illustration', label: 'Illustration', description: 'unDraw library plus the usage guidance for Octuple-style illustration.' },
] as const;

/** Workflow page sections — id matches the `id="…"` attribute on each
 *  `<h2>` in web/app/(site)/docs/workflow/page.tsx. Update both places
 *  together. */
export const WORKFLOW_SECTIONS = [
  { id: 'one-time-setup', label: 'One-time setup (10 minutes, once per laptop)' },
  { id: 'day-to-day', label: 'Day-to-day: designing something new' },
  { id: 'cheat-sheet', label: '"Just tell Claude" cheat sheet' },
  { id: 'how-to-prompt', label: 'How to prompt Claude' },
  { id: 'rules', label: 'The two rules you should not break' },
  { id: 'troubleshooting', label: 'When something goes wrong' },
] as const;

/** Slug helper matching the catalog's own `ui-${kebab}` convention. */
export function componentSlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}
