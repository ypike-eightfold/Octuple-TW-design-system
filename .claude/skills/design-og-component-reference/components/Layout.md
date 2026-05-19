# Layout

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Layout component provides a semantic HTML5 structure for arranging pages. It includes Header, Content, Aside, and Footer sections for creating standard application layouts.

### When to Use
- Page-level layouts
- App shell structure
- Header/sidebar/footer layouts
- Multi-section pages

### When NOT to Use
- Fine-grained positioning (use Row/Col or flex/grid)
- Simple content sections (use div with flex)
- Card layouts (use Card component)

---

## API Reference

### Import
```typescript
import { Layout } from '@eightfold.ai/octuple';

// Sub-components
const { Header, Content, Aside, Footer } = Layout;
```

### Layout Sub-Components

- **Layout**: Main container
- **Layout.Header**: Header section
- **Layout.Content**: Main content area
- **Layout.Aside**: Sidebar section
- **Layout.Footer**: Footer section

---

## Usage Examples

### Basic Layout

```typescript
import React from 'react';
import { Layout } from '@eightfold.ai/octuple';

const BasicLayout = () => {
  return (
    <Layout>
      <Layout.Header>
        <h1>Application Header</h1>
      </Layout.Header>
      <Layout.Content>
        <p>Main content goes here</p>
      </Layout.Content>
      <Layout.Footer>
        <p>© 2024 Company Name</p>
      </Layout.Footer>
    </Layout>
  );
};
```

### Layout with Sidebar

```typescript
import { Layout } from '@eightfold.ai/octuple';

const LayoutWithSidebar = () => {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
      <Layout style={{ display: 'flex' }}>
        <Layout.Aside>
          <nav>Sidebar Navigation</nav>
        </Layout.Aside>
        <Layout.Content>
          Main Content
        </Layout.Content>
      </Layout>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  );
};
```

### Full Application Layout

```typescript
import { Layout, Menu, Button, ButtonVariant } from '@eightfold.ai/octuple';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';

const AppLayout = () => {
  const menuItems = [
    { key: 'home', label: 'Home', iconProps: { path: mdiHome as IconName } },
    { key: 'profile', label: 'Profile', iconProps: { path: mdiAccount as IconName } },
    { key: 'settings', label: 'Settings', iconProps: { path: mdiCog as IconName } },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <h1>My App</h1>
        <Button text="Logout" variant={ButtonVariant.Neutral} />
      </Layout.Header>
      
      <Layout style={{ display: 'flex' }}>
        <Layout.Aside style={{ width: '250px', background: '#f0f0f0' }}>
          <Menu items={menuItems} />
        </Layout.Aside>
        
        <Layout.Content style={{ padding: '24px' }}>
          <h2>Page Content</h2>
          <p>Your main content goes here.</p>
        </Layout.Content>
      </Layout>
      
      <Layout.Footer style={{ textAlign: 'center', padding: '16px' }}>
        © 2024 My App. All rights reserved.
      </Layout.Footer>
    </Layout>
  );
};
```

---

## Common Patterns

### Pattern 1: Admin Dashboard

**When to use:** Admin or dashboard applications

```typescript
import { Layout, Menu } from '@eightfold.ai/octuple';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header>Admin Dashboard</Layout.Header>
      <Layout style={{ display: 'flex' }}>
        <Layout.Aside style={{ width: '200px' }}>
          <Menu items={[/* menu items */]} />
        </Layout.Aside>
        <Layout.Content style={{ padding: '24px' }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
```

### Pattern 2: Marketing Site

**When to use:** Public-facing websites

```typescript
import { Layout } from '@eightfold.ai/octuple';

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
      <Layout.Header style={{ padding: '16px 48px' }}>
        <nav>Logo | Home | About | Contact</nav>
      </Layout.Header>
      <Layout.Content style={{ minHeight: '80vh', padding: '48px' }}>
        {children}
      </Layout.Content>
      <Layout.Footer style={{ padding: '24px', background: '#001529', color: 'white' }}>
        Footer content
      </Layout.Footer>
    </Layout>
  );
};
```

---

## Best Practices

### ✅ Do
- Use semantic HTML5 structure
- Set minimum height on layout containers
- Use consistent padding/margins
- Add sticky header if needed
- Style Layout.Aside for fixed width sidebars

### ❌ Don't
- Don't use for small sections (use div or Card)
- Don't forget to set layout height
- Don't nest layouts excessively

---

## Accessibility

- Layout provides semantic HTML5 structure
- Use proper heading hierarchy
- Ensure keyboard navigation works
- Make sure focus management is correct

---

## Related Components

- **Row / Col**: For grid-based layouts
- **Menu**: For sidebar navigation
- **Breadcrumb**: For navigation within content
- **Card**: For content sections

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Layout/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Added full application layout examples
- Included sidebar patterns
- Documented all sub-components

