# Breadcrumb

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Breadcrumb component displays the current page's location within a navigational hierarchy. It allows users to quickly navigate back to parent pages.

### When to Use
- Multi-level page hierarchies
- Showing current location in app
- Providing quick navigation to parent pages
- Deep nested navigation structures

### When NOT to Use
- Single-level navigation
- Flat site structures
- Primary navigation (use Menu)

---

## API Reference

### Import
```typescript
import { Breadcrumb } from '@eightfold.ai/octuple';
```

### Breadcrumb Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `links` | `BreadcrumbLink[]` | - | Array of breadcrumb links. |
| `separator` | `React.ReactNode` | `/` | Custom separator between items. |

### Breadcrumb Link Structure

```typescript
interface BreadcrumbLink {
  url?: string;      // Link URL (optional for last item)
  children: string;  // Link text/label
}
```

---

## Usage Examples

### Basic Breadcrumb

```typescript
import React from 'react';
import { Breadcrumb } from '@eightfold.ai/octuple';

const BasicBreadcrumb = () => {
  const links = [
    { url: '/', children: 'Home' },
    { url: '/products', children: 'Products' },
    { children: 'Product Details' }, // Current page (no url)
  ];

  return (
    <Breadcrumb links={links} />
  );
};
```

### Breadcrumb with Custom Separator

```typescript
import { Breadcrumb } from '@eightfold.ai/octuple';

const CustomSeparatorBreadcrumb = () => {
  const links = [
    { url: '/', children: 'Home' },
    { url: '/docs', children: 'Documentation' },
    { children: 'Components' },
  ];

  return (
    <Breadcrumb 
      links={links}
      separator=">"
    />
  );
};
```

### Breadcrumb with Dynamic Navigation

```typescript
import { Breadcrumb } from '@eightfold.ai/octuple';
import { useNavigate, useLocation } from 'react-router-dom';

const DynamicBreadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate breadcrumb links from current path
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const links = [
    { url: '/', children: 'Home' },
    ...pathnames.map((name, index) => {
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      return {
        url: isLast ? undefined : url,
        children: name.charAt(0).toUpperCase() + name.slice(1)
      };
    })
  ];

  return (
    <Breadcrumb links={links} />
  );
};
```

### Page Header with Breadcrumb

```typescript
import { Breadcrumb, Button, ButtonVariant } from '@eightfold.ai/octuple';

const PageHeader = () => {
  const links = [
    { url: '/', children: 'Home' },
    { url: '/candidates', children: 'Candidates' },
    { children: 'John Doe' },
  ];

  return (
    <div>
      <Breadcrumb links={links} />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '16px'
      }}>
        <h1>John Doe</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button text="Edit" />
          <Button text="Save" variant={ButtonVariant.Primary} />
        </div>
      </div>
    </div>
  );
};
```

---

## Common Patterns

### Pattern 1: E-commerce Navigation

**When to use:** Product category navigation

```typescript
import { Breadcrumb } from '@eightfold.ai/octuple';

const ProductBreadcrumb = () => {
  const links = [
    { url: '/', children: 'Home' },
    { url: '/electronics', children: 'Electronics' },
    { url: '/electronics/computers', children: 'Computers' },
    { url: '/electronics/computers/laptops', children: 'Laptops' },
    { children: 'MacBook Pro 16"' },
  ];

  return (
    <Breadcrumb links={links} />
  );
};
```

### Pattern 2: Admin Panel Navigation

**When to use:** Administrative interface navigation

```typescript
import { Breadcrumb } from '@eightfold.ai/octuple';

const AdminBreadcrumb = () => {
  const links = [
    { url: '/admin', children: 'Admin' },
    { url: '/admin/users', children: 'Users' },
    { children: 'User Details' },
  ];

  return (
    <div style={{ padding: '16px', background: '#f5f5f5' }}>
      <Breadcrumb links={links} />
    </div>
  );
};
```

### Pattern 3: Documentation Navigation

**When to use:** Documentation site navigation

```typescript
import { Breadcrumb } from '@eightfold.ai/octuple';

const DocsBreadcrumb = () => {
  const links = [
    { url: '/docs', children: 'Documentation' },
    { url: '/docs/components', children: 'Components' },
    { url: '/docs/components/forms', children: 'Forms' },
    { children: 'Button' },
  ];

  return (
    <Breadcrumb links={links} separator="›" />
  );
};
```

---

## Best Practices

### ✅ Do
- Always start with "Home" or app name
- Make all items except the last clickable
- Use clear, concise labels
- Show current page as last item (not clickable)
- Keep hierarchy depth reasonable (max 4-5 levels)

### ❌ Don't
- Don't make the current page clickable
- Don't skip levels in the hierarchy
- Don't use overly long labels
- Don't use for single-level navigation

---

## Common Mistakes

### Mistake 1: Making Last Item Clickable

**Problem:**
```typescript
const links = [
  { url: '/', children: 'Home' },
  { url: '/current', children: 'Current Page' } // ❌ Current page has URL
];
```

**Solution:**
```typescript
const links = [
  { url: '/', children: 'Home' },
  { children: 'Current Page' } // ✅ No URL for current page
];
```

---

### Mistake 2: Wrong Property Name

**Problem:**
```typescript
const links = [
  { href: '/', label: 'Home' } // ❌ Wrong property names
];
```

**Solution:**
```typescript
const links = [
  { url: '/', children: 'Home' } // ✅ Correct: url and children
];
```

---

## Accessibility

### ARIA Requirements
- Breadcrumb uses proper ARIA navigation role
- Current page is marked with `aria-current="page"`
- Links are keyboard navigable

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Navigate to next link |
| `Shift+Tab` | Navigate to previous link |
| `Enter` | Follow link |

### Screen Reader Support
- Breadcrumb is announced as "breadcrumb navigation"
- Current page is announced as "current page"
- Each link text is read clearly

---

## Related Components

- **Menu**: For primary navigation
- **Tabs**: For content switching
- **Pagination**: For page navigation

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Breadcrumb/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented Breadcrumb with links array API
- Corrected property names (url, children)
- Added navigation patterns
- Included dynamic breadcrumb generation example

