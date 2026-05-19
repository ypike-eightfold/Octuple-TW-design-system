# AI Learnings Log

This is a living document that AI coding agents read and update as they work with the Octuple Design System. It captures lessons learned, component quirks, and successful patterns to improve code generation over time.

---

## How This Works

### For AI Agents
1. **Read this file** at the start of every coding session
2. **Update this file** when you:
   - Fix a bug or mistake you made
   - Discover unexpected component behavior
   - Find a pattern that works particularly well
   - User explicitly says "remember this" or "save this for next time"
3. **Check relevant sections** before implementing similar features

### For Users
- Say "remember this" after AI learns something to ensure it's documented
- Review entries periodically to validate they're still accurate
- Remove outdated entries when Octuple updates break old patterns

---

## Entry Format

When adding entries, use this format:

```markdown
### [Brief Title]
**Date:** YYYY-MM-DD
**Context:** What were you trying to do?
**Problem:** What went wrong or what was discovered?
**Solution:** What's the correct approach?
**Code Example:** (if applicable)
```

---

## Lessons Learned

<!-- AI: Add new lessons here. Most recent at the top. -->

### AVOID SearchBox - Use TextInput with iconProps Instead
**Date:** 2024-12-16
**Context:** SearchBox component icon appearing outside the input field
**Problem:** The SearchBox component has persistent icon alignment issues. The search icon appears OUTSIDE the input field border instead of inside. Multiple CSS override attempts failed - the SearchBox uses an icon-button that is extremely difficult to position correctly via CSS.
**Solution:** **DO NOT USE SearchBox**. Instead, use `TextInput` with `iconProps` and `alignIcon`:

```typescript
// ❌ WRONG - SearchBox has icon positioning issues
<SearchBox
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

// ✅ CORRECT - Use TextInput with iconProps
import { TextInput, TextInputIconAlign, IconName } from '@eightfold.ai/octuple';
import { mdiMagnify } from '@mdi/js';

<TextInput
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  iconProps={{ path: mdiMagnify as IconName }}
  alignIcon={TextInputIconAlign.Left}
  clearable
/>
```

**Key Learning:** 
1. SearchBox has a bug where the icon-button is positioned outside the input field
2. CSS overrides do NOT reliably fix this issue
3. TextInput with `iconProps` and `alignIcon={TextInputIconAlign.Left}` works correctly
4. See working example in `src/pages/TalentManagement/People/PeoplePage.tsx`

---

### Grid is 12-Column, NOT 24-Column - CRITICAL
**Date:** 2024-12-11
**Context:** Documenting Row/Col grid system
**Problem:** Incorrectly documented Octuple as having a "24-column grid system"
**Solution:** Octuple uses a **12-column grid system**. Span values should be 1-12, not 1-24.

| Breakpoint | Min Width | Grid Columns |
|------------|-----------|--------------|
| Large | >= 1200px | 12 columns, 24px gutter |
| Medium | >= 900px | 12 columns |
| Small | >= 600px | Adapts |
| XSmall | >= 0 | Mobile |

---

### Use SearchBox for Search Inputs - NOT TextInput Workarounds
**Date:** 2024-12-11
**Context:** Creating search input fields
**Problem:** Was using TextInput with manual icon positioning workarounds
**Solution:** Use the `SearchBox` component which extends TextInput and has proper icon support built-in.

```typescript
// ✅ Correct - Use SearchBox
import { SearchBox } from '@eightfold.ai/octuple';

<SearchBox
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  waitInterval={300}
  clearable={true}
  ariaLabel="Search"
/>
```

SearchBox is wrapped in a `<form>` element with search role for proper semantics.

---

### Pill Color Semantics - Status Indicators
**Date:** 2024-12-11
**Context:** Using Pill component themes for status indication
**Problem:** Did not document the semantic meaning of Pill colors
**Solution:** Use these color themes to convey meaning:

| Theme | Semantic Meaning | Use For |
|-------|------------------|---------|
| `green` | Ongoing / In Progress | Active tasks, current status |
| `orange` | Warning | Attention needed, pending items |
| `red` | Error | Failed items, errors, critical issues |
| `blue` | Success | Completed items, positive outcomes |

---

### Button Variant Descriptions - CRITICAL
**Date:** 2024-12-11
**Context:** Documenting Button component variants in documentation files
**Problem:** Incorrectly described variant purposes (e.g., said Default was for "secondary actions", Neutral was "link-style")
**Solution:** Use the correct Octuple design language for each variant:

| Variant | Correct Description |
|---------|---------------------|
| **Primary** | Emphasized button for primary actions (one per screen recommended) |
| **Secondary** | Second level emphasized button for secondary actions |
| **Default** | Themed button which is a variant of tertiary actions |
| **Neutral** | Light gray background button that is subtle enough to place anywhere. This is our tertiary button. |
| **SystemUI** | White background button over white background to give the least emphasized actions |

**Key Insight:** The emphasis hierarchy is: Primary > Secondary > Default/Neutral > SystemUI (least)

---

### Example Entry (Template)
**Date:** 2024-01-01
**Context:** Creating a toggle switch for settings
**Problem:** Created a custom toggle component instead of using Octuple
**Solution:** Use `<CheckBox toggle />` for toggle switches
**Code Example:**
```typescript
// ✅ Correct
<CheckBox toggle checked={value} onChange={handleChange} />

// ❌ Wrong - Don't create custom toggles
<div className="custom-toggle">...</div>
```

---

## Component Quirks

<!-- AI: Document unexpected Octuple behaviors here -->

### Row Component Requires Explicit Flex Display
**Discovered:** Initial setup
**Behavior:** `<Row>` component doesn't automatically display as flexbox
**Workaround:** Always add `style={{ display: 'flex' }}` to Row components
```typescript
<Row gutter={24} style={{ display: 'flex' }}>
  <Col span={12}>Left</Col>
  <Col span={12}>Right</Col>
</Row>
```

### Card Component Has Internal Max-Width
**Discovered:** Initial setup
**Behavior:** Cards don't expand to full container width by default
**Workaround:** Add CSS override in global styles:
```css
[class*="card-module_card"] {
  width: 100% !important;
  max-width: 100% !important;
}
```

### Search Inputs - Use SearchBox Component
**Discovered:** 2024-12-11
**Status:** ✅ Resolved
**Issue:** Was incorrectly using TextInput with manual icon positioning workarounds for search inputs.
**Solution:** Use the `SearchBox` component instead. It extends TextInput and has proper icon support built-in.
**Reference:** See `docs/components/SearchBox.md` for full documentation.

---

## Successful Patterns

<!-- AI: Document patterns that work well for reuse -->

### Person Card Layout
**Use Case:** Displaying employee/candidate cards with avatar, info, and actions
**Pattern:**
```typescript
<Card>
  <div style={{ display: 'flex', gap: '20px' }}>
    {/* Left section: Avatar + Name + Actions */}
    <div style={{ minWidth: '320px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Avatar size="40px">{initials}</Avatar>
        <div>
          <h3 style={{ margin: 0 }}>{name}</h3>
          <p style={{ margin: 0, color: '#666' }}>{title}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <Button text="Primary Action" variant={ButtonVariant.Primary} />
        <Button text="Secondary" variant={ButtonVariant.Secondary} />
      </div>
    </div>
    
    {/* Vertical Divider */}
    <div style={{ width: '1px', backgroundColor: '#e8e8e8', alignSelf: 'stretch' }} />
    
    {/* Right section: Details */}
    <div style={{ flex: 1 }}>
      {/* Info items */}
    </div>
  </div>
</Card>
```

### Search Input - Use SearchBox
**Use Case:** Search bars and search functionality
**Pattern:**
```typescript
import { SearchBox, TextInputWidth } from '@eightfold.ai/octuple';

<SearchBox
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  waitInterval={300}
  clearable={true}
  inputWidth={TextInputWidth.fill}
  ariaLabel="Search"
/>
```
**Note:** Don't use TextInput with manual icon positioning. SearchBox has proper icon support built-in.

---

## Version History

| Date | Change | By |
|------|--------|-----|
| 2024-12-11 | Fixed 24-column to 12-column grid documentation | AI |
| 2024-12-11 | Added SearchBox component recommendation | AI |
| 2024-12-11 | Added Button variant corrections | AI |
| 2024-12-11 | Added Pill color semantics | AI |
| 2024-12-10 | Initial creation with known quirks | AI Setup |

---

## Known Documentation Issues to Review

**Grid Column Values:** Some pattern files and examples may still use 24-column span values (e.g., span={16}, span={18}). These should be converted to 12-column equivalents:
- span={12} → span={6} (50%)
- span={16} → span={8} (66%)
- span={18} → span={9} (75%)
- span={8} → span={4} (33%)
- span={6} → span={3} (25%)

---

*This document is automatically maintained by AI coding agents. Last updated: 2024-12-11*

