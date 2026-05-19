# Menu

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Menu component displays a list of navigation items. It supports icons, sub-menus, and various item types for building application navigation.

### When to Use
- Application navigation
- Sidebar menus
- Dropdown menus
- Contextual menus

### When NOT to Use
- Tabs for content switching (use Tabs)
- Breadcrumb navigation (use Breadcrumb)
- Select dropdowns (use Select)

---

## API Reference

### Import
```typescript
import { Menu } from '@eightfold.ai/octuple';
```

### Menu Props

**Primary Prop:**
- `items`: Array of menu item objects

### Menu Item Types

From Confluence documentation, Menu has several sub-components:
- **Menu Item** - Standard clickable item
- **Menu Item Button** - Button-style item
- **Menu Item Link** - Link-style item (for navigation)
- **Menu Item SubHeader** - Section header
- **Custom Menu Item** - Custom content

### Menu Item Structure

```typescript
interface MenuItem {
  key: string;
  label: string;
  iconProps?: IconProps;
  onClick?: () => void;
  href?: string;  // for links
  children?: MenuItem[];  // for sub-menus
  type?: 'item' | 'button' | 'link' | 'subheader' | 'custom';
}
```

---

## Usage Examples

### Basic Menu

```typescript
import React from 'react';
import { Menu } from '@eightfold.ai/octuple';

const BasicMenu = () => {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <Menu items={items} />
  );
};
```

### Menu with Icons (MDI)

```typescript
import { Menu } from '@eightfold.ai/octuple';
import { mdiHome, mdiAccount, mdiCog, mdiFileDocument } from '@mdi/js';
import { IconName } from '@mdi/react';

const IconMenu = () => {
  const items = [
    { 
      key: 'home', 
      label: 'Home',
      iconProps: { path: mdiHome as IconName }
    },
    { 
      key: 'profile', 
      label: 'Profile',
      iconProps: { path: mdiAccount as IconName }
    },
    { 
      key: 'settings', 
      label: 'Settings',
      iconProps: { path: mdiCog as IconName }
    },
    { 
      key: 'docs', 
      label: 'Documentation',
      iconProps: { path: mdiFileDocument as IconName }
    },
  ];

  return (
    <Menu items={items} />
  );
};
```

### Menu with Click Handlers

```typescript
import { Menu } from '@eightfold.ai/octuple';
import { useNavigate } from 'react-router-dom';

const InteractiveMenu = () => {
  const navigate = useNavigate();

  const items = [
    { 
      key: 'dashboard', 
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    { 
      key: 'users', 
      label: 'Users',
      onClick: () => navigate('/users')
    },
    { 
      key: 'reports', 
      label: 'Reports',
      onClick: () => navigate('/reports')
    },
  ];

  return (
    <Menu items={items} />
  );
};
```

### Sidebar Menu

```typescript
import { Layout, Menu } from '@eightfold.ai/octuple';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';

const SidebarMenu = () => {
  const menuItems = [
    { 
      key: 'home', 
      label: 'Home',
      iconProps: { path: mdiHome as IconName }
    },
    { 
      key: 'profile', 
      label: 'Profile',
      iconProps: { path: mdiAccount as IconName }
    },
    { 
      key: 'settings', 
      label: 'Settings',
      iconProps: { path: mdiCog as IconName }
    },
  ];

  return (
    <Layout.Aside style={{ width: '250px', background: '#f0f0f0' }}>
      <Menu items={menuItems} />
    </Layout.Aside>
  );
};
```

---

## Common Patterns

### Pattern 1: Application Navigation

**When to use:** Main app navigation

```typescript
import { Layout, Menu } from '@eightfold.ai/octuple';
import { mdiHome, mdiChartLine, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';

const AppNavigation = () => {
  const items = [
    { 
      key: 'dashboard', 
      label: 'Dashboard',
      iconProps: { path: mdiHome as IconName }
    },
    { 
      key: 'analytics', 
      label: 'Analytics',
      iconProps: { path: mdiChartLine as IconName }
    },
    { 
      key: 'users', 
      label: 'Users',
      iconProps: { path: mdiAccount as IconName }
    },
    { 
      key: 'settings', 
      label: 'Settings',
      iconProps: { path: mdiCog as IconName }
    },
  ];

  return (
    <Layout.Aside style={{ width: '250px' }}>
      <Menu items={items} />
    </Layout.Aside>
  );
};
```

### Pattern 2: User Menu

**When to use:** User account menu

```typescript
import { Menu } from '@eightfold.ai/octuple';
import { mdiAccount, mdiCog, mdiLogout } from '@mdi/js';
import { IconName } from '@mdi/react';

const UserMenu = () => {
  const items = [
    { 
      key: 'profile', 
      label: 'My Profile',
      iconProps: { path: mdiAccount as IconName }
    },
    { 
      key: 'settings', 
      label: 'Settings',
      iconProps: { path: mdiCog as IconName }
    },
    { 
      key: 'logout', 
      label: 'Logout',
      iconProps: { path: mdiLogout as IconName },
      onClick: () => {/* logout logic */}
    },
  ];

  return (
    <Menu items={items} />
  );
};
```

---

## Best Practices

### ✅ Do
- Use clear, concise labels
- Provide icons for better visual recognition
- Group related items together
- Use consistent menu structure
- Highlight active/current page

### ❌ Don't
- Don't use for form selections (use Select)
- Don't create too deep hierarchies
- Don't use without clear purpose
- Don't forget to handle click events

---

## Common Mistakes

### Mistake 1: Missing iconProps Cast

**Problem:**
```typescript
const items = [
  { key: 'home', label: 'Home', iconProps: { path: mdiHome } } // ❌ Type error
];
```

**Solution:**
```typescript
import { IconName } from '@mdi/react';

const items = [
  { key: 'home', label: 'Home', iconProps: { path: mdiHome as IconName } } // ✅ Correct
];
```

---

## Accessibility

### ARIA Requirements
- Menu items are keyboard navigable
- Active item is announced
- Icons have proper labels
- Menu has proper ARIA roles

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus menu / next item |
| `Arrow Up/Down` | Navigate items |
| `Enter` | Activate item |
| `Space` | Activate item |

---

## Related Components

- **Layout.Aside**: For sidebar menus
- **Breadcrumb**: For page navigation
- **Tabs**: For content switching
- **Dropdown**: For dropdown menus

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Menu/`)
- [MDI Icons](https://pictogrammers.com/library/mdi/)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented Menu with items array API
- Added MDI icon integration examples
- Included navigation patterns
- Documented all Menu Item variants

