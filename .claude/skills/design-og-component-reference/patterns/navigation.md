# Navigation Pattern

**Pattern Type:** Navigation  
**Complexity:** Medium  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2

---

## Overview

### What is this pattern?

The Navigation Pattern demonstrates how to build application navigation using Octuple components including sidebar menus, header navigation, breadcrumbs, and active state management.

### When to use this pattern

- Application with multiple pages/sections
- Dashboard or admin interfaces
- Multi-level navigation hierarchies
- User account management

### When NOT to use this pattern

- Single-page applications with minimal navigation
- Marketing websites (simpler nav might suffice)
- Mobile-only apps (consider bottom tab navigation)

---

## Components Used

- **Layout / Layout.Aside** - Page structure with sidebar
- **Menu** - Navigation menu items
- **Breadcrumb** - Hierarchical navigation
- **Button** - Header actions
- **Avatar** - User profile
- **Dropdown** - User menu (when available)

---

## Basic Pattern

### Simple Sidebar Navigation

```typescript
import React, { useState } from 'react';
import { Layout, Menu } from '@eightfold.ai/octuple';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';

const BasicNavigation = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard',
      iconProps: { path: mdiHome as IconName },
      onClick: () => setCurrentPage('dashboard')
    },
    { 
      key: 'profile', 
      label: 'Profile',
      iconProps: { path: mdiAccount as IconName },
      onClick: () => setCurrentPage('profile')
    },
    { 
      key: 'settings', 
      label: 'Settings',
      iconProps: { path: mdiCog as IconName },
      onClick: () => setCurrentPage('settings')
    },
  ];

  return (
    <Layout style={{ display: 'flex', minHeight: '100vh' }}>
      <Layout.Aside style={{ width: '250px', background: '#001529', padding: '16px 0' }}>
        <div style={{ color: 'white', padding: '0 24px', marginBottom: '24px' }}>
          <h2>My App</h2>
        </div>
        <Menu items={menuItems} />
      </Layout.Aside>

      <Layout.Content style={{ padding: '24px' }}>
        <h1>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
        <p>Content for {currentPage} page</p>
      </Layout.Content>
    </Layout>
  );
};
```

---

## Pattern Variations

### Variation 1: Full App Navigation with Header and Breadcrumb

```typescript
import { Layout, Menu, Breadcrumb, Button, ButtonVariant, Avatar } from '@eightfold.ai/octuple';
import { mdiHome, mdiChartLine, mdiAccount, mdiCog, mdiLogout } from '@mdi/js';
import { IconName } from '@mdi/react';
import { useState } from 'react';

const FullAppNavigation = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', iconProps: { path: mdiHome as IconName }, onClick: () => setActivePage('dashboard') },
    { key: 'analytics', label: 'Analytics', iconProps: { path: mdiChartLine as IconName }, onClick: () => setActivePage('analytics') },
    { key: 'profile', label: 'Profile', iconProps: { path: mdiAccount as IconName }, onClick: () => setActivePage('profile') },
    { key: 'settings', label: 'Settings', iconProps: { path: mdiCog as IconName }, onClick: () => setActivePage('settings') },
  ];

  const breadcrumbLinks = [
    { url: '/', children: 'Home' },
    { url: '/dashboard', children: 'Dashboard' },
    { children: activePage.charAt(0).toUpperCase() + activePage.slice(1) },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Layout.Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <h1 style={{ margin: 0 }}>My Application</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>John Doe</span>
          <Avatar size="32px">JD</Avatar>
          <Button 
            text="Logout" 
            iconProps={{ path: mdiLogout as IconName }}
            variant={ButtonVariant.Neutral}
          />
        </div>
      </Layout.Header>

      <Layout style={{ display: 'flex' }}>
        {/* Sidebar */}
        <Layout.Aside style={{ width: '250px', background: '#f5f5f5', padding: '24px 0' }}>
          <Menu items={sidebarItems} />
        </Layout.Aside>

        {/* Main Content */}
        <Layout.Content style={{ padding: '24px' }}>
          <Breadcrumb links={breadcrumbLinks} />
          <h2 style={{ marginTop: '24px' }}>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h2>
          <p>Main content area for {activePage}</p>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
```

**Key Features:**
- Header with logo and user menu
- Sidebar navigation with icons
- Breadcrumb navigation
- Active page tracking
- Clean visual hierarchy

---

### Variation 2: Responsive Navigation (Mobile-Friendly)

```typescript
import { Layout, Menu, Button } from '@eightfold.ai/octuple';
import { mdiMenu, mdiHome, mdiAccount } from '@mdi/js';
import { IconName } from '@mdi/react';
import { useState, useEffect } from 'react';

const ResponsiveNavigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { key: 'home', label: 'Home', iconProps: { path: mdiHome as IconName } },
    { key: 'profile', label: 'Profile', iconProps: { path: mdiAccount as IconName } },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile && (
        <div style={{ padding: '16px' }}>
          <Button
            iconProps={{ path: mdiMenu as IconName }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            ariaLabel="Toggle menu"
          />
        </div>
      )}

      <Layout style={{ display: 'flex' }}>
        {sidebarOpen && (
          <Layout.Aside style={{ 
            width: isMobile ? '200px' : '250px',
            position: isMobile ? 'fixed' : 'relative',
            height: isMobile ? '100vh' : 'auto',
            zIndex: isMobile ? 1000 : 1,
            background: '#f5f5f5'
          }}>
            <Menu items={menuItems} />
          </Layout.Aside>
        )}

        <Layout.Content style={{ padding: '24px', flex: 1 }}>
          <h1>Content Area</h1>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
```

---

## Best Practices

### ✅ Do
- Use MDI icons for menu items
- Highlight active navigation item
- Provide breadcrumbs for deep hierarchies
- Keep menu labels concise
- Use consistent navigation structure
- Make navigation keyboard accessible

### ❌ Don't
- Don't use emojis instead of icons
- Don't hide navigation on desktop
- Don't create overly deep navigation trees
- Don't forget mobile responsiveness
- Don't use ambiguous labels

---

## Accessibility

- Menu items are keyboard navigable
- Use proper ARIA labels
- Maintain focus management
- Announce active page to screen readers

---

## Resources

- [Menu Component Guide](../components/Menu.md)
- [Breadcrumb Component Guide](../components/Breadcrumb.md)
- [Layout Component Guide](../components/Layout.md)

---

## Changelog

### November 20, 2024
- Initial pattern documentation
- Added responsive navigation example
- Included breadcrumb integration

