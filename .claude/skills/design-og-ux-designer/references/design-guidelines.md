# Design Guidelines

**Purpose:** Official design principles and guidelines for using Octuple Design System  
**Status:** ✅ Complete  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Source:** Octuple Design System + Confluence Documentation

---

## 🎯 Design Principles

### 1. Consistency
Use Octuple components consistently across all experiences. Same patterns = lower cognitive load.

### 2. Clarity
Make interfaces clear and understandable. Avoid jargon. Use familiar patterns.

### 3. Accessibility
Design for everyone. Follow WCAG 2.1 AA standards. Support keyboard navigation and screen readers.

### 4. Efficiency
Help users accomplish tasks quickly. Reduce clicks. Provide shortcuts.

### 5. Feedback
Always provide clear feedback for user actions. Loading states, success messages, error handling.

---

## Typography

### Font Families

#### Primary Font: Poppins
- **Usage:** Body text, UI elements, buttons, forms, most content
- **Weights Available:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Characteristics:** Modern, geometric, highly legible, excellent for UI
- **Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

#### Secondary Font: Gilroy (Optional)
- **Usage:** Marketing content, hero sections, special emphasis
- **Weights Available:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold), 800 (Extra Bold)
- **Characteristics:** Geometric, modern, attention-grabbing
- **Note:** Use sparingly for high-impact areas only

#### Fallback Fonts
Always include system font fallbacks:
```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

---

### Font Sizes

| Size | Value | Line Height | Usage | Weight |
|------|-------|-------------|-------|--------|
| **Display** | 48px | 56px (1.167) | Hero headlines, landing pages | 700 (Bold) |
| **H1** | 36px | 44px (1.222) | Page titles, main headings | 600 (Semi-Bold) |
| **H2** | 28px | 36px (1.286) | Section headings | 600 (Semi-Bold) |
| **H3** | 24px | 32px (1.333) | Sub-section headings | 600 (Semi-Bold) |
| **H4** | 20px | 28px (1.4) | Card titles, group labels | 600 (Semi-Bold) |
| **H5** | 18px | 24px (1.333) | Minor headings | 500 (Medium) |
| **Body Large** | 16px | 24px (1.5) | Important content, lead paragraphs | 400 (Regular) |
| **Body** | 14px | 22px (1.571) | Default body text, UI labels | 400 (Regular) |
| **Body Small** | 12px | 18px (1.5) | Captions, helper text, timestamps | 400 (Regular) |
| **Caption** | 11px | 16px (1.455) | Fine print, legal text, metadata | 400 (Regular) |

**Examples:**
```css
/* Page Title */
h1 {
  font-size: 36px;
  line-height: 44px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Body Text */
p {
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #4a4a4a;
}

/* Small Text */
.caption {
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: #6a6a6a;
}
```

---

### Line Heights

| Context | Line Height | Ratio | When to Use |
|---------|-------------|-------|-------------|
| **Tight** | 1.2 | 120% | Headlines, page titles, short text |
| **Normal** | 1.5 | 150% | Body text, paragraphs, UI labels |
| **Relaxed** | 1.75 | 175% | Long-form content, articles, documentation |

**Best Practices:**
- **Headlines:** Use tight line height (1.2) for visual impact
- **Body Text:** Use normal line height (1.5) for readability
- **Long Content:** Use relaxed line height (1.75) for comfortable reading

---

### Font Weights

| Weight | Value | Usage | Examples |
|--------|-------|-------|----------|
| **Light** | 300 | Minimal use, large text only | Display text, marketing |
| **Regular** | 400 | Body text, default UI text | Paragraphs, form labels |
| **Medium** | 500 | Emphasis, active states | Active menu items, button text |
| **Semi-Bold** | 600 | Headings, important UI | H1-H4, tab labels, card titles |
| **Bold** | 700 | Strong emphasis, critical info | Alerts, display headings, CTAs |

**Weight Selection Guide:**
```
Regular (400)     → Default for all body text
Medium (500)      → Subtle emphasis, navigation
Semi-Bold (600)   → Headings, section titles
Bold (700)        → High emphasis, alerts
```

---

### Typography Best Practices

#### ✅ DO
- Use Poppins for all UI components
- Maintain consistent font sizes across similar elements
- Use appropriate line heights (1.5 for body, 1.2 for headings)
- Use Semi-Bold (600) for headings
- Provide sufficient contrast (4.5:1 minimum for body text)
- Limit font weights to 3-4 per page

#### ❌ DON'T
- Mix too many font families
- Use Light (300) weight for small text (< 16px)
- Use font sizes smaller than 11px
- Use all caps for long text (impacts readability)
- Use low contrast colors (#ccc text on white)
- Change font weights arbitrarily

---

## Spacing System

### Base Unit
- **Base:** 4px
- **Rationale:** All spacing uses multiples of 4px for visual harmony and consistency
- **Implementation:** Use multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Spacing Scale

| Token | Value | Usage | Examples |
|-------|-------|-------|----------|
| `xxs` | 4px | Minimal padding, icon spacing | Icon margins, checkbox label gap |
| `xs` | 8px | Compact spacing | Button padding (vertical), tight element gaps |
| `sm` | 12px | Small spacing | Form field vertical spacing |
| `md` | 16px | Default spacing | Button padding (horizontal), card padding |
| `lg` | 24px | Section spacing | Between form groups, card margins |
| `xl` | 32px | Large spacing | Between major sections |
| `2xl` | 48px | Extra large spacing | Between page sections |
| `3xl` | 64px | Massive spacing | Page top/bottom padding |

**Visual Scale:**
```
4px   ■
8px   ■■
12px  ■■■
16px  ■■■■
24px  ■■■■■■
32px  ■■■■■■■■
48px  ■■■■■■■■■■■■
```

---

### Component Spacing

#### Margins

| Context | Value | Usage |
|---------|-------|-------|
| **Between sections** | 48px (3xl) | Major page sections |
| **Between cards** | 24px (lg) | Card grids, lists |
| **Between form fields** | 16px (md) | Form.Item spacing |
| **Between buttons** | 8px (xs) | Button groups |
| **Between paragraphs** | 16px (md) | Text content |

**Example:**
```css
/* Section spacing */
section + section {
  margin-top: 48px;
}

/* Card grid */
.card {
  margin-bottom: 24px;
}

/* Form fields */
.form-item {
  margin-bottom: 16px;
}
```

#### Padding

| Element | Value | Notes |
|---------|-------|-------|
| **Card padding** | 24px | All sides |
| **Button padding** | 8px 16px | Vertical × Horizontal |
| **Button (small)** | 4px 12px | Compact buttons |
| **Button (large)** | 12px 24px | Prominent actions |
| **Input padding** | 8px 12px | TextInput, Select |
| **Container padding** | 24px | Page content containers |
| **Modal padding** | 24px | Modal body content |
| **Table cell** | 12px 16px | Table cells |

**Example:**
```css
/* Card */
.card {
  padding: 24px;
}

/* Button */
.button {
  padding: 8px 16px;
}

/* Input */
.input {
  padding: 8px 12px;
}
```

#### Gutters (Grid)

| Breakpoint | Gutter | Usage |
|------------|--------|-------|
| **Mobile** (< 768px) | 16px | Compact spacing for small screens |
| **Tablet** (768-1024px) | 24px | Comfortable spacing |
| **Desktop** (> 1024px) | 24px | Standard spacing |

**Example:**
```tsx
// Mobile
<Row gutter={16}>...</Row>

// Desktop
<Row gutter={24}>...</Row>

// Responsive gutter
<Row gutter={[16, 16]}>  // [horizontal, vertical]
  <Col xs={24} md={12}>...</Col>
</Row>
```

---

### Spacing Best Practices

#### ✅ DO
- Use multiples of 4px (4, 8, 12, 16, 24, 32, 48)
- Use 24px for card padding
- Use 16px for form field margins
- Use 48px between major sections
- Maintain consistent spacing for similar elements

#### ❌ DON'T
- Use arbitrary values (7px, 13px, 23px)
- Mix spacing systems (4px scale with 5px scale)
- Overcrowd content (< 8px between elements)
- Use excessive spacing (> 64px without reason)

---

## Color System

### Primary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Primary** | `#1890ff` | `24, 144, 255` | Primary buttons, links, focus states |
| **Primary Light** | `#40a9ff` | `64, 169, 255` | Hover states, backgrounds |
| **Primary Lighter** | `#91d5ff` | `145, 213, 255` | Subtle backgrounds |
| **Primary Lightest** | `#e6f7ff` | `230, 247, 255` | Very subtle backgrounds |
| **Primary Dark** | `#096dd9` | `9, 109, 217` | Active states, pressed buttons |
| **Primary Darker** | `#0050b3` | `0, 80, 179` | High contrast scenarios |

**Usage:**
```tsx
<Button variant={ButtonVariant.Primary} />  // Uses Primary color
```

---

### Semantic Colors

#### Success (Green)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Success** | `#52c41a` | `82, 196, 26` | Success messages, positive actions |
| **Success Light** | `#95de64` | `149, 222, 100` | Success backgrounds |
| **Success Lightest** | `#f6ffed` | `246, 255, 237` | Success background subtle |
| **Success Dark** | `#389e0d` | `56, 158, 13` | Success borders |

**Usage:**
- Form validation success
- Success notifications
- Positive trend indicators (↑)
- Confirmation messages

#### Error (Red)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Error** | `#ff4d4f` | `255, 77, 79` | Error messages, validation errors |
| **Error Light** | `#ff7875` | `255, 120, 117` | Error backgrounds |
| **Error Lightest** | `#fff1f0` | `255, 241, 240` | Error background subtle |
| **Error Dark** | `#cf1322` | `207, 19, 34` | Error borders |

**Usage:**
- Form validation errors
- Error notifications
- Destructive actions
- Alert messages

#### Warning (Orange)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Warning** | `#faad14` | `250, 173, 20` | Warning messages, caution states |
| **Warning Light** | `#ffc53d` | `255, 197, 61` | Warning backgrounds |
| **Warning Lightest** | `#fffbe6` | `255, 251, 230` | Warning background subtle |
| **Warning Dark** | `#d48806` | `212, 136, 6` | Warning borders |

**Usage:**
- Warning notifications
- Caution messages
- Pending states
- Important notices

#### Info (Blue)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Info** | `#1890ff` | `24, 144, 255` | Info messages, neutral information |
| **Info Light** | `#69c0ff` | `105, 192, 255` | Info backgrounds |
| **Info Lightest** | `#e6f7ff` | `230, 247, 255` | Info background subtle |
| **Info Dark** | `#0050b3` | `0, 80, 179` | Info borders |

**Usage:**
- Informational messages
- Help text
- System notifications
- Neutral alerts

---

### Neutral Colors (Grays)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Gray 50** | `#fafafa` | `250, 250, 250` | Page backgrounds, subtle fills |
| **Gray 100** | `#f5f5f5` | `245, 245, 245` | Card backgrounds, hover states |
| **Gray 200** | `#e8e8e8` | `232, 232, 232` | Borders, dividers |
| **Gray 300** | `#d9d9d9` | `217, 217, 217` | Disabled borders |
| **Gray 400** | `#bfbfbf` | `191, 191, 191` | Disabled text, placeholders |
| **Gray 500** | `#8c8c8c` | `140, 140, 140` | Secondary text, icons |
| **Gray 600** | `#595959` | `89, 89, 89` | Body text |
| **Gray 700** | `#434343` | `67, 67, 67` | Headings, emphasis |
| **Gray 800** | `#262626` | `38, 38, 38` | High contrast text |
| **Gray 900** | `#1a1a1a` | `26, 26, 26` | Maximum contrast, titles |

**Usage Guide:**
```
Gray 50-100   → Backgrounds
Gray 200-300  → Borders and dividers
Gray 400-500  → Disabled states, placeholders, secondary text
Gray 600-700  → Body text, headings
Gray 800-900  → High contrast text, important headings
```

---

### Text Colors

| Usage | Color | Hex | Contrast Ratio (on white) |
|-------|-------|-----|---------------------------|
| **Primary text** | Gray 900 | `#1a1a1a` | 15.8:1 (AAA) |
| **Body text** | Gray 600 | `#595959` | 7.5:1 (AAA) |
| **Secondary text** | Gray 500 | `#8c8c8c` | 4.7:1 (AA) |
| **Disabled text** | Gray 400 | `#bfbfbf` | 2.9:1 (Fail - decorative only) |
| **Link text** | Primary | `#1890ff` | 4.54:1 (AA) |
| **Link hover** | Primary Dark | `#096dd9` | 6.08:1 (AA) |
| **Error text** | Error | `#ff4d4f` | 4.03:1 (AA on 18px+) |
| **Success text** | Success Dark | `#389e0d` | 4.77:1 (AA) |

**Accessibility:**
- Primary text (Gray 900): AAA compliant (15.8:1)
- Body text (Gray 600): AAA compliant (7.5:1)
- Secondary text (Gray 500): AA compliant (4.7:1)
- Link text: AA compliant (4.54:1) - meets WCAG 2.1 Level AA

---

### Background Colors

| Usage | Color | Hex | Notes |
|-------|-------|-----|-------|
| **Page background** | White / Gray 50 | `#ffffff` / `#fafafa` | Default page background |
| **Card background** | White | `#ffffff` | Elevated surfaces |
| **Sidebar background** | Gray 100 | `#f5f5f5` | Navigation areas |
| **Input background** | White | `#ffffff` | Form fields |
| **Disabled background** | Gray 100 | `#f5f5f5` | Disabled elements |
| **Hover background** | Gray 50 | `#fafafa` | Interactive hover states |

---

### Color Usage Best Practices

#### ✅ DO
- Use semantic colors for their intended purpose (success = green, error = red)
- Maintain WCAG AA contrast ratios minimum (4.5:1 for text)
- Use Primary color for primary actions
- Use Gray scale for neutral UI elements
- Test color combinations for accessibility

#### ❌ DON'T
- Use red for positive actions (confusing)
- Use low contrast text (< 4.5:1)
- Use color as the only indicator (support with icons/text)
- Use too many colors (max 3-4 per view)
- Override semantic color meanings

---

## Iconography

### Icon Library

**Recommended:** Material Design Icons (MDI)  
**Source:** https://pictogrammers.com/library/mdi/  
**Package:** `@mdi/js` + `@mdi/react`  
**Total Icons:** 7,000+ icons available

**Installation:**
```bash
npm install @mdi/js @mdi/react
```

**Import:**
```tsx
import Icon from '@mdi/react';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';
```

---

### Icon Sizes

| Size | Value (MDI) | Pixels | Usage |
|------|-------------|--------|-------|
| **Extra Small** | 0.5 | 12px | Dense UIs, tight spaces |
| **Small** | 0.6 | 14.4px | Menu items, inline text |
| **Medium** | 0.8 | 19.2px | Buttons, form inputs, navigation |
| **Default** | 1.0 | 24px | Standard UI icons |
| **Large** | 1.2 | 28.8px | Prominent actions, feature icons |
| **Extra Large** | 1.5 | 36px | Hero sections, empty states |
| **Huge** | 2.0 | 48px | Marketing, landing pages |

**Example:**
```tsx
// Small icon in menu
<Icon path={mdiHome} size={0.6} />

// Default icon in button
<Icon path={mdiAccount} size={1} />

// Large icon for emphasis
<Icon path={mdiAlertCircle} size={1.5} />
```

---

### Icon Usage Guidelines

#### When to Use Icons

**✅ DO use icons for:**
- Navigation (home, settings, profile)
- Actions (edit, delete, add, search)
- Status indicators (success, error, warning)
- Visual categorization (file types, categories)
- Improving scannability
- Reinforcing text meaning

**❌ DON'T use icons for:**
- Replacing clear text without good reason
- Decorative purposes only (adds noise)
- Complex concepts better explained with text
- Situations where meaning is ambiguous

#### Icon + Text Patterns

**Leading Icon (Left):**
```tsx
<Button iconProps={{ path: mdiPlus as IconName }} text="Add Item" alignIcon="left" />
```
- **When to use:** Actions, navigation, emphasis
- **Common:** Menu items, primary actions, navigation buttons

**Trailing Icon (Right):**
```tsx
<Button iconProps={{ path: mdiChevronDown as IconName }} text="Options" alignIcon="right" />
```
- **When to use:** Dropdowns, external links, expanding actions
- **Common:** Dropdown triggers, "more" actions, accordions

**Icon Only:**
```tsx
<Button ariaLabel="Close" iconProps={{ path: mdiClose as IconName }} />
```
- **When to use:** Space-constrained UIs, universal icons (close, search, menu)
- **CRITICAL:** Always include `ariaLabel` for accessibility
- **Common:** Close buttons, navigation toggles, toolbars

---

### Icon Colors

| State | Color | Hex | Usage |
|-------|-------|-----|-------|
| **Default** | Gray 600 | `#595959` | Standard icons |
| **Interactive** | Primary | `#1890ff` | Clickable icons, links |
| **Interactive Hover** | Primary Dark | `#096dd9` | Hover state |
| **Disabled** | Gray 400 | `#bfbfbf` | Disabled icons |
| **Error** | Error | `#ff4d4f` | Error indicators |
| **Success** | Success | `#52c41a` | Success indicators |
| **Warning** | Warning | `#faad14` | Warning indicators |
| **White** | White | `#ffffff` | On dark backgrounds |

**Example:**
```tsx
// Default icon
<Icon path={mdiHome} size={1} color="#595959" />

// Interactive icon
<Icon path={mdiAccount} size={1} color="#1890ff" />

// Error icon
<Icon path={mdiAlert} size={1} color="#ff4d4f" />

// On dark background
<Icon path={mdiClose} size={1} color="#ffffff" />
```

---

### Common Icons Reference

| Purpose | MDI Icon | Path Import | Use Case |
|---------|----------|-------------|----------|
| **Home** | `mdiHome` | `@mdi/js` | Homepage, dashboard navigation |
| **User/Profile** | `mdiAccount` | `@mdi/js` | User menu, profile pages |
| **Settings** | `mdiCog` | `@mdi/js` | Settings pages, configuration |
| **Search** | `mdiMagnify` | `@mdi/js` | Search inputs, search actions |
| **Close** | `mdiClose` | `@mdi/js` | Modals, dialogs, dismissals |
| **Add** | `mdiPlus` | `@mdi/js` | Create actions, add items |
| **Edit** | `mdiPencil` | `@mdi/js` | Edit actions, modify content |
| **Delete** | `mdiDelete` | `@mdi/js` | Delete actions, remove items |
| **Save** | `mdiContentSave` | `@mdi/js` | Save actions, persist data |
| **Menu** | `mdiMenu` | `@mdi/js` | Navigation menu toggle |
| **Chevron Down** | `mdiChevronDown` | `@mdi/js` | Dropdowns, expand actions |
| **Chevron Right** | `mdiChevronRight` | `@mdi/js` | Navigation, next actions |
| **Arrow Left** | `mdiArrowLeft` | `@mdi/js` | Back navigation |
| **Arrow Right** | `mdiArrowRight` | `@mdi/js` | Forward, next steps |
| **Check** | `mdiCheck` | `@mdi/js` | Success, completion, selection |
| **Alert** | `mdiAlert` | `@mdi/js` | Warnings, important notices |
| **Information** | `mdiInformation` | `@mdi/js` | Info tooltips, help |
| **Email** | `mdiEmail` | `@mdi/js` | Email actions, contact |
| **Phone** | `mdiPhone` | `@mdi/js` | Phone actions, contact |
| **Calendar** | `mdiCalendar` | `@mdi/js` | Date pickers, scheduling |
| **Download** | `mdiDownload` | `@mdi/js` | Download actions, exports |
| **Upload** | `mdiUpload` | `@mdi/js` | Upload actions, imports |
| **Filter** | `mdiFilter` | `@mdi/js` | Filtering data, options |
| **Sort** | `mdiSort` | `@mdi/js` | Sorting data, ordering |
| **More Vertical** | `mdiDotsVertical` | `@mdi/js` | More options menu |
| **More Horizontal** | `mdiDotsHorizontal` | `@mdi/js` | More options menu |

**Quick Import:**
```tsx
import {
  mdiHome,
  mdiAccount,
  mdiCog,
  mdiMagnify,
  mdiClose,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiChevronDown,
  mdiCheck,
  mdiAlert,
} from '@mdi/js';
```

---

### Icon Best Practices

#### ✅ DO
- Use consistent icon sizes (0.6, 0.8, 1.0, 1.2)
- Cast icons to `IconName` type when using with Octuple
- Always add `ariaLabel` for icon-only buttons
- Use semantic colors (error = red, success = green)
- Align icon size with text size

#### ❌ DON'T
- Mix icon styles (don't mix MDI with other libraries)
- Use icons without labels in unfamiliar contexts
- Use overly decorative icons
- Use different icons for the same action
- Forget accessibility (aria-label, aria-hidden)

---

## Layout Principles

### Grid System

**Octuple uses a 12-column grid system** for flexible, responsive layouts.

**Key Features:**
- 12 columns (standard grid system)
- Responsive breakpoints: Large (>=1200px), Medium (>=900px), Small (>=600px), XSmall (>=0)
- Flexible gutters (24px default on desktop)
- Nested grids supported

**Why 24 Columns?**
- Divisible by 2, 3, 4, 6, 8, 12 (highly flexible)
- Supports common layouts: 50/50, 33/33/33, 25/25/25/25, 66/33, 75/25

---

### Column Spans

| Layout | Spans | Percentages | Use Case |
|--------|-------|-------------|----------|
| **Equal Halves** | 12 + 12 | 50% / 50% | Two equal columns |
| **Main + Sidebar** | 16 + 8 | 66.66% / 33.33% | Content + sidebar |
| **Wide + Narrow** | 18 + 6 | 75% / 25% | Emphasis on main content |
| **Equal Thirds** | 8 + 8 + 8 | 33.33% each | Three equal columns |
| **Equal Quarters** | 6 + 6 + 6 + 6 | 25% each | Four equal columns |
| **Feature + Details** | 14 + 10 | 58.33% / 41.67% | Feature with details |

**Examples:**
```tsx
// Two equal columns
<Row gutter={24}>
  <Col span={12}>Left</Col>
  <Col span={12}>Right</Col>
</Row>

// Main content + sidebar
<Row gutter={24}>
  <Col span={16}>Main Content</Col>
  <Col span={8}>Sidebar</Col>
</Row>

// Three equal columns
<Row gutter={24}>
  <Col span={8}>Column 1</Col>
  <Col span={8}>Column 2</Col>
  <Col span={8}>Column 3</Col>
</Row>
```

---

### Gutters (Spacing Between Columns)

| Gutter | Value | Usage |
|--------|-------|-------|
| **Tight** | 8px | Dense layouts, mobile |
| **Normal** | 16px | Standard spacing |
| **Comfortable** | 24px | Spacious layouts, desktop |
| **Wide** | 32px | Wide spacing, emphasis |

**Example:**
```tsx
<Row gutter={16}>  // Normal spacing
<Row gutter={24}>  // Comfortable spacing
<Row gutter={[16, 16]}>  // [horizontal, vertical]
```

---

### Responsive Breakpoints

| Breakpoint | Value | Device | Column Behavior |
|------------|-------|--------|-----------------|
| **xs** | < 576px | Mobile portrait | Stack to full width |
| **sm** | ≥ 576px | Mobile landscape | 2 columns max |
| **md** | ≥ 768px | Tablet | 2-3 columns |
| **lg** | ≥ 992px | Desktop | 3-4 columns |
| **xl** | ≥ 1200px | Large desktop | 4+ columns |
| **xxl** | ≥ 1600px | Wide screens | 6+ columns |

**Responsive Grid Example:**
```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    {/* 
      Mobile (xs): Full width (100%)
      Small (sm): Half width (50%)
      Medium (md): Third width (33.33%)
      Large (lg): Quarter width (25%)
    */}
    Content
  </Col>
</Row>
```

---

### Page Layouts

#### Single Column (Full Width)
**Usage:** Forms, articles, focused content  
**Max Width:** 100% or container max-width

```tsx
<Layout.Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
  <h1>Page Title</h1>
  <p>Content</p>
</Layout.Content>
```

#### Two Column (Main + Sidebar)
**Usage:** Dashboards, detail pages, settings  
**Split:** 16/8 (66.66% / 33.33%) or 18/6 (75% / 25%)

```tsx
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={16} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>
    Main Content
  </Col>
  <Col span={8} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>
    Sidebar
  </Col>
</Row>
```

⚠️ **CRITICAL:** Always add explicit flex styles to Row and Col for horizontal layout!

#### Three Column
**Usage:** Dashboards, galleries, feature comparison  
**Split:** 8/8/8 (equal thirds)

```tsx
<Row gutter={24}>
  <Col span={8}>Column 1</Col>
  <Col span={8}>Column 2</Col>
  <Col span={8}>Column 3</Col>
</Row>
```

#### With Sidebar Navigation
**Usage:** Application layouts, settings, admin panels  
**Split:** Fixed sidebar (240-280px) + Flexible content

```tsx
<Layout>
  <Layout.Aside width={240}>
    <Menu items={menuItems} />
  </Layout.Aside>
  <Layout>
    <Layout.Header>Header</Layout.Header>
    <Layout.Content>Content</Layout.Content>
  </Layout>
</Layout>
```

---

### Container Widths

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| **Mobile** (< 768px) | 100% | 16px |
| **Tablet** (768-1024px) | 100% | 24px |
| **Desktop** (> 1024px) | 1200px | 24px |
| **Wide** (> 1440px) | 1400px | 32px |

**Container Example:**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}
```

---

### Vertical Rhythm

**Maintain consistent vertical spacing for visual harmony.**

**Section Spacing:**
```
Page Title         → 48px margin-bottom
Section Heading    → 32px margin-top, 24px margin-bottom
Subsection Heading → 24px margin-top, 16px margin-bottom
Paragraph          → 16px margin-bottom
List Items         → 8px margin-bottom
```

**Example:**
```css
h1 {
  margin-bottom: 48px;
}

h2 {
  margin-top: 32px;
  margin-bottom: 24px;
}

p {
  margin-bottom: 16px;
}
```

---

## Responsive Design

### Breakpoints

```typescript
const breakpoints = {
  xs: '< 576px',      // Mobile portrait
  sm: '576px - 768px', // Mobile landscape
  md: '768px - 992px', // Tablet
  lg: '992px - 1200px', // Desktop
  xl: '1200px - 1600px', // Large desktop
  xxl: '> 1600px',     // Wide screens
};
```

**Media Query Example:**
```css
/* Mobile first */
.element {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 992px) {
  .element {
    padding: 32px;
  }
}
```

---

### Mobile-First Approach

**Design for mobile first, then enhance for larger screens.**

**Principles:**
1. Start with mobile layout (single column)
2. Add complexity as screen size increases
3. Use progressive enhancement
4. Test on real devices

**Example:**
```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} md={12} lg={8}>
    {/* 
      Mobile: Full width
      Tablet: Half width
      Desktop: Third width
    */}
  </Col>
</Row>
```

---

### Component Responsive Behavior

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Navigation** | Hamburger menu | Horizontal menu | Horizontal menu |
| **Tables** | Horizontal scroll | Horizontal scroll | Full display |
| **Forms** | Single column | Single/Two column | Two column |
| **Cards** | Stack (1 column) | Grid (2 columns) | Grid (3-4 columns) |
| **Sidebar** | Hidden/drawer | Collapsible | Fixed visible |
| **Modals** | Full screen | Centered | Centered |

---

## Elevation & Shadows

### Shadow Levels

| Level | CSS Shadow | Usage | Examples |
|-------|------------|-------|----------|
| **Level 0** | `none` | Flat surfaces, backgrounds | Page backgrounds |
| **Level 1** | `0 2px 8px rgba(0,0,0,0.08)` | Cards, panels | Cards, list items |
| **Level 2** | `0 4px 16px rgba(0,0,0,0.12)` | Elevated elements | Dropdowns, tooltips |
| **Level 3** | `0 8px 24px rgba(0,0,0,0.16)` | Floating elements | Modals, dialogs |
| **Level 4** | `0 12px 32px rgba(0,0,0,0.20)` | Overlays | Full-screen overlays |

**Example:**
```css
/* Card */
.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Dropdown */
.dropdown {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* Modal */
.modal {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}
```

---

## Border Radius

| Size | Value | Usage | Examples |
|------|-------|-------|----------|
| **None** | 0 | Sharp corners | Tables, specific designs |
| **Small** | 2px | Subtle rounding | Inputs, small buttons |
| **Medium** | 4px | Standard rounding | Buttons, cards, modals |
| **Large** | 8px | Prominent rounding | Large cards, panels |
| **XLarge** | 12px | Very rounded | Feature cards |
| **Circle** | 50% / 9999px | Circular | Avatars, icon buttons |
| **Pill** | 9999px | Pill-shaped | Pills, badges |

**Example:**
```css
/* Button */
.button {
  border-radius: 4px;
}

/* Card */
.card {
  border-radius: 4px;
}

/* Avatar */
.avatar {
  border-radius: 50%;
}

/* Pill */
.pill {
  border-radius: 9999px;
}
```

---

## Animation & Transitions

### Duration

| Speed | Value | Usage | Examples |
|-------|-------|-------|----------|
| **Instant** | 0ms | No animation | Immediate state changes |
| **Fast** | 150ms | Micro-interactions | Hover effects, focus |
| **Normal** | 250ms | Standard transitions | Modals, dropdowns |
| **Slow** | 350ms | Large movements | Drawers, page transitions |
| **Very Slow** | 500ms | Emphasis | Loading states |

**Example:**
```css
/* Button hover */
.button {
  transition: background-color 150ms ease-out;
}

/* Modal entrance */
.modal {
  transition: opacity 250ms ease-out, transform 250ms ease-out;
}

/* Drawer slide */
.drawer {
  transition: transform 350ms ease-in-out;
}
```

---

### Easing Functions

| Type | Function | Usage | Feel |
|------|----------|-------|------|
| **Linear** | `linear` | Progress bars | Constant speed |
| **Ease** | `ease` | General use | Starts slow, speeds up, slows down |
| **Ease-in** | `ease-in` | Exit animations | Starts slow, accelerates |
| **Ease-out** | `ease-out` | Entrance animations | Starts fast, decelerates |
| **Ease-in-out** | `ease-in-out` | State changes | Smooth start and end |

**Best Practices:**
- **Entrance:** Use `ease-out` (decelerating)
- **Exit:** Use `ease-in` (accelerating)
- **State Change:** Use `ease-in-out` (smooth)

**Example:**
```css
/* Hover (entrance) */
.button:hover {
  transform: scale(1.05);
  transition: transform 150ms ease-out;
}

/* Modal exit */
.modal.exiting {
  opacity: 0;
  transition: opacity 250ms ease-in;
}
```

---

### Animation Guidelines

#### ✅ DO
- Use animations to provide feedback
- Keep animations subtle (< 500ms)
- Use consistent durations throughout app
- Test performance on low-end devices
- Respect `prefers-reduced-motion` accessibility setting

#### ❌ DON'T
- Over-animate (distracting)
- Use long animations (> 500ms for UI)
- Animate on every interaction
- Ignore performance impact
- Forget accessibility considerations

**Accessibility:**
```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility

### WCAG 2.1 Compliance

**This design system follows WCAG 2.1 Level AA standards.**

**Key Requirements:**
- Color contrast ratios ≥ 4.5:1 for normal text
- Color contrast ratios ≥ 3:1 for large text (18px+)
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Alt text for images
- ARIA labels for interactive elements

**See:** `docs/accessibility.md` for complete guide

---

## Resources

### Documentation
- **Component Guides:** `docs/components/` - Detailed component APIs
- **Pattern Library:** `docs/patterns/` - Real-world UI patterns
- **Verified Examples:** `docs/verified-octuple-examples.md` - Tested code
- **AI Quick Reference:** `docs/ai-quick-reference.md` - Decision trees
- **Accessibility Guide:** `docs/accessibility.md` - WCAG 2.1 AA compliance

### External Resources
- **Octuple GitHub:** https://github.com/EightfoldAI/octuple
- **MDI Icon Library:** https://pictogrammers.com/library/mdi/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

## Quick Reference

### Common Values

**Spacing:** 4, 8, 12, 16, 24, 32, 48, 64  
**Font Sizes:** 11, 12, 14, 16, 18, 20, 24, 28, 36, 48  
**Font Weights:** 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)  
**Border Radius:** 2px (small), 4px (medium), 8px (large)  
**Shadows:** Level 1 (cards), Level 2 (dropdowns), Level 3 (modals)  
**Transitions:** 150ms (fast), 250ms (normal), 350ms (slow)  

---

**Last Updated:** November 20, 2024  
**Version:** 1.9.0  
**Status:** ✅ Complete and ready for use

For questions or contributions, see `docs/CONTRIBUTING-TO-DOCS.md`.
