# Octuple UI Patterns

This directory contains comprehensive UI pattern guides that demonstrate how to combine Octuple components to build real-world interfaces.

---

## Available Patterns

### 1. [Form Validation Pattern](./form-validation.md)
**Complexity:** Medium  
**Components:** Form, Form.Item, TextInput, TextArea, Select, CheckBox, Button

Build robust forms with comprehensive validation including:
- Required field validation
- Email and pattern validation
- Field dependencies (password confirmation)
- Async validation (username availability)
- Multi-section forms
- Custom validation messages

**When to use:** User registration, data collection, multi-field forms

---

### 2. [Two-Column Layout Pattern](./two-column-layout.md)
**Complexity:** Medium  
**Components:** Row, Col, Card, Layout

Create content and sidebar layouts including:
- 66/33 split (most common)
- 70/30 split for blog posts
- 50/50 split for comparisons
- Sidebar left or right
- Responsive mobile behavior

**When to use:** Blog posts, product pages, application interfaces, detail pages

⚠️ **Critical:** Requires explicit flex styling for horizontal layout.

---

### 3. [Navigation Pattern](./navigation.md)
**Complexity:** Medium  
**Components:** Layout, Layout.Aside, Menu, Breadcrumb, Button, Avatar

Build application navigation including:
- Sidebar navigation with icons
- Header with user menu
- Breadcrumb navigation
- Active state management
- Responsive mobile navigation

**When to use:** Multi-page applications, dashboards, admin interfaces

---

### 4. [Card Grid Pattern](./card-grid.md)
**Complexity:** Easy  
**Components:** Row, Col, Card, Button

Display collections in responsive grid layouts:
- 2, 3, or 4 column grids
- Responsive breakpoints
- Card actions and interactions
- Loading and empty states

**When to use:** Product listings, dashboard widgets, content galleries

---

### 5. [Stepper Workflow Pattern](./stepper-workflow.md)
**Complexity:** Medium  
**Components:** Stepper, Form, TextInput, Button, Card

Multi-step form wizards including:
- Sequential data collection
- Navigation between steps
- Per-step validation
- Progress indication
- Review step

**When to use:** Multi-step forms, onboarding, checkout flows

---

### 6. [Data Table Pattern](./data-table.md)
**Complexity:** Medium  
**Components:** Select, CheckBoxGroup, Button, Card

Data display with filtering (Note: Table component not in documentation):
- Filter controls
- Status selection
- Type filtering
- Export functionality

**When to use:** Data lists with filtering requirements

---

### 7. [User Profile Pattern](./user-profile.md)
**Complexity:** Medium  
**Components:** Avatar, Tabs, Tab, Card, Form, Badge

User profile pages including:
- Profile header with Avatar
- Tabs for sections (Info, Settings, Activity)
- Edit mode toggle
- Status indicators with Badge
- Two-column layout for details

**When to use:** User profiles, account pages, contact cards

---

### 8. [Dashboard Layout Pattern](./dashboard-layout.md)
**Complexity:** Medium  
**Components:** Row, Col, Card, Button

Dashboard with metrics and widgets:
- Metric cards (4-column grid)
- Widget cards
- Responsive layout
- Quick actions sidebar

**When to use:** Dashboards, analytics pages, admin overviews

---

## Pattern Selection Guide

### By Use Case

**Forms & Data Collection:**
- Form Validation Pattern
- Stepper Workflow Pattern

**Content Display:**
- Two-Column Layout Pattern
- Card Grid Pattern
- Dashboard Layout Pattern

**Navigation:**
- Navigation Pattern
- User Profile Pattern (with tabs)

**Data Management:**
- Data Table Pattern
- Dashboard Layout Pattern

---

### By Complexity

**Easy (Good for beginners):**
- Card Grid Pattern

**Medium (Most common):**
- Form Validation Pattern
- Two-Column Layout Pattern
- Navigation Pattern
- Stepper Workflow Pattern
- Data Table Pattern
- User Profile Pattern
- Dashboard Layout Pattern

---

## How to Use These Patterns

1. **Choose a Pattern** - Select the pattern that matches your use case
2. **Review the Basic Pattern** - Start with the simplest implementation
3. **Explore Variations** - Check pattern variations for different needs
4. **Copy & Customize** - Copy the code and adapt to your requirements
5. **Follow Best Practices** - Review the Do's and Don'ts sections
6. **Check Accessibility** - Ensure your implementation is accessible

---

## Pattern Structure

Each pattern guide includes:

1. **Overview** - What the pattern is and when to use it
2. **Components Used** - List of Octuple components involved
3. **Basic Pattern** - Simplest implementation
4. **Variations** - 2-4 pattern variations
5. **Complete Example** - Full working implementation
6. **Best Practices** - Do's and Don'ts
7. **Accessibility** - WCAG compliance guidelines
8. **Common Issues** - Known problems and solutions
9. **Resources** - Links to component guides

---

## Contributing

When adding new patterns:

1. Use the [Pattern Template](./PATTERN-TEMPLATE.md)
2. Include working code examples
3. Test all code examples
4. Document accessibility requirements
5. Add mobile responsive considerations
6. Include common mistakes and solutions

---

## Related Documentation

- **Component Guides:** [`docs/components/`](../components/)
- **Verified Examples:** [`docs/verified-octuple-examples.md`](../verified-octuple-examples.md)
- **AI Quick Reference:** [`docs/ai-quick-reference.md`](../ai-quick-reference.md)
- **Design Guidelines:** [`docs/design-guidelines.md`](../design-guidelines.md)

---

## Changelog

### November 20, 2024
- Initial pattern library creation
- Added 8 comprehensive patterns
- Included responsive examples
- Documented all patterns with working code
- Added pattern selection guide

