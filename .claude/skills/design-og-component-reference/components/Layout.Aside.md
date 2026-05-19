# Layout.Aside

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple V2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
Layout.Aside is a sidebar component that's part of the Layout system. It's used to create side navigation or auxiliary content areas.

### When to Use
- Side navigation menus
- Filters or settings panels
- Auxiliary information
- Collapsible sidebars

### When NOT to Use
- Main content (use Layout.Content)
- Floating sidebars (use Drawer)
- Modal sidebars (use Modal)

---

## API Reference

### Import
```typescript
import { Layout } from '@eightfold.ai/octuple';

const { Aside } = Layout;
// or
<Layout.Aside />
```

### Props

Layout.Aside accepts standard HTML div props and styling.

**Common Usage:**
```typescript
<Layout.Aside style={{ width: '250px', background: '#f0f0f0' }}>
  {/* sidebar content */}
</Layout.Aside>
```

---

## Usage Examples

### Basic Sidebar

```typescript
import React from 'react';
import { Layout, Menu } from '@eightfold.ai/octuple';

const BasicSidebar = () => {
  return (
    <Layout style={{ display: 'flex' }}>
      <Layout.Aside style={{ width: '250px' }}>
        <Menu items={[/* menu items */]} />
      </Layout.Aside>
      <Layout.Content>
        Main content
      </Layout.Content>
    </Layout>
  );
};
```

### Left Sidebar with Navigation

```typescript
import { Layout, Menu } from '@eightfold.ai/octuple';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';

const LeftSidebar = () => {
  const menuItems = [
    { key: 'home', label: 'Home', iconProps: { path: mdiHome as IconName } },
    { key: 'profile', label: 'Profile', iconProps: { path: mdiAccount as IconName } },
    { key: 'settings', label: 'Settings', iconProps: { path: mdiCog as IconName } },
  ];

  return (
    <Layout style={{ display: 'flex', minHeight: '100vh' }}>
      <Layout.Aside style={{ 
        width: '250px', 
        background: '#001529',
        padding: '16px 0'
      }}>
        <Menu items={menuItems} />
      </Layout.Aside>
      <Layout.Content style={{ padding: '24px' }}>
        Page content goes here
      </Layout.Content>
    </Layout>
  );
};
```

### Right Sidebar

```typescript
import { Layout } from '@eightfold.ai/octuple';

const RightSidebar = () => {
  return (
    <Layout style={{ display: 'flex' }}>
      <Layout.Content style={{ flex: 1, padding: '24px' }}>
        Main content
      </Layout.Content>
      <Layout.Aside style={{ 
        width: '300px', 
        background: '#f5f5f5',
        padding: '24px'
      }}>
        <h3>Additional Info</h3>
        <p>Sidebar content on the right</p>
      </Layout.Aside>
    </Layout>
  );
};
```

### Collapsible Sidebar

```typescript
import { Layout, Button, Menu } from '@eightfold.ai/octuple';
import { useState } from 'react';
import { mdiMenu } from '@mdi/js';
import { IconName } from '@mdi/react';

const CollapsibleSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ display: 'flex' }}>
      <Layout.Aside style={{ 
        width: collapsed ? '80px' : '250px',
        transition: 'width 0.3s',
        background: '#001529'
      }}>
        <Button
          iconProps={{ path: mdiMenu as IconName }}
          onClick={() => setCollapsed(!collapsed)}
          ariaLabel="Toggle sidebar"
        />
        <Menu items={[/* menu items */]} />
      </Layout.Aside>
      <Layout.Content style={{ padding: '24px' }}>
        Main content
      </Layout.Content>
    </Layout>
  );
};
```

---

## Common Patterns

### Pattern 1: Navigation Sidebar

**When to use:** App navigation

```typescript
import { Layout, Menu } from '@eightfold.ai/octuple';

const NavSidebar = () => {
  return (
    <Layout.Aside style={{ 
      width: '250px', 
      background: '#f0f0f0',
      borderRight: '1px solid #d9d9d9'
    }}>
      <div style={{ padding: '16px' }}>
        <h3>Navigation</h3>
      </div>
      <Menu items={[/* navigation items */]} />
    </Layout.Aside>
  );
};
```

### Pattern 2: Filter Sidebar

**When to use:** Filtering content

```typescript
import { Layout, CheckBoxGroup, Select } from '@eightfold.ai/octuple';

const FilterSidebar = () => {
  return (
    <Layout.Aside style={{ 
      width: '280px',
      padding: '24px',
      background: '#fafafa'
    }}>
      <h3>Filters</h3>
      <div style={{ marginBottom: '16px' }}>
        <h4>Category</h4>
        <CheckBoxGroup options={[/* filter options */]} />
      </div>
      <div>
        <h4>Sort By</h4>
        <Select options={[/* sort options */]} />
      </div>
    </Layout.Aside>
  );
};
```

---

## Best Practices

### ✅ Do
- Set explicit width for sidebars
- Use consistent background colors
- Add padding for content spacing
- Consider collapsible behavior for mobile
- Use semantic navigation elements

### ❌ Don't
- Don't make sidebars too wide (max 300-350px)
- Don't forget to add borders or backgrounds
- Don't place sidebars outside Layout

---

## Accessibility

- Ensure sidebar navigation is keyboard accessible
- Use proper ARIA landmarks (`<nav>` for navigation)
- Provide skip links if needed
- Announce sidebar state changes

---

## Related Components

- **Layout**: Parent container
- **Layout.Content**: Main content area
- **Menu**: For sidebar navigation
- **Drawer**: For temporary sidebars

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Layout/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Added collapsible sidebar examples
- Included navigation and filter patterns
- Documented positioning options

