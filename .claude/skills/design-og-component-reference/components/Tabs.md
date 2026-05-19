# Tabs

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Tabs component organizes content into separate views where only one view is visible at a time. It's used for grouping related content and reducing page clutter.

### When to Use
- Organizing related content into sections
- Switching between different views
- Form wizards or multi-step processes
- Dashboard sections

### When NOT to Use
- Primary navigation (use Menu)
- Few related items (consider a simpler layout)
- When all content should be visible simultaneously

---

## API Reference

### Import
```typescript
import { Tabs, Tab } from '@eightfold.ai/octuple';
```

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently active tab value. |
| `onChange` | `(value: string) => void` | - | Callback when tab changes. |
| `children` | `React.ReactNode` | - | Tab components as children. |

### Tab Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Unique identifier for the tab. |
| `label` | `string` | - | Tab label text. |
| `icon` | `IconName` | - | Icon for the tab. |
| `iconAlign` | `TabIconAlign` | - | Icon alignment (left/right). |
| `disabled` | `boolean` | `false` | Disable the tab. |
| `children` | `React.ReactNode` | - | Tab content. |

---

## Usage Examples

### Basic Tabs

```typescript
import React, { useState } from 'react';
import { Tabs, Tab } from '@eightfold.ai/octuple';

const BasicTabs = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tab value="tab1" label="Tab 1">
        <p>Content for Tab 1</p>
      </Tab>
      <Tab value="tab2" label="Tab 2">
        <p>Content for Tab 2</p>
      </Tab>
      <Tab value="tab3" label="Tab 3">
        <p>Content for Tab 3</p>
      </Tab>
    </Tabs>
  );
};
```

### Tabs with Icons (MDI)

```typescript
import { Tabs, Tab } from '@eightfold.ai/octuple';
import { mdiAccount, mdiCog, mdiBell } from '@mdi/js';
import { IconName } from '@mdi/react';
import { useState } from 'react';

const IconTabs = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tab 
        value="profile" 
        label="Profile"
        icon={mdiAccount as IconName}
      >
        <h3>Profile Settings</h3>
        <p>Manage your profile information</p>
      </Tab>
      
      <Tab 
        value="settings" 
        label="Settings"
        icon={mdiCog as IconName}
      >
        <h3>App Settings</h3>
        <p>Configure application settings</p>
      </Tab>
      
      <Tab 
        value="notifications" 
        label="Notifications"
        icon={mdiBell as IconName}
      >
        <h3>Notifications</h3>
        <p>Manage your notifications</p>
      </Tab>
    </Tabs>
  );
};
```

### Tabs with Disabled Tab

```typescript
import { Tabs, Tab } from '@eightfold.ai/octuple';
import { useState } from 'react';

const DisabledTabExample = () => {
  const [activeTab, setActiveTab] = useState('available');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tab value="available" label="Available">
        <p>This tab is accessible</p>
      </Tab>
      
      <Tab value="locked" label="Locked" disabled={true}>
        <p>This content is locked</p>
      </Tab>
      
      <Tab value="active" label="Active">
        <p>Another accessible tab</p>
      </Tab>
    </Tabs>
  );
};
```

### Controlled Tabs with External State

```typescript
import { Tabs, Tab, Button, ButtonVariant } from '@eightfold.ai/octuple';
import { useState } from 'react';

const ControlledTabs = () => {
  const [activeTab, setActiveTab] = useState('step1');

  const goToNextTab = () => {
    if (activeTab === 'step1') setActiveTab('step2');
    else if (activeTab === 'step2') setActiveTab('step3');
  };

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab value="step1" label="Step 1">
          <h3>Step 1: Information</h3>
          <p>Fill in your information</p>
        </Tab>
        <Tab value="step2" label="Step 2">
          <h3>Step 2: Review</h3>
          <p>Review your information</p>
        </Tab>
        <Tab value="step3" label="Step 3">
          <h3>Step 3: Complete</h3>
          <p>All done!</p>
        </Tab>
      </Tabs>
      
      <div style={{ marginTop: '16px' }}>
        <Button 
          text="Next" 
          onClick={goToNextTab}
          variant={ButtonVariant.Primary}
        />
      </div>
    </div>
  );
};
```

---

## Common Patterns

### Pattern 1: Settings Tabs

**When to use:** Organize settings into categories

```typescript
import { Tabs, Tab, Form, TextInput, CheckBox } from '@eightfold.ai/octuple';
import { useState } from 'react';

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tab value="account" label="Account">
        <Form layout="vertical">
          <Form.Item label="Username" name="username">
            <TextInput />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <TextInput />
          </Form.Item>
        </Form>
      </Tab>
      
      <Tab value="privacy" label="Privacy">
        <Form layout="vertical">
          <Form.Item name="publicProfile" valuePropName="checked">
            <CheckBox label="Make profile public" />
          </Form.Item>
        </Form>
      </Tab>
      
      <Tab value="notifications" label="Notifications">
        <Form layout="vertical">
          <Form.Item name="emailNotifs" valuePropName="checked">
            <CheckBox label="Email notifications" />
          </Form.Item>
        </Form>
      </Tab>
    </Tabs>
  );
};
```

### Pattern 2: Dashboard Tabs

**When to use:** Different dashboard views

```typescript
import { Tabs, Tab, Card } from '@eightfold.ai/octuple';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tab value="overview" label="Overview">
        <Card title="Overview">
          <p>Dashboard overview content</p>
        </Card>
      </Tab>
      
      <Tab value="analytics" label="Analytics">
        <Card title="Analytics">
          <p>Analytics charts and data</p>
        </Card>
      </Tab>
      
      <Tab value="reports" label="Reports">
        <Card title="Reports">
          <p>Generated reports</p>
        </Card>
      </Tab>
    </Tabs>
  );
};
```

---

## Best Practices

### ✅ Do
- Use 3-7 tabs (more than 7, consider different UI)
- Keep tab labels short and descriptive
- Show active tab clearly
- Lazy load tab content if heavy
- Use icons to enhance recognition

### ❌ Don't
- Don't use for primary navigation (use Menu)
- Don't nest tabs inside tabs
- Don't use overly long tab labels
- Don't hide important actions in tabs

---

## Common Mistakes

### Mistake 1: Wrong Prop Name

**Problem:**
```typescript
<Tabs activeValue="tab1"> {/* ❌ Wrong prop */}
  <Tab value="tab1" label="Tab 1">Content</Tab>
</Tabs>
```

**Solution:**
```typescript
<Tabs value="tab1" onChange={setTab}> {/* ✅ Correct */}
  <Tab value="tab1" label="Tab 1">Content</Tab>
</Tabs>
```

---

### Mistake 2: Not Using Controlled Component

**Problem:**
```typescript
<Tabs> {/* ❌ No value or onChange */}
  <Tab value="tab1" label="Tab 1">Content</Tab>
</Tabs>
```

**Solution:**
```typescript
const [active, setActive] = useState('tab1');
<Tabs value={active} onChange={setActive}> {/* ✅ Controlled */}
  <Tab value="tab1" label="Tab 1">Content</Tab>
</Tabs>
```

---

## Accessibility

### ARIA Requirements
- Tabs have proper ARIA roles
- Active tab is announced
- Keyboard navigation supported
- Focus management handled

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus tab list |
| `Arrow Left/Right` | Navigate between tabs |
| `Home` | First tab |
| `End` | Last tab |
| `Enter` / `Space` | Activate focused tab |

---

## Related Components

- **Menu**: For navigation
- **Stepper**: For sequential steps
- **Breadcrumb**: For hierarchy
- **Card**: For tab content

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Tabs/`)
- [MDI Icons](https://pictogrammers.com/library/mdi/)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented Tabs and Tab components
- Added icon integration examples
- Included settings and dashboard patterns
- Corrected prop names (`value` not `activeValue`)

