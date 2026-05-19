# 🚨 CRITICAL: AI Coding Rules for Octuple

**STOP! Read this FIRST before generating any code.**

---

## 🚨🚨🚨 LESSONS LEARNED FROM REAL PROJECTS 🚨🚨🚨

These mistakes were made repeatedly across 3 example pages. DO NOT REPEAT THEM.

### MISTAKE 1: Forcing Button Dimensions

**Problem:** Forcing `width`, `height`, `minWidth`, `borderRadius` on buttons breaks Octuple's internal sizing system (padding, icon sizes, text sizes).

```typescript
// ❌ WRONG - Breaks button sizing
<Button 
  iconProps={{ path: mdiPencil as unknown as IconName }}
  style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%' }}
/>

// ✅ CORRECT - Use ButtonShape.Round for circular icon-only buttons
import { Button, ButtonShape, ButtonSize } from '@eightfold.ai/octuple';

<Button
  iconProps={{ path: mdiPencil as unknown as IconName }}
  size={ButtonSize.Small}    // Small=28px, Medium=36px, Large=44px (automatic)
  shape={ButtonShape.Round}  // Makes it circular
  ariaLabel="Edit"           // Required for icon-only buttons
/>
```

**Button sizes in Octuple:**
- `ButtonSize.Small` = 28px height
- `ButtonSize.Medium` = 36px height
- `ButtonSize.Large` = 44px height

### MISTAKE 2: Using Emojis Instead of MDI Icons

**Problem:** Used 🏠, 📍, ⚙️ instead of proper MDI icons.

```typescript
// ❌ WRONG
<span>🏠 Home</span>
<span>📍 Santa Clara, CA</span>

// ✅ CORRECT
import Icon from '@mdi/react';
import { mdiHome, mdiMapMarkerOutline } from '@mdi/js';

<Icon path={mdiHome} size={0.8} />
<Icon path={mdiMapMarkerOutline} size={0.8} />
```

**Find icons at:** https://pictogrammers.com/library/mdi/

### MISTAKE 3: Creating Custom Components When Octuple Has Them

**Problem:** Created custom toggles, skill tags, and tabs instead of using Octuple's.

```typescript
// ❌ WRONG - Custom toggle
<div className="toggle" onClick={() => setOn(!on)}>
  <div className={on ? 'on' : 'off'} />
</div>

// ✅ CORRECT - Octuple CheckBox with toggle prop
import { CheckBox } from '@eightfold.ai/octuple';
<CheckBox toggle checked={on} onChange={(e) => setOn(e.target.checked)} label="Open to mentoring" />

// ❌ WRONG - Custom skill tag
<div style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}>
  Machine Learning
</div>

// ✅ CORRECT - Octuple SkillTag
import { SkillTag } from '@eightfold.ai/octuple';
<SkillTag label="Machine Learning" />
```

### MISTAKE 4: Not Applying Gilroy Font

**Problem:** Octuple components use their own fonts. Need CSS override.

**Solution in `src/index.css`:**
```css
/* Force Gilroy font in all Octuple components */
* {
  font-family: 'Gilroy', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
}

[class*="octuple"],
[class*="module_"],
[class*="-module_"] {
  font-family: 'Gilroy', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
}
```

### MISTAKE 5: Tab Indicator Outside Header

**Problem:** In 80px headers, tab indicator appears below the header instead of inside.

**Solution in `src/index.css`:**
```css
/* Position tab indicator at bottom of header */
header [class*="tabs-module_tab-indicator"] {
  bottom: 0 !important;
  top: auto !important;
  position: absolute !important;
}

/* Ensure tabs container fills header height */
header [class*="tabs-module_tabs"],
header [class*="tabs-module_tab-wrap"] {
  height: 80px !important;
  position: relative;
}
```

### MISTAKE 6: Cards Not Taking Full Width

**Problem:** Octuple Cards have internal max-width constraints.

**Solution in `src/index.css`:**
```css
/* Force Octuple Cards to be full width */
[class*="card-module_card"] {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: unset !important;
}
```

### MISTAKE 7: Row/Col Not Displaying Horizontally

**Problem:** Octuple Row/Col doesn't use flexbox by default.

```typescript
// ❌ WRONG - Columns stack vertically
<Row gutter={24}>
  <Col span={18}>Left</Col>
  <Col span={6}>Right</Col>
</Row>

// ✅ CORRECT - Add explicit display: flex
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={18} style={{ flex: '0 0 75%', maxWidth: '75%' }}>Left</Col>
  <Col span={6} style={{ flex: '0 0 25%', maxWidth: '25%' }}>Right</Col>
</Row>
```

### MISTAKE 8: TextInput Icon Positioning with iconProps

**Problem:** Using `iconProps` and `alignIcon` on TextInput doesn't reliably position the icon inside the field - the icon appears outside/below the input.

```typescript
// ❌ WRONG - Icon appears outside the TextInput
<TextInput
  placeholder="Search"
  iconProps={{ path: mdiMagnify as IconName }}
  alignIcon={TextInputIconAlign.Left}
/>

// ✅ CORRECT - Use wrapper with absolute positioning
<div style={{ position: 'relative', width: '280px' }}>
  <Icon 
    path={mdiMagnify} 
    size={0.8} 
    style={{ 
      position: 'absolute', 
      left: '12px', 
      top: '50%', 
      transform: 'translateY(-50%)', 
      color: '#8c8c8c',
      pointerEvents: 'none',
      zIndex: 1,
    }} 
  />
  <TextInput
    placeholder="Search"
    style={{ width: '100%', paddingLeft: '36px' }}
  />
</div>
```

### MISTAKE 9: Row/Col Spreading Items Across Full Width

**Problem:** Using Row/Col for search fields spreads them across the page instead of keeping them together.

```typescript
// ❌ WRONG - Search fields spread across full width
<Row gutter={16}>
  <Col md={8}><TextInput placeholder="Search People" /></Col>
  <Col md={8}><TextInput placeholder="Location" /></Col>
  <Col md={8}><Button text="Go" /></Col>
</Row>

// ✅ CORRECT - Use simple flexbox for grouped items
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <TextInput placeholder="Search People" style={{ width: '280px' }} />
  <TextInput placeholder="Location" style={{ width: '280px' }} />
  <Button text="Go" />
</div>
```

**When to use Row/Col vs Flexbox:**
- **Row/Col**: Full-width responsive grid layouts (e.g., two-column page layouts)
- **Flexbox**: Grouped items that should stay together (e.g., search bars, button groups)

### MISTAKE 10: Card Layout Structure

**Problem:** Avatar, Name/Title, and action icons placed in wrong positions.

**Correct structure for person/profile cards:**

```typescript
<Card style={{ padding: '20px' }}>
  <div style={{ display: 'flex', gap: '20px' }}>
    {/* LEFT SECTION: Avatar + Info + Buttons */}
    <div style={{ minWidth: '320px' }}>
      {/* Top row: Avatar + Name/Title + Action Icons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Avatar size="48px">{initials}</Avatar>
        <div style={{ flex: 1 }}>
          <h3>Name</h3>
          <p>Title • Department</p>
          <p>email@example.com</p>
        </div>
        {/* Action icons at TOP RIGHT */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Icon path={mdiSitemap} size={0.8} />
          <Icon path={mdiBookmarkOutline} size={0.8} />
        </div>
      </div>
      
      {/* Buttons below info */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button text="Ask" iconProps={{ path: mdiCommentOutline }} />
        <Button text="Request" iconProps={{ path: mdiLinkVariant }} />
      </div>
      
      {/* Open to badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <span>Open to</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF7E6' }}>
          <Icon path={mdiCoffee} />
        </div>
      </div>
    </div>
    
    {/* VERTICAL DIVIDER */}
    <div style={{ width: '1px', backgroundColor: '#e8e8e8', alignSelf: 'stretch' }} />
    
    {/* RIGHT SECTION: Info items horizontal with wrap */}
    <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '16px 32px' }}>
      {/* Manager, Business Unit, Location, Mentoring, etc. */}
    </div>
  </div>
</Card>
```

### MISTAKE 11: Using Wrong Icons

**Problem:** Used `mdiDomain` (building) instead of `mdiSitemap` (org chart).

**Correct icon choices:**
```typescript
import { 
  mdiSitemap,           // ✅ Org chart button (NOT mdiDomain)
  mdiBookmarkOutline,   // ✅ Save/bookmark
  mdiCommentOutline,    // ✅ Ask/chat buttons
  mdiLinkVariant,       // ✅ Request/connect buttons
  mdiMapMarkerOutline,  // ✅ Location
  mdiCoffee,            // ✅ Coffee chat badge
  mdiAccountMultiple,   // ✅ Mentoring/peers
} from '@mdi/js';
```

---

## 🔍 Rule #0: ALWAYS Check TypeScript Types - NEVER Guess Props

**BEFORE using ANY component for the first time:**

1. ✅ Read the actual TypeScript definition files in `node_modules/@eightfold.ai/octuple/lib/components/[Component]/[Component].types.d.ts`
2. ✅ Verify props exist in the actual interface
3. ✅ Check prop types (string vs enum, required vs optional)
4. ✅ Look for `iconProps`, NOT `icon` prop directly in many components

**How to check:**
```bash
# Find type definition
cat node_modules/@eightfold.ai/octuple/lib/components/Menu/Menu.types.d.ts

# Check what props are available
grep "export interface MenuProps" -A 50 [file]
```

**Common mistakes from guessing:**
- ❌ Assuming `<Menu.Item>` children pattern (uses `items` array)
- ❌ Assuming `items` array for Tabs (uses `<Tab>` children)
- ❌ Using `size="large"` on Avatar (uses `size="80px"`)
- ❌ Using `icon` prop directly (many use `iconProps={{ path: mdiIcon }}`)
- ❌ Using Row/Col without explicit flex styles (columns stack vertically instead of horizontally)

## 🎨 Rule #1: ALWAYS Use MDI Icons - NEVER Emojis

**Icons must come from Material Design Icons: https://pictogrammers.com/library/mdi/**

```tsx
// ✅ CORRECT - Use MDI Icons
import Icon from '@mdi/react';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';

<Icon path={mdiHome} size={0.8} />
<Icon path={mdiAccount} size={1} color="#1890ff" />
```

```tsx
// ❌ WRONG - Never use emojis
<span>🏠 Home</span>
<div>👤 Account</div>
```

**Why:** Emojis look unprofessional and inconsistent across platforms. MDI icons are part of the design system.

**Installation:** Already included in package.json:
```bash
npm install @mdi/js @mdi/react
```

## 📐 Rule #2: Study Wireframes CAREFULLY - Check Layout Structure

**Before coding, VERIFY:**
1. ✅ **Column layout** - Which side is content? Which is sidebar?
2. ✅ **Full width sections** - Does candidate header span full width?
3. ✅ **Spacing** - Are cards cramped or full-width?
4. ✅ **Sidebar visibility** - Can you see menu items clearly?

**Common mistakes:**
- ❌ Putting evaluations on LEFT instead of RIGHT
- ❌ Cramming candidate info into left column instead of FULL WIDTH
- ❌ Sidebar menu items invisible (missing styling)
- ❌ Content not filling available space
- ❌ **Row/Col stacking vertically instead of horizontally** (missing flex styles)

### 🚨 CRITICAL: Row/Col Layout Gotcha

**Octuple's Row/Col components REQUIRE explicit flex styling to display side-by-side:**

```tsx
// ❌ WRONG - Columns will stack vertically
<Row gutter={24}>
  <Col span={16}>Content</Col>
  <Col span={8}>Sidebar</Col>
</Row>

// ✅ CORRECT - Columns display side-by-side
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={16} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>
    Content
  </Col>
  <Col span={8} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>
    Sidebar
  </Col>
</Row>
```

**Why this matters:**
- Without flex styles, columns stack vertically (evaluations appear BELOW instead of RIGHT)
- `span` prop alone is not enough for horizontal layout
- Must explicitly set `display: 'flex'` on Row
- Must explicitly set flex sizing on each Col

## 🧪 Rule #3: Test New Components in ComponentPlayground FIRST

**BEFORE using a component for the first time:**

1. ✅ Test it in `src/pages/ComponentPlayground.tsx` 
2. ✅ Verify props work correctly
3. ✅ Document working pattern in `docs/verified-octuple-examples.md`
4. ✅ THEN use in production code

**Example: Tabs component caused blank page because API wasn't tested first!**

```tsx
// In ComponentPlayground.tsx
import { Tabs } from '@eightfold.ai/octuple';

// Test different prop combinations here
// Once working, document in verified-octuple-examples.md
```

## ⚠️ Component Verification Required

Before using ANY component, **VERIFY IT EXISTS** in Octuple:

```bash
npm run verify-components
```

Or check: `docs/octuple-api-reference.md` (auto-generated from actual package)

## 🎯 Verified Component Names

### ✅ CORRECT Names (Use These)
- `Layout` (with `Aside`, `Header`, `Content`, `Footer`, `Nav`, `Article`, `Section`)
- `TextInput` (NOT "Input")
- `TextArea` (NOT "Input.TextArea")
- `Badge` (NOT "Tag")
- `Pill` (alternative to Badge)
- `CheckBox` (NOT "Checkbox")
- `RadioButton` (NOT "Radio")
- `Stepper` (for progress/steps)
- `Breadcrumb`
- `Menu`
- `Button`
- `Card`
- `Row` and `Col` (for grid)
- `Avatar`
- `Modal`
- `Dialog`
- `Drawer`
- `Dropdown`
- `Form` (with `Form.Item`, `Form.useForm`)
- `Table`
- `Tabs`
- `Pagination`
- `Spinner`

### ❌ WRONG Names (Do NOT Use)
- ❌ `Input` → Use `TextInput`
- ❌ `Input.TextArea` → Use `TextArea`
- ❌ `Tag` → Use `Badge` or `Pill`
- ❌ `Sider` → Use `Layout.Aside`
- ❌ `Checkbox` → Use `CheckBox`
- ❌ `Radio` → Use `RadioButton`

### ✅ VERIFIED Component APIs

**Menu Component:**
- ✅ Uses `items` prop array (NOT `Menu.Item` children)
- ✅ DOES support icons via `iconProps: { path: mdiIcon }`
- ✅ Each item: `{ key, text, value, iconProps, active, onClick }`
- ❌ Does NOT support `Menu.Item` children pattern
- ❌ Will throw "Cannot read properties of undefined (reading 'map')" if using Menu.Item

**Tabs Component:**
- ✅ Uses children `<Tab>` components (NOT items array)
- ✅ Each Tab: `<Tab value="id" label="Label" icon={mdiIcon} />`
- ✅ Tabs wrapper: `<Tabs activeValue={value} onChange={handler}>`
- ❌ Does NOT use `items` prop like Ant Design

**Avatar Component:**
- ✅ `size` is a STRING ('32px', '80px'), NOT enum ('small', 'large')
- ✅ `type`: 'round' | 'square'
- ✅ Supports: children (initials), `src` (image), `iconProps` (icon)

**Button Component:**
- ✅ `text` prop for label (NOT children for text)
- ✅ `iconProps: { path: mdiIcon }` for icons
- ✅ `variant`: 'primary' | 'default' | 'neutral' | 'secondary' | 'systemui'
- ✅ `alignIcon`: 'left' | 'right'

**Stepper Component:**
- ⚠️ API structure needs verification in ComponentPlayground  
- Test before using in production

## 📋 Layout Structure

**CORRECT Layout Pattern:**
```tsx
import { Layout } from '@eightfold.ai/octuple';

const { Header, Aside, Content, Footer } = Layout;

<Layout>
  <Aside width={240}>Sidebar</Aside>
  <Layout>
    <Header>Header</Header>
    <Content>Main Content</Content>
    <Footer>Footer</Footer>
  </Layout>
</Layout>
```

## 🎨 Required Fonts

**Always include Poppins** (or Gilroy if available):

In `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
</style>
```

## 🔧 How to Avoid Mistakes

### 1. Before Coding
Run: `npm run verify-components` to see all available components

### 2. Check Documentation
- `docs/octuple-api-reference.md` - Auto-generated list
- `docs/design-system-ai.md` - Usage patterns (but verify component names!)

### 3. When Unsure
**Test in a separate file first:**
```tsx
import { ComponentName } from '@eightfold.ai/octuple';
// If this import fails, the component doesn't exist
```

## 📝 Improved Prompt Pattern

### Good Prompt Structure:
```
Using Octuple components (verify from @docs/octuple-api-reference.md), create [FEATURE].

Requirements:
- Component 1: [specific Octuple component name]
- Component 2: [specific Octuple component name]
- Layout: Use Layout with Aside, Header, Content
- Fonts: Poppins
- Grid: Use Row and Col (12-column system)

[Detailed requirements...]

IMPORTANT: Verify all component names exist in Octuple before using.
```

### What to Specify:
1. **Exact component names** (if you know them)
2. **Layout structure** (sidebar, header, content areas)
3. **Font requirements** (Poppins, Gilroy)
4. **Grid layout** (Row/Col spans)
5. **Visual hierarchy** (breadcrumb position, button placement)

## 🚫 Common Mistakes

1. **Using generic names** → Always check actual Octuple exports
2. **Assuming component structure** → Octuple uses `Aside` not `Sider`
3. **Skipping font setup** → Include Poppins explicitly
4. **Not using Stepper** → Use it for progress indicators
5. **Wrong import patterns** → `TextInput` not `Input`

## ✅ Quality Checklist

Before considering code complete:
- [ ] All components verified in `octuple-api-reference.md`
- [ ] Poppins font included in HTML
- [ ] Layout uses `Aside` not `Sider`
- [ ] Form inputs use `TextInput` and `TextArea`
- [ ] No `Tag` component (use `Badge` or `Pill`)
- [ ] Breadcrumb above page title
- [ ] Action buttons in correct position
- [ ] Used `Stepper` for progress
- [ ] Grid system (Row/Col) for layout

## 🔄 Regenerate Component List

After Octuple updates:
```bash
npm run extract-apis
```

This updates `docs/octuple-api-reference.md` with current components.

---

**Remember:** When in doubt, check the actual package exports first!

