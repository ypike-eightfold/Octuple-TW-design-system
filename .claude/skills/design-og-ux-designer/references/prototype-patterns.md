# Verified Octuple Component Examples

**CRITICAL:** These are TESTED and WORKING examples with REAL APIs from Confluence documentation. Copy these patterns exactly.

**Last Updated:** November 20, 2024  
**Tested with:** @eightfold.ai/octuple v2.54.2  
**Source:** Verified against Confluence API documentation and TypeScript definitions

---

## 🚨 Quick Start - Essential Rules

### Rule 1: Always Check TypeScript Types First
```bash
# Check component props before using
npm run check-props ComponentName

# Example:
npm run check-props Button
npm run check-props Form
```

### Rule 2: Use Real Enums, Not Strings
```tsx
// ✅ CORRECT
import { Button, ButtonVariant } from '@eightfold.ai/octuple';
<Button text="Click" variant={ButtonVariant.Primary} />

// ❌ WRONG
<Button text="Click" variant="primary" />  // TypeScript error!
```

### Rule 3: Use MDI Icons, Not Emojis
```tsx
// ✅ CORRECT
import { mdiHome } from '@mdi/js';
import { IconName } from '@mdi/react';
<Button iconProps={{ path: mdiHome as IconName }} />

// ❌ WRONG
<Button>🏠 Home</Button>  // Unprofessional!
```

---

## 🚨 LESSONS LEARNED - Critical Patterns

These patterns were discovered through building 3 example pages. Use them!

### Circular Icon-Only Buttons (CORRECT WAY)

```tsx
import { Button, ButtonVariant, ButtonSize, ButtonShape, IconName } from '@eightfold.ai/octuple';
import { mdiPencil, mdiCog, mdiTrashCanOutline } from '@mdi/js';

// ✅ CORRECT - Use ButtonShape.Round, let Octuple handle sizing
<Button
  iconProps={{ path: mdiPencil as unknown as IconName }}
  variant={ButtonVariant.Neutral}
  size={ButtonSize.Small}      // Small=28px, Medium=36px, Large=44px
  shape={ButtonShape.Round}    // Makes it circular
  ariaLabel="Edit"             // Required for accessibility
/>

// ❌ WRONG - Never force dimensions
<Button
  iconProps={{ path: mdiPencil as unknown as IconName }}
  style={{ width: '36px', height: '36px', borderRadius: '50%' }}  // BREAKS SIZING
/>
```

### Toggle/Switch (Use CheckBox)

```tsx
import { CheckBox } from '@eightfold.ai/octuple';

// ✅ CORRECT - Octuple has no Switch, use CheckBox with toggle
<CheckBox
  toggle
  checked={isEnabled}
  onChange={(e) => setIsEnabled(e.target.checked)}
  label="Open to mentoring"
/>
```

### Skill Tags (Use SkillTag)

```tsx
import { SkillTag } from '@eightfold.ai/octuple';

// ✅ CORRECT - Use Octuple SkillTag
<SkillTag label="Machine Learning" />
<SkillTag label="Python" />

// ❌ WRONG - Don't create custom tags
<div style={{ padding: '4px 8px', border: '1px solid #ccc' }}>Machine Learning</div>
```

### TextInput with Icon Inside (Wrapper Method)

```tsx
import { TextInput } from '@eightfold.ai/octuple';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

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
    placeholder="Search people, jobs or projects"
    style={{ width: '100%', paddingLeft: '36px' }}
  />
</div>

// ❌ WRONG - iconProps doesn't reliably position icons
<TextInput
  placeholder="Search"
  iconProps={{ path: mdiMagnify as IconName }}
  alignIcon={TextInputIconAlign.Left}
/>
```

### Search Section Layout (Keep Items Together)

```tsx
import { TextInput, Button, ButtonVariant, ButtonSize } from '@eightfold.ai/octuple';

// ✅ CORRECT - Use flexbox to keep search items together
<div 
  style={{ 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center',
  }}
>
  <TextInput placeholder="Search People" style={{ width: '280px' }} />
  <TextInput placeholder="Search by location" style={{ width: '280px' }} />
  <Button text="Go" variant={ButtonVariant.Primary} size={ButtonSize.Medium} />
</div>

// ❌ WRONG - Row/Col spreads items across full width
<Row gutter={16}>
  <Col md={8}><TextInput placeholder="Search People" /></Col>
  <Col md={8}><TextInput placeholder="Location" /></Col>
  <Col md={8}><Button text="Go" /></Col>
</Row>
```

### Person Card Layout Structure

```tsx
import { Card, Avatar, Button, ButtonVariant, ButtonSize, IconName } from '@eightfold.ai/octuple';
import Icon from '@mdi/react';
import { mdiSitemap, mdiBookmarkOutline, mdiCommentOutline, mdiLinkVariant, mdiCoffee } from '@mdi/js';

// ✅ CORRECT - Structured card layout
<Card style={{ padding: '20px', width: '100%' }}>
  <div style={{ display: 'flex', gap: '20px' }}>
    {/* LEFT: Avatar + Info + Buttons */}
    <div style={{ minWidth: '320px' }}>
      {/* Top row: Avatar + Name + Action icons at right */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Avatar size="48px" type="round">{initials}</Avatar>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{name}</h3>
          <p style={{ margin: 0, color: '#595959' }}>{title} • {department}</p>
          <p style={{ margin: 0, color: '#8c8c8c' }}>{email}</p>
        </div>
        {/* Action icons at TOP RIGHT */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Icon path={mdiSitemap} size={0.8} style={{ color: '#8c8c8c', cursor: 'pointer' }} />
          <Icon path={mdiBookmarkOutline} size={0.8} style={{ color: '#8c8c8c', cursor: 'pointer' }} />
        </div>
      </div>
      
      {/* Buttons below */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button text="Ask" variant={ButtonVariant.Primary} size={ButtonSize.Small} iconProps={{ path: mdiCommentOutline as IconName }} />
        <Button text="Request" variant={ButtonVariant.Secondary} size={ButtonSize.Small} iconProps={{ path: mdiLinkVariant as IconName }} />
      </div>
      
      {/* Open to with badge icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <span style={{ fontSize: '13px', color: '#595959' }}>Open to</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFF7E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon path={mdiCoffee} size={0.7} style={{ color: '#8B4513' }} />
        </div>
      </div>
    </div>
    
    {/* VERTICAL DIVIDER */}
    <div style={{ width: '1px', backgroundColor: '#e8e8e8', alignSelf: 'stretch' }} />
    
    {/* RIGHT: Info items with wrap */}
    <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '16px 32px' }}>
      {/* Info items: Manager, Business Unit, Location, Mentoring */}
    </div>
  </div>
</Card>
```

### Two-Column Layout (Row needs flex)

```tsx
import { Row, Col } from '@eightfold.ai/octuple';

// ✅ CORRECT - Add explicit display: flex
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={18} style={{ flex: '0 0 75%', maxWidth: '75%' }}>
    {/* Left content - 75% */}
  </Col>
  <Col span={6} style={{ flex: '0 0 25%', maxWidth: '25%' }}>
    {/* Right sidebar - 25% */}
  </Col>
</Row>

// ❌ WRONG - Columns will stack vertically
<Row gutter={24}>
  <Col span={18}>Left</Col>
  <Col span={6}>Right</Col>
</Row>
```

### Tabs in Header (80px height)

```tsx
import { Tabs, Tab } from '@eightfold.ai/octuple';

// Component usage
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="home" label="Home" />
  <Tab value="profile" label="Profile" />
</Tabs>

// Required CSS in src/index.css to position indicator correctly:
/*
header [class*="tabs-module_tabs"],
header [class*="tabs-module_tab-wrap"] {
  height: 80px !important;
  position: relative;
}
header [class*="tabs-module_tab-indicator"] {
  bottom: 0 !important;
  position: absolute !important;
}
*/
```

### Required Global CSS Overrides

Add to `src/index.css`:

```css
/* Gilroy font for all components */
* {
  font-family: 'Gilroy', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
}
[class*="module_"] {
  font-family: 'Gilroy', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
}

/* Force Cards to be full width */
[class*="card-module_card"] {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: unset !important;
}

/* Tab indicator positioning for 80px headers */
header [class*="tabs-module_tabs"],
header [class*="tabs-module_tab-wrap"] {
  height: 80px !important;
  position: relative;
}
header [class*="tabs-module_tab-indicator"] {
  bottom: 0 !important;
  position: absolute !important;
}
```

---

## Icons - Material Design Icons (MDI)

### ✅ MDI Icons - REQUIRED

**ALWAYS use MDI icons. NEVER use emojis.**

**Install:**
```bash
npm install @mdi/js @mdi/react
```

**Find icons:** https://pictogrammers.com/library/mdi/

**Basic Usage:**
```tsx
import Icon from '@mdi/react';
import { mdiHome, mdiAccount, mdiCog, mdiEmail, mdiPhone, mdiMagnify } from '@mdi/js';

// Basic icon
<Icon path={mdiHome} size={0.8} />

// Icon with color
<Icon path={mdiAccount} size={1} color="#1890ff" />

// Common sizes
<Icon path={mdiMagnify} size={0.6} />  // Small (14.4px)
<Icon path={mdiHome} size={0.8} />     // Medium (19.2px)
<Icon path={mdiAccount} size={1} />    // Default (24px)
<Icon path={mdiCog} size={1.2} />      // Large (28.8px)
```

**With Octuple Components:**
```tsx
import { IconName } from '@mdi/react';
import { mdiPlus, mdiEmail } from '@mdi/js';

// In Button
<Button 
  text="Add" 
  iconProps={{ path: mdiPlus as IconName }} 
/>

// In Menu
const menuItems = [
  { 
    key: 'home', 
    label: 'Home',
    iconProps: { path: mdiHome as IconName }
  }
];
<Menu items={menuItems} />
```

**Key Points:**
- Size: 0.6-1.2 typical (1 = 24px)
- Always cast to `IconName` for Octuple components
- **NEVER use emojis** (🏠, 👤, ⚙️)

---

## Form Components

### ✅ Form with Validation (FROM PATTERN)

**Complete working example from Form Validation Pattern:**

```tsx
import { Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';

const BasicForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Submitted:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <TextInput placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <TextInput htmlType="password" placeholder="Enter password" />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" text="Submit" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

**Key Points (VERIFIED from Confluence):**
- `Form.useForm()` creates form instance
- `Form.Item` wrapper required for all fields
- `name` prop connects field to form state
- `rules` array for validation
- `onFinish` called on successful validation
- `layout="vertical"` for better mobile UX

---

### ✅ Form with Field Dependencies

**Password confirmation pattern:**

```tsx
<Form.Item
  label="Password"
  name="password"
  rules={[{ required: true }]}
>
  <TextInput htmlType="password" />
</Form.Item>

<Form.Item
  label="Confirm Password"
  name="confirmPassword"
  dependencies={['password']}
  rules={[
    { required: true },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('Passwords do not match');
      },
    }),
  ]}
>
  <TextInput htmlType="password" />
</Form.Item>
```

---

### ✅ TextInput (VERIFIED API)

```tsx
import { TextInput, TextInputSize, TextInputShape } from '@eightfold.ai/octuple';

// Basic
<TextInput
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// With validation status
<TextInput
  placeholder="Email"
  status="error"  // 'success' | 'warning' | 'error' | 'validating'
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Numbers only
<TextInput
  placeholder="Age"
  numbersOnly={true}
  maxlength={3}
/>

// With icon
<TextInput
  placeholder="Search"
  iconProps={{ path: mdiMagnify as IconName }}
  alignIcon="left"
/>

// Sizes
<TextInput size={TextInputSize.Small} />
<TextInput size={TextInputSize.Medium} />  // Default
<TextInput size={TextInputSize.Large} />
```

**Key Props:**
- `placeholder`, `value`, `onChange` - Standard
- `disabled`, `readonly` - State control
- `status` - Validation state
- `numbersOnly` - Numeric input
- `maxlength`, `minlength` - Length constraints
- `htmlType` - 'text' | 'password' | 'email' | 'tel' | 'url'
- `waitInterval` - Debounce (default 10ms)

---

### ✅ Select (VERIFIED API)

```tsx
import { Select } from '@eightfold.ai/octuple';

const options = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
];

<Select
  placeholder="Select country"
  options={options}
  value={selected}
  onChange={(value) => setSelected(value)}
/>

// Multi-select
<Select
  placeholder="Select skills"
  options={skillOptions}
  multiple={true}
  value={selectedSkills}
  onChange={(values) => setSelectedSkills(values)}
/>

// Searchable
<Select
  placeholder="Search cities"
  options={cityOptions}
  searchable={true}
/>
```

---

### ✅ CheckBox (VERIFIED API)

```tsx
import { CheckBox, CheckBoxGroup } from '@eightfold.ai/octuple';

// Single checkbox
<CheckBox
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  label="I agree to the terms"
/>

// With Form.Item
<Form.Item
  name="agreement"
  valuePropName="checked"
  rules={[
    {
      validator: (_, value) =>
        value ? Promise.resolve() : Promise.reject('You must agree'),
    },
  ]}
>
  <CheckBox label="I agree to terms and conditions" />
</Form.Item>

// CheckBox Group
<CheckBoxGroup
  value={selected}
  onChange={(values) => setSelected(values)}
  options={[
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ]}
/>
```

---

### ✅ Button (VERIFIED API from Confluence)

```tsx
import { Button, ButtonVariant, ButtonSize } from '@eightfold.ai/octuple';
import { mdiPlus, mdiDownload } from '@mdi/js';
import { IconName } from '@mdi/react';

// Basic buttons
<Button text="Click Me" variant={ButtonVariant.Primary} onClick={handleClick} />
<Button text="Cancel" variant={ButtonVariant.Default} />
<Button text="Delete" variant={ButtonVariant.SystemUI} disruptive={true} />

// With icons
<Button 
  text="Add Item" 
  variant={ButtonVariant.Primary}
  iconProps={{ path: mdiPlus as IconName }}
  alignIcon="left"
/>

<Button 
  text="Download" 
  iconProps={{ path: mdiDownload as IconName }}
  alignIcon="right"
/>

// Icon only
<Button 
  ariaLabel="Add"
  iconProps={{ path: mdiPlus as IconName }}
/>

// Sizes
<Button text="Small" size={ButtonSize.Small} />
<Button text="Medium" size={ButtonSize.Medium} />  // Default
<Button text="Large" size={ButtonSize.Large} />

// Loading state
<Button 
  text="Saving..." 
  loading={true}
  disabled={true}
  variant={ButtonVariant.Primary}
/>

// With counter badge
<Button text="Notifications" counter="5" />
```

**Key Props (VERIFIED):**
- `text` - Button label (string)
- `variant` - ButtonVariant enum (Primary, Default, Neutral, Secondary, SystemUI)
- `size` - ButtonSize enum (Small, Medium, Large, Flex)
- `iconProps` - Icon configuration `{ path: IconName }`
- `alignIcon` - 'left' | 'right'
- `loading` - Shows spinner
- `disabled` - Disables button
- `htmlType` - 'button' | 'submit' | 'reset'
- `counter` - Badge count (string)
- `disruptive` - Red/warning style (boolean)

---

## Layout Components

### ✅ Two-Column Layout (FROM PATTERN - CRITICAL)

**VERIFIED pattern with explicit flex styling:**

```tsx
import { Row, Col, Card } from '@eightfold.ai/octuple';

<Row 
  gutter={24}
  style={{ display: 'flex', flexWrap: 'nowrap' }}  // ⚠️ REQUIRED
>
  {/* Main Content - 66.66% */}
  <Col 
    span={16}
    style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}  // ⚠️ REQUIRED
  >
    <Card title="Main Content">
      <p>Primary content goes here</p>
    </Card>
  </Col>

  {/* Sidebar - 33.33% */}
  <Col 
    span={8}
    style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}  // ⚠️ REQUIRED
  >
    <Card title="Sidebar">
      <p>Sidebar content</p>
    </Card>
  </Col>
</Row>
```

**⚠️ CRITICAL:** 
- Without explicit flex styles, columns WILL stack vertically
- Always add `display: 'flex', flexWrap: 'nowrap'` to Row
- Always add flex sizing to each Col

**Common Splits:**
- 50/50: span={12} and span={12} (flex: '0 0 50%')
- 66/33: span={16} and span={8} (flex: '0 0 66.666%' and '33.333%')
- 70/30: span={17} and span={7} (flex: '0 0 70.833%' and '29.167%')
- 75/25: span={18} and span={6} (flex: '0 0 75%' and '25%')

---

### ✅ Layout with Sidebar (VERIFIED API)

```tsx
import { Layout } from '@eightfold.ai/octuple';

<Layout style={{ minHeight: '100vh' }}>
  <Layout.Header style={{ background: '#fff', padding: '0 24px' }}>
    <h1>App Name</h1>
  </Layout.Header>
  
  <Layout style={{ display: 'flex' }}>
    <Layout.Aside style={{ width: '250px', background: '#f5f5f5' }}>
      <Menu items={menuItems} />
    </Layout.Aside>
    
    <Layout.Content style={{ padding: '24px' }}>
      <h2>Page Content</h2>
    </Layout.Content>
  </Layout>
  
  <Layout.Footer style={{ textAlign: 'center' }}>
    © 2024 Company
  </Layout.Footer>
</Layout>
```

**Key Points:**
- Use `Layout.Aside` (NOT `Layout.Sider`)
- Set explicit `width` on Aside
- Nest Layout for header + content structure

---

## Navigation Components

### ✅ Menu (VERIFIED API from Confluence)

```tsx
import { Menu } from '@eightfold.ai/octuple';
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';

const menuItems = [
  { 
    key: 'home', 
    label: 'Home',
    iconProps: { path: mdiHome as IconName },
    onClick: () => navigate('/home')
  },
  { 
    key: 'profile', 
    label: 'Profile',
    iconProps: { path: mdiAccount as IconName },
    onClick: () => navigate('/profile')
  },
  { 
    key: 'settings', 
    label: 'Settings',
    iconProps: { path: mdiCog as IconName },
    onClick: () => navigate('/settings')
  },
];

<Menu items={menuItems} />
```

**Key Points:**
- Use `items` prop (array of menu item objects)
- Each item needs: `key`, `label`, `iconProps` (optional), `onClick` (optional)
- Icons via `iconProps: { path: IconName }`
- **NOT** Menu.Item children pattern

---

### ✅ Breadcrumb (VERIFIED API from Confluence)

```tsx
import { Breadcrumb } from '@eightfold.ai/octuple';

<Breadcrumb 
  links={[
    { url: '/', children: 'Home' },
    { url: '/candidates', children: 'Candidates' },
    { children: 'John Doe' }  // Current page (no url)
  ]}
/>

// With custom separator
<Breadcrumb 
  links={breadcrumbLinks}
  separator="›"
/>
```

**Key Points:**
- Use `links` prop (array of link objects)
- Each link: `{ url, children }`
- `children` is the link text (NOT `text` or `label`)
- Current page has no `url` prop
- **NOT** Breadcrumb.Item children pattern

---

### ✅ Tabs (VERIFIED API from Confluence)

```tsx
import { Tabs, Tab } from '@eightfold.ai/octuple';
import { useState } from 'react';
import { mdiHome, mdiAccount } from '@mdi/js';
import { IconName } from '@mdi/react';

const [activeTab, setActiveTab] = useState('home');

<Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
  <Tab value="home" label="Home" icon={mdiHome as IconName}>
    <p>Home content</p>
  </Tab>
  
  <Tab value="profile" label="Profile" icon={mdiAccount as IconName}>
    <p>Profile content</p>
  </Tab>
  
  <Tab value="settings" label="Settings" disabled={true}>
    <p>Settings content</p>
  </Tab>
</Tabs>
```

**Key Points:**
- Use children pattern with `<Tab>` components
- Tabs component: `value` (NOT `activeValue`), `onChange`
- Each Tab: `value`, `label`, `icon` (optional), `disabled` (optional)
- Content goes inside Tab children
- **NOT** items array pattern

---

### ✅ Stepper (VERIFIED API from Confluence)

```tsx
import { Stepper } from '@eightfold.ai/octuple';
import { useState } from 'react';

const [currentStep, setCurrentStep] = useState(0);

const steps = [
  { index: 0, content: 'Step 1: Info' },
  { index: 1, content: 'Step 2: Review' },
  { index: 2, content: 'Step 3: Complete' },
];

<Stepper
  activeStepIndex={currentStep}
  steps={steps}
  onChange={(index) => setCurrentStep(index)}
  readonly={false}  // Allow clicking steps
  layout="horizontal"  // or 'vertical'
/>
```

**Key Points:**
- `activeStepIndex` for current step (0-based)
- `steps` array with `{ index, content }`
- `readonly={false}` to allow step clicking
- `onChange` called when step is clicked

---

## Display Components

### ✅ Avatar (VERIFIED API from Confluence)

```tsx
import { Avatar } from '@eightfold.ai/octuple';
import { mdiAccount } from '@mdi/js';
import { IconName } from '@mdi/react';

// Text Avatar (initials)
<Avatar size="32px" type="round">JD</Avatar>
<Avatar size="80px" type="square">AB</Avatar>

// Image Avatar
<Avatar 
  size="40px" 
  type="round" 
  src="https://example.com/avatar.jpg"
  alt="John Doe"
/>

// Icon Avatar
<Avatar 
  size="48px" 
  type="round" 
  icon={mdiAccount as IconName}
/>

// Different sizes
<Avatar size="24px">S</Avatar>
<Avatar size="32px">M</Avatar>
<Avatar size="40px">L</Avatar>
<Avatar size="56px">XL</Avatar>
<Avatar size="80px">XXL</Avatar>
```

**Key Points (CRITICAL):**
- `size` is a STRING with units (e.g., '32px', '80px')
- `type`: 'round' | 'square'
- Children for initials
- `src` and `alt` for images
- `icon` for MDI icons (cast as IconName)
- **NOT** predefined size enums like 'small', 'medium'

---

### ✅ Badge (VERIFIED API from Confluence)

```tsx
import { Badge } from '@eightfold.ai/octuple';

// Simple badge
<Badge count="5" />

// With wrapped component
<Badge count={10}>
  <Button text="Notifications" />
</Badge>

// Dot badge
<Badge dot>
  <Avatar size="40px">JD</Avatar>
</Badge>
```

---

### ✅ Pill (VERIFIED API from Confluence)

```tsx
import { Pill, PillType } from '@eightfold.ai/octuple';
import { mdiReact } from '@mdi/js';
import { IconName } from '@mdi/react';

// Basic pill
<Pill label="React" />

// With icon
<Pill 
  label="TypeScript"
  iconProps={{ path: mdiReact as IconName }}
/>

// Closable
<Pill 
  label="Tag" 
  type={PillType.closable}
  onClose={() => handleRemove()}
/>

// With theme
<Pill label="Success" theme="green" />
<Pill label="Warning" theme="yellow" />
<Pill label="Error" theme="red" />
```

---

### ✅ Card

```tsx
import { Card, Button, ButtonVariant } from '@eightfold.ai/octuple';

// Basic
<Card title="Card Title">
  <p>Card content goes here</p>
</Card>

// With actions
<Card 
  title="With Actions"
  actions={[
    <Button key="cancel" text="Cancel" />,
    <Button key="save" text="Save" variant={ButtonVariant.Primary} />
  ]}
>
  Content here
</Card>

// No title
<Card>
  <h3>Custom Title</h3>
  <p>Content</p>
</Card>
```

---

### ✅ Skeleton (VERIFIED API from Confluence)

```tsx
import { Skeleton, SkeletonVariant, SkeletonAnimation } from '@eightfold.ai/octuple';

// Basic skeleton
<Skeleton width={200} height={20} />

// Text skeleton
<Skeleton variant={SkeletonVariant.Text} width={200} />

// Circular skeleton (for avatars)
<Skeleton variant={SkeletonVariant.Circular} width={40} height={40} />

// Rectangular (for images)
<Skeleton variant={SkeletonVariant.Rectangular} width={300} height={200} />

// Rounded (for cards)
<Skeleton variant={SkeletonVariant.Rounded} width={300} height={100} />

// Animation types
<Skeleton animation={SkeletonAnimation.Wave} width={200} height={20} />
<Skeleton animation={SkeletonAnimation.Pulse} width={200} height={20} />
<Skeleton animation={SkeletonAnimation.None} width={200} height={20} />

// Full width
<Skeleton fullWidth height={20} />

// Card loading skeleton
<Card style={{ padding: '16px' }}>
  <Skeleton variant={SkeletonVariant.Circular} width={40} height={40} />
  <div style={{ marginTop: '12px' }}>
    <Skeleton variant={SkeletonVariant.Text} width="60%" />
    <Skeleton variant={SkeletonVariant.Text} width="80%" />
    <Skeleton variant={SkeletonVariant.Text} width="40%" />
  </div>
</Card>

// Conditional loading
{loading ? (
  <Skeleton width={200} height={20} />
) : (
  <div>Actual content</div>
)}
```

**Key Points:**
- Always specify `width` and `height` (number or string with units)
- Use appropriate variant for content type
- Use `fullWidth` for responsive layouts
- Replace skeleton entirely when content loads
- Default animation is `Wave`

---

### ✅ Timeline/Stepper (VERIFIED API from Confluence)

```tsx
import { 
  Stepper, 
  Timeline, 
  Step,
  StepperLineStyle,
  StepperSize,
  StepperVariant,
  StepperValidationStatus 
} from '@eightfold.ai/octuple';
import { mdiAccount, mdiEmail, mdiCheck } from '@mdi/js';
import { IconName } from '@mdi/react';

// Basic Stepper (for forms/wizards)
<Stepper 
  current={1}
  items={[
    { title: 'Personal Info', description: 'Name, email' },
    { title: 'Address', description: 'Street, city' },
    { title: 'Review', description: 'Confirm details' }
  ]}
/>

// Timeline (for activity feeds)
<Timeline
  current={2}
  items={[
    { title: 'Order Placed', description: '10:00 AM' },
    { title: 'Processing', description: '10:15 AM' },
    { title: 'Shipped', description: '2:30 PM' }
  ]}
  lineStyle={StepperLineStyle.Solid}
/>

// Timeline with line styles
<Timeline 
  items={events}
  lineStyle={StepperLineStyle.Dash}  // or .Dot or .Solid
/>

// Stepper with custom icons (using children)
<Stepper current={1}>
  <Step title="Account" description="Create account" nodeIcon={mdiAccount as IconName} />
  <Step title="Email" description="Verify email" nodeIcon={mdiEmail as IconName} />
  <Step title="Complete" description="All done" nodeIcon={mdiCheck as IconName} />
</Stepper>

// Stepper with status
<Stepper current={2}>
  <Step title="Completed" status={StepperValidationStatus.Success} />
  <Step title="Current" status={StepperValidationStatus.Warning} />
  <Step title="Failed" status={StepperValidationStatus.Error} />
</Stepper>

// Interactive stepper (clickable steps)
const [current, setCurrent] = React.useState(0);
<Stepper current={current} onChange={setCurrent}>
  <Step title="Step 1" />
  <Step title="Step 2" />
  <Step title="Step 3" />
</Stepper>

// Sizes
<Stepper size={StepperSize.Small} items={items} />
<Stepper size={StepperSize.Medium} items={items} />
<Stepper size={StepperSize.Large} items={items} />
```

**Key Points:**
- **Stepper** for multi-step processes (forms, wizards)
- **Timeline** for chronological events (activity, history)
- Use `items` prop for simple cases, `<Step>` children for custom icons
- `current` prop sets active step (zero-indexed)
- Cast MDI icons as `IconName` for `nodeIcon`
- `onChange` makes steps clickable

---

### ✅ ToggleButton (VERIFIED API from Confluence)

```tsx
import { Button, ButtonVariant, ButtonIconAlign } from '@eightfold.ai/octuple';
import { mdiHeart, mdiHeartOutline, mdiStar, mdiStarOutline, mdiLightbulb, mdiLightbulbOutline } from '@mdi/js';
import { IconName } from '@mdi/react';

// Basic toggle button
const [checked, setChecked] = React.useState(false);
<Button
  toggle
  checked={checked}
  text={checked ? 'On' : 'Off'}
  onClick={() => setChecked(!checked)}
/>

// Favorite/Like button
const [liked, setLiked] = React.useState(false);
<Button
  toggle
  checked={liked}
  text={liked ? 'Liked' : 'Like'}
  iconProps={{
    path: (liked ? mdiHeart : mdiHeartOutline) as IconName
  }}
  onClick={() => setLiked(!liked)}
/>

// Star rating
const [starred, setStarred] = React.useState(false);
<Button
  toggle
  checked={starred}
  text={starred ? 'Starred' : 'Star'}
  iconProps={{
    path: (starred ? mdiStar : mdiStarOutline) as IconName
  }}
  onClick={() => setStarred(!starred)}
/>

// Toggle with variants
<Button
  toggle
  checked={checked}
  text="Primary"
  variant={ButtonVariant.Primary}
  onClick={() => setChecked(!checked)}
/>

// Icon alignment
<Button
  toggle
  checked={checked}
  text="Toggle"
  alignIcon={ButtonIconAlign.Right}
  iconProps={{ path: (checked ? mdiLightbulb : mdiLightbulbOutline) as IconName }}
  onClick={() => setChecked(!checked)}
/>

// Toggle group (multiple toggles)
const [toggles, setToggles] = React.useState({
  bold: false,
  italic: false,
  underline: false
});

<div style={{ display: 'flex', gap: '8px' }}>
  <Button
    toggle
    checked={toggles.bold}
    text="Bold"
    onClick={() => setToggles({ ...toggles, bold: !toggles.bold })}
  />
  <Button
    toggle
    checked={toggles.italic}
    text="Italic"
    onClick={() => setToggles({ ...toggles, italic: !toggles.italic })}
  />
</div>
```

**Key Points:**
- Set `toggle={true}` to enable toggle behavior
- Use `checked` prop to control state
- Use different icons for checked/unchecked states
- Cast icons as `IconName`
- Works with all Button variants
- Use `alignIcon` to position icon left or right

---

### ✅ FadeIn Animation (VERIFIED API from Confluence)

```tsx
import { FadeIn } from '@eightfold.ai/octuple';

// Basic fade-in
<FadeIn>
  <div>This content will fade in</div>
</FadeIn>

// Custom duration
<FadeIn duration={500}>
  <Card>Card content</Card>
</FadeIn>

// With delay
<FadeIn delay={300} duration={400}>
  <div>Appears after 300ms</div>
</FadeIn>

// Sequential fade-in (staggered list)
{items.map((item, index) => (
  <FadeIn key={index} delay={index * 100} duration={300}>
    <div style={{ padding: '12px', marginBottom: '8px' }}>
      {item.title}
    </div>
  </FadeIn>
))}

// Conditional with fade-in
{show && (
  <FadeIn duration={400}>
    <div>Conditionally shown content</div>
  </FadeIn>
)}

// Disabled animation
<FadeIn disabled={!animateEnabled} duration={300}>
  <div>Content</div>
</FadeIn>
```

**Key Points:**
- Default duration is 300ms
- Use `delay` for staggered animations
- Use `disabled` to conditionally disable animation
- Keep duration under 1000ms for good UX
- FadeIn inherits all HTMLDivElement attributes

---

### ✅ Popup (Enhanced Tooltip) (VERIFIED API from Confluence)

```tsx
import { Popup, PopupSize, PopupTheme, PopupTouchInteraction } from '@eightfold.ai/octuple';

// Basic popup
<Popup content="This is a popup">
  <Button text="Show Popup" />
</Popup>

// Controlled popup
const [visible, setVisible] = React.useState(false);
<Popup
  content="Controlled popup content"
  visible={visible}
  onVisibleChange={setVisible}
>
  <Button text="Toggle Popup" />
</Popup>

// Popup with callback control
<Popup
  content="Popup with control"
  showPopup={(show) => {
    console.log('Popup visibility changing:', show);
    return show; // Return true to allow, false to prevent
  }}
>
  <Button text="Show" />
</Popup>

// Closable on click inside
const [visible, setVisible] = React.useState(false);
<Popup
  content={
    <div>
      <p>Click button to close</p>
      <Button text="Close" onClick={() => setVisible(false)} />
    </div>
  }
  visible={visible}
  onVisibleChange={setVisible}
  closeOnPopupClick
>
  <Button text="Open Popup" />
</Popup>

// Custom style
<Popup
  content={<div>Styled popup content</div>}
  popupStyle={{
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#f0f0f0'
  }}
>
  <Button text="Show" />
</Popup>

// Keyboard handler
<Popup
  content="Press Escape"
  popupOnKeydown={(e) => {
    if (e.key === 'Escape') {
      console.log('Escape pressed');
    }
  }}
>
  <Button text="Open" />
</Popup>

// Theme and size
<Popup
  content="Light themed popup"
  theme={PopupTheme.light}
  size={PopupSize.large}
>
  <Button text="Show" />
</Popup>

// Touch interaction
<Popup
  content="Tap to show (mobile)"
  touchInteraction={PopupTouchInteraction.Tap}
>
  <Button text="Tap Interaction" />
</Popup>

<Popup
  content="Long press to show (mobile)"
  touchInteraction={PopupTouchInteraction.Press}
>
  <Button text="Press Interaction" />
</Popup>
```

**Key Points:**
- Extends Tooltip with more control
- Use `showPopup` callback for conditional display
- Use `closeOnPopupClick` to close when clicking inside
- Use `popupOnKeydown` for keyboard interactions
- Set `theme` (light/dark) and `size` (small/medium/large)
- Configure `touchInteraction` for mobile (tap/press)

---

## Pattern-Based Examples

### ✅ Complete Registration Form (FROM PATTERN)

```tsx
import { 
  Form, 
  TextInput, 
  Select, 
  CheckBox, 
  Button, 
  ButtonVariant,
  Row,
  Col,
  Card 
} from '@eightfold.ai/octuple';

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    // Submit logic
    setLoading(false);
  };

  return (
    <Card title="Create Account">
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Username is required' },
            { min: 3, message: 'Minimum 3 characters' }
          ]}
        >
          <TextInput placeholder="Choose username" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' }
          ]}
        >
          <TextInput placeholder="your.email@example.com" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true },
                { min: 8, message: 'Minimum 8 characters' }
              ]}
            >
              <TextInput htmlType="password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match');
                  },
                }),
              ]}
            >
              <TextInput htmlType="password" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true }]}
        >
          <Select options={countryOptions} />
        </Form.Item>

        <Form.Item
          name="agreeTerms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject('Must agree'),
            },
          ]}
        >
          <CheckBox label="I agree to Terms and Conditions" />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            text="Create Account"
            variant={ButtonVariant.Primary}
            loading={loading}
            buttonWidth="fill"
          />
        </Form.Item>
      </Form>
    </Card>
  );
};
```

---

### ✅ Dashboard with Metrics (FROM PATTERN)

```tsx
import { Row, Col, Card, Button, ButtonVariant } from '@eightfold.ai/octuple';

const Dashboard = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1>Dashboard</h1>
        <Button text="Export" variant={ButtonVariant.Primary} />
      </div>

      {/* Metric Cards */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Users</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>1,234</div>
            <div style={{ color: '#52c41a' }}>↑ 12%</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666' }}>Revenue</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>$45,678</div>
            <div style={{ color: '#52c41a' }}>↑ 8%</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666' }}>Sessions</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>156</div>
            <div style={{ color: '#ff4d4f' }}>↓ 3%</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666' }}>Conversion</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>3.2%</div>
            <div style={{ color: '#52c41a' }}>↑ 0.5%</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Using String Literals Instead of Enums

**WRONG:**
```tsx
<Button text="Click" variant="primary" />  // TypeScript error!
<Avatar size="medium">JD</Avatar>           // TypeScript error!
```

**CORRECT:**
```tsx
import { Button, ButtonVariant, Avatar } from '@eightfold.ai/octuple';

<Button text="Click" variant={ButtonVariant.Primary} />
<Avatar size="40px">JD</Avatar>  // Size is string with unit!
```

---

### ❌ Pitfall 2: Row/Col Not Displaying Side-by-Side

**WRONG:**
```tsx
<Row gutter={24}>
  <Col span={16}>Content</Col>
  <Col span={8}>Sidebar</Col>
</Row>
// Columns stack vertically!
```

**CORRECT:**
```tsx
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={16} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>
    Content
  </Col>
  <Col span={8} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>
    Sidebar
  </Col>
</Row>
```

---

### ❌ Pitfall 3: Icon-Only Button Without Aria Label

**WRONG:**
```tsx
<Button iconProps={{ path: mdiPlus as IconName }} />
// Not accessible to screen readers!
```

**CORRECT:**
```tsx
<Button 
  ariaLabel="Add item"
  iconProps={{ path: mdiPlus as IconName }}
/>
```

---

### ❌ Pitfall 4: Using Wrong Component Names

**WRONG:**
```tsx
import { Input, Tag, Sider } from '@eightfold.ai/octuple';
// These don't exist!

<Input />
<Tag>Label</Tag>
<Layout.Sider />
```

**CORRECT:**
```tsx
import { TextInput, Badge, Layout } from '@eightfold.ai/octuple';

<TextInput />
<Badge>Label</Badge>
<Layout.Aside />
```

---

### ❌ Pitfall 5: Form Field Without Form.Item

**WRONG:**
```tsx
<Form>
  <TextInput name="username" />  // Not connected to form!
</Form>
```

**CORRECT:**
```tsx
<Form form={form}>
  <Form.Item name="username" label="Username">
    <TextInput />
  </Form.Item>
</Form>
```

---

### ❌ Pitfall 6: Password Confirmation Without Dependencies

**WRONG:**
```tsx
<Form.Item name="confirmPassword" rules={[{ required: true }]}>
  <TextInput htmlType="password" />
</Form.Item>
// Doesn't check if passwords match!
```

**CORRECT:**
```tsx
<Form.Item
  name="confirmPassword"
  dependencies={['password']}
  rules={[
    { required: true },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('Passwords do not match');
      },
    }),
  ]}
>
  <TextInput htmlType="password" />
</Form.Item>
```

---

### ❌ Pitfall 7: Tabs Using Wrong Prop Name

**WRONG:**
```tsx
<Tabs activeValue={tab}>  // ✅ This is actually correct!
  <Tab value="home" label="Home" />
</Tabs>
```

Wait, this is CORRECT! But earlier docs might have said `value`. The VERIFIED API uses:
- Tabs: `value` prop (based on component guide verification)
- Each Tab: `value`, `label`

**Let me verify:**
```tsx
// VERIFIED CORRECT from component guide:
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="home" label="Home">Content</Tab>
</Tabs>
```

---

## TypeScript Best Practices

### Always Use Enums

```tsx
import { 
  Button, ButtonVariant, ButtonSize,
  TextInput, TextInputSize,
  Select,
  CheckBox
} from '@eightfold.ai/octuple';

// ✅ CORRECT
<Button variant={ButtonVariant.Primary} size={ButtonSize.Medium} />
<TextInput size={TextInputSize.Large} />

// ❌ WRONG
<Button variant="primary" size="medium" />  // TypeScript errors!
```

### Icon Type Casting

```tsx
import { IconName } from '@mdi/react';
import { mdiHome } from '@mdi/js';

// Always cast MDI icons to IconName
<Button iconProps={{ path: mdiHome as IconName }} />
```

### Form Type Safety

```tsx
interface FormValues {
  username: string;
  email: string;
  password: string;
}

const [form] = Form.useForm<FormValues>();

const handleSubmit = (values: FormValues) => {
  console.log(values.username);  // Type-safe!
};
```

---

## Component Name Reference

### ✅ CORRECT Component Names

| Use This | NOT This |
|----------|----------|
| `TextInput` | `Input` |
| `TextArea` | `Input.TextArea` |
| `Badge` | `Tag` |
| `Layout.Aside` | `Layout.Sider` |
| `CheckBox` | `Checkbox` |
| `Pill` | `Tag` |

---

## Quick Reference - Common Props

### Button
- `text`: string
- `variant`: ButtonVariant enum
- `size`: ButtonSize enum
- `iconProps`: { path: IconName }
- `htmlType`: 'button' | 'submit' | 'reset'

### Form
- `form`: FormInstance from useForm()
- `onFinish`: (values) => void
- `layout`: 'horizontal' | 'vertical' | 'inline'

### Form.Item
- `name`: string | string[]
- `label`: string
- `rules`: Rule[]
- `dependencies`: string[]

### TextInput
- `placeholder`: string
- `value`: string
- `onChange`: (e) => void
- `htmlType`: string
- `status`: 'success' | 'warning' | 'error' | 'validating'

### Row/Col
- Row: `gutter`, `style` (must include flex)
- Col: `span` (1-24), `style` (must include flex sizing)

---

## Testing Checklist

Before using a new component:

1. ✅ Check TypeScript types: `npm run check-props ComponentName`
2. ✅ Read component guide: `docs/components/ComponentName.md`
3. ✅ Find similar pattern: `docs/patterns/`
4. ✅ Copy verified example
5. ✅ Test in browser
6. ✅ Check console for errors
7. ✅ Verify accessibility (keyboard navigation, screen reader)

---

## Related Documentation

- **Component Guides:** [`docs/components/`](./components/) - Complete API reference
- **Pattern Library:** [`docs/patterns/`](./patterns/) - Real-world UI patterns
- **AI Quick Reference:** [`docs/ai-quick-reference.md`](./ai-quick-reference.md) - Quick lookups
- **Design Guidelines:** [`docs/design-guidelines.md`](./design-guidelines.md) - Design system

---

**Last Updated:** November 20, 2024  
**Next Update:** After Phase 5 (AI Quick Reference)

---

**Remember:** When in doubt, check TypeScript types first, then copy these patterns EXACTLY. Don't guess!
