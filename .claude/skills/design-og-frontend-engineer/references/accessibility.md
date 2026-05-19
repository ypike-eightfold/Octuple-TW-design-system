# Accessibility Guidelines

**Purpose:** Ensure Octuple applications are accessible to all users  
**Status:** ✅ Complete  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Standards:** WCAG 2.1 Level AA Compliance  
**Source:** Octuple Design System + Confluence Documentation

---

## 🎯 Overview

### Why Accessibility Matters

**Legal Requirements:**
- **ADA (Americans with Disabilities Act):** Requires accessible digital experiences
- **Section 508:** Federal accessibility standards
- **WCAG 2.1:** International web accessibility guidelines

**Business Benefits:**
- **Larger Audience:** 15% of global population has disabilities
- **Better UX:** Accessible design benefits all users
- **SEO:** Better semantic HTML improves search rankings
- **Brand Reputation:** Demonstrates social responsibility

**Ethical Responsibility:**
- Everyone deserves equal access to information and services
- Inclusive design creates a better world

---

### WCAG 2.1 Principles (POUR)

#### 1. **Perceivable**
Information and UI components must be presentable to users in ways they can perceive.

**Key Requirements:**
- Text alternatives for non-text content
- Captions and alternatives for multimedia
- Content can be presented in different ways
- Distinguishable content (color contrast, text sizing)

#### 2. **Operable**
UI components and navigation must be operable.

**Key Requirements:**
- All functionality available from keyboard
- Users have enough time to read and use content
- Content doesn't cause seizures (no rapid flashing)
- Users can navigate and find content

#### 3. **Understandable**
Information and UI operation must be understandable.

**Key Requirements:**
- Text is readable and understandable
- Content appears and operates predictably
- Users are helped to avoid and correct mistakes

#### 4. **Robust**
Content must be robust enough to work with assistive technologies.

**Key Requirements:**
- Compatible with current and future technologies
- Valid, parseable HTML
- Proper ARIA usage

---

## ⌨️ Keyboard Navigation

### Universal Keyboard Shortcuts

| Key | Action | WCAG Criterion |
|-----|--------|----------------|
| **Tab** | Move focus forward | 2.1.1 Keyboard |
| **Shift+Tab** | Move focus backward | 2.1.1 Keyboard |
| **Enter** | Activate button/link | 2.1.1 Keyboard |
| **Space** | Activate button/checkbox | 2.1.1 Keyboard |
| **Escape** | Close modal/drawer/dropdown | 2.1.2 No Keyboard Trap |
| **Arrow keys** | Navigate within component | 2.1.1 Keyboard |
| **Home** | Move to first item | 2.1.1 Keyboard |
| **End** | Move to last item | 2.1.1 Keyboard |

---

### Focus Management

#### Visual Focus Indicators

**WCAG Requirement:** 2.4.7 Focus Visible (Level AA)

**Octuple Focus Style:**
```css
:focus-visible {
  outline: 2px solid #1890ff;  /* Primary blue */
  outline-offset: 2px;
  border-radius: 2px;
}
```

**Requirements:**
- ✅ Minimum 2px outline
- ✅ 3:1 contrast ratio with background
- ✅ Visible on all interactive elements
- ✅ Never remove with `outline: none` without replacement

**Example:**
```tsx
// Custom focus style
<Button
  text="Submit"
  style={{
    ':focus-visible': {
      outline: '2px solid #1890ff',
      outlineOffset: '2px',
    }
  }}
/>
```

---

#### Focus Order (Tab Order)

**WCAG Requirement:** 2.4.3 Focus Order (Level A)

**Logical Tab Order:**
```
1. Skip to main content link (optional but recommended)
2. Header / Top navigation
3. Main content area (left to right, top to bottom)
4. Sidebar content (if present)
5. Footer navigation / links
```

**DO's:**
- ✅ Follow visual reading order (left-to-right, top-to-bottom)
- ✅ Use semantic HTML for natural tab order
- ✅ Test tab order regularly

**DON'Ts:**
- ❌ Don't use positive `tabindex` values (tabindex="1", "2", etc.)
- ❌ Don't create illogical focus jumps
- ❌ Don't hide focusable elements off-screen without tabindex="-1"

**Example:**
```tsx
// Good: Natural DOM order
<Layout>
  <Layout.Header>Navigation</Layout.Header>
  <Layout.Content>Main content</Layout.Content>
  <Layout.Footer>Footer</Layout.Footer>
</Layout>

// Bad: Using positive tabindex
<Button tabIndex={3}>Third</Button>
<Button tabIndex={1}>First</Button>  // ❌ Don't do this!
```

---

#### Focus Trapping

**WCAG Requirement:** 2.1.2 No Keyboard Trap (Level A)

**When to Trap Focus:**
- ✅ Modals / Dialogs
- ✅ Drawers / Side panels
- ✅ Full-screen overlays

**How to Trap Focus:**
```tsx
import { useEffect, useRef } from 'react';

const Modal = ({ visible, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [visible]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};
```

**Focus Return:**
```tsx
// Save focus before opening modal
const triggerRef = useRef();

const handleOpen = () => {
  triggerRef.current = document.activeElement;
  setModalVisible(true);
};

const handleClose = () => {
  setModalVisible(false);
  // Return focus to trigger
  triggerRef.current?.focus();
};
```

---

### Component-Specific Keyboard Patterns

#### Button
**WCAG Criterion:** 2.1.1 Keyboard

| Key | Action |
|-----|--------|
| **Enter** | Activate button |
| **Space** | Activate button |

```tsx
<Button text="Submit" onClick={handleSubmit} />
// Octuple handles keyboard automatically
```

---

#### Menu
**ARIA Pattern:** [Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/)

| Key | Action |
|-----|--------|
| **Arrow Down** | Next menu item |
| **Arrow Up** | Previous menu item |
| **Home** | First menu item |
| **End** | Last menu item |
| **Enter** | Select item |
| **Space** | Select item |
| **Escape** | Close menu |
| **Tab** | Close menu, move to next element |

```tsx
<Menu
  items={menuItems}
  onItemClick={(key) => handleSelect(key)}
/>
// Octuple handles keyboard navigation
```

---

#### Tabs
**ARIA Pattern:** [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/)

| Key | Action |
|-----|--------|
| **Arrow Left** | Previous tab |
| **Arrow Right** | Next tab |
| **Home** | First tab |
| **End** | Last tab |
| **Tab** | Move focus to tab panel |

```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="tab1" label="Profile">
    <div>Profile content (focusable with Tab)</div>
  </Tab>
</Tabs>
```

---

#### Form Fields
**WCAG Criterion:** 2.1.1 Keyboard, 3.3.2 Labels or Instructions

| Key | Action |
|-----|--------|
| **Tab** | Next field |
| **Shift+Tab** | Previous field |
| **Enter** | Submit form (when in text input) |

```tsx
<Form form={form} onFinish={handleSubmit}>
  <Form.Item label="Name" name="name">
    <TextInput />  {/* Tab to navigate */}
  </Form.Item>
  <Form.Item>
    <Button htmlType="submit" text="Submit" />  {/* Enter to submit */}
  </Form.Item>
</Form>
```

---

#### Table
**ARIA Pattern:** [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)

| Key | Action |
|-----|--------|
| **Arrow keys** | Navigate cells |
| **Home** | First column in row |
| **End** | Last column in row |
| **Page Up/Down** | Scroll table |
| **Enter** | Activate cell action |

---

#### Dropdown/Select
**ARIA Pattern:** [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

| Key | Action |
|-----|--------|
| **Arrow Down** | Open dropdown / Next option |
| **Arrow Up** | Previous option |
| **Enter** | Select option |
| **Escape** | Close dropdown |
| **Type** | Type-ahead search |

```tsx
<Select
  options={options}
  value={selected}
  onChange={setSelected}
  searchable  // Enables type-ahead
/>
```

---

## 📢 Screen Reader Support

### ARIA Landmarks

**WCAG Requirement:** 2.4.1 Bypass Blocks (Level A), 1.3.1 Info and Relationships (Level A)

#### Required Page Landmarks

```html
<!-- Page structure -->
<header role="banner">
  <!-- Site header, logo, top navigation -->
</header>

<nav role="navigation" aria-label="Main navigation">
  <!-- Primary site navigation -->
</nav>

<main role="main">
  <!-- Main page content -->
</main>

<aside role="complementary" aria-label="Sidebar">
  <!-- Sidebar content, related information -->
</aside>

<footer role="contentinfo">
  <!-- Footer, copyright, secondary navigation -->
</footer>
```

**Implementation with Octuple:**
```tsx
<Layout>
  <Layout.Header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <Menu items={mainMenuItems} />
    </nav>
  </Layout.Header>
  
  <Layout style={{ display: 'flex' }}>
    <Layout.Aside role="complementary" aria-label="Sidebar navigation">
      <Menu items={sidebarMenuItems} />
    </Layout.Aside>
    
    <Layout.Content role="main">
      <h1>Page Title</h1>
      {/* Main content */}
    </Layout.Content>
  </Layout>
  
  <Layout.Footer role="contentinfo">
    <p>&copy; 2024 Company Name</p>
  </Layout.Footer>
</Layout>
```

---

### Component-Specific ARIA

#### Button

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

```tsx
// Text button (no ARIA needed - text provides name)
<Button text="Save Changes" onClick={handleSave} />

// Icon-only button (REQUIRES aria-label)
<Button
  iconProps={{ path: mdiClose as IconName }}
  ariaLabel="Close dialog"  // ✅ Required!
  onClick={handleClose}
/>

// Toggle button (add aria-pressed)
<Button
  text="Mute"
  aria-pressed={isMuted}
  onClick={toggleMute}
/>

// Button opening menu (add aria-haspopup)
<Button
  text="Options"
  aria-haspopup="menu"
  aria-expanded={menuOpen}
  onClick={toggleMenu}
/>
```

**Common Mistakes:**
```tsx
// ❌ Icon-only button without label
<Button iconProps={{ path: mdiClose }} />

// ✅ Correct: Add aria-label
<Button iconProps={{ path: mdiClose }} ariaLabel="Close" />
```

---

#### Form Fields

**WCAG Criterion:** 3.3.2 Labels or Instructions (Level A), 1.3.1 Info and Relationships (Level A)

```tsx
// With Form.Item (handles labeling automatically)
<Form form={form}>
  <Form.Item
    label="Email Address"  // Creates associated <label>
    name="email"
    rules={[
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ]}
  >
    <TextInput
      placeholder="your.email@example.com"
      // Form.Item handles:
      // - id generation
      // - label association
      // - aria-required
      // - aria-invalid (on error)
      // - aria-describedby (for errors)
    />
  </Form.Item>
</Form>

// Without Form.Item (manual ARIA)
<label htmlFor="email-input">
  Email Address <span aria-label="required">*</span>
</label>
<TextInput
  id="email-input"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
)}
```

**Required Field Indicators:**
```tsx
// Visual + programmatic
<Form.Item
  label={
    <>
      Email <span style={{ color: '#ff4d4f' }} aria-label="required">*</span>
    </>
  }
  name="email"
  required  // Adds aria-required
>
  <TextInput />
</Form.Item>
```

---

#### Menu

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

```tsx
import { mdiHome, mdiAccount, mdiCog } from '@mdi/js';
import { IconName } from '@mdi/react';

const menuItems = [
  {
    key: 'home',
    label: 'Home',
    iconProps: { path: mdiHome as IconName },
    'aria-current': location.pathname === '/' ? 'page' : undefined  // ✅ Indicates current page
  },
  {
    key: 'profile',
    label: 'Profile',
    iconProps: { path: mdiAccount as IconName },
    'aria-current': location.pathname === '/profile' ? 'page' : undefined
  },
  {
    key: 'settings',
    label: 'Settings',
    iconProps: { path: mdiCog as IconName },
    'aria-label': 'Settings and preferences'  // Additional context
  }
];

<nav role="navigation" aria-label="Main navigation">
  <Menu items={menuItems} />
</nav>
```

---

#### Tabs

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

```tsx
import { useState } from 'react';
import { Tabs, Tab } from '@eightfold.ai/octuple';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Tabs
      value={activeTab}
      onChange={setActiveTab}
      aria-label="Profile sections"  // ✅ Describes tab group
    >
      <Tab
        value="profile"
        label="Profile"
        // Octuple handles:
        // - role="tab"
        // - aria-selected={activeTab === 'profile'}
        // - aria-controls="panel-profile"
        // - id="tab-profile"
      >
        <div
          // Octuple handles:
          // - role="tabpanel"
          // - aria-labelledby="tab-profile"
          // - id="panel-profile"
          // - tabIndex={0} for focus management
        >
          Profile content
        </div>
      </Tab>
      
      <Tab value="security" label="Security">
        <div>Security settings</div>
      </Tab>
    </Tabs>
  );
};
```

---

#### Modal / Dialog

**WCAG Criterion:** 2.1.2 No Keyboard Trap (Level A), 4.1.2 Name, Role, Value (Level A)

```tsx
import { useState } from 'react';
import { Modal, Button, ButtonVariant } from '@eightfold.ai/octuple';

const ConfirmDialog = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button text="Delete Account" onClick={() => setVisible(true)} />
      
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        // ARIA attributes:
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"  // Links to title
        aria-describedby="modal-description"  // Links to description
        // Octuple handles:
        // - Focus trap
        // - Escape to close
        // - Focus return to trigger
        footer={[
          <Button key="cancel" text="Cancel" onClick={() => setVisible(false)} />,
          <Button key="delete" text="Delete" variant={ButtonVariant.SystemUI} disruptive onClick={handleDelete} />
        ]}
      >
        <h2 id="modal-title">Confirm Account Deletion</h2>
        <p id="modal-description">
          This action cannot be undone. Are you sure you want to delete your account?
        </p>
      </Modal>
    </>
  );
};
```

---

#### Table

**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)

```tsx
import { Table } from '@eightfold.ai/octuple';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,  // Octuple adds aria-sort
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <span aria-label={`Status: ${status}`}>
        {status}
      </span>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Button
        text="Edit"
        ariaLabel={`Edit user ${record.name}`}  // ✅ Descriptive label
        onClick={() => handleEdit(record)}
      />
    ),
  },
];

<Table
  dataSource={users}
  columns={columns}
  rowKey="id"
  caption="User Management Table"  // ✅ Table description
  aria-label="List of users"  // Alternative to caption
  // Octuple handles:
  // - <th> for headers
  // - scope attributes
  // - aria-sort for sortable columns
/>
```

---

### Live Regions (Dynamic Content)

**WCAG Criterion:** 4.1.3 Status Messages (Level AA)

#### Polite Announcements (Non-Urgent)

```tsx
// For status updates that don't require immediate attention
<div role="status" aria-live="polite">
  {savedMessage && <p>Changes saved successfully</p>}
</div>

// Loading states
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>
```

#### Assertive Announcements (Urgent)

```tsx
// For errors and urgent messages
<div role="alert" aria-live="assertive">
  {errorMessage && <p>{errorMessage}</p>}
</div>

// Form errors
{formError && (
  <div role="alert" className="error-message">
    {formError}
  </div>
)}
```

#### Visually Hidden Screen Reader Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```tsx
// Loading state
<div>
  <Spinner />
  <span className="sr-only">Loading content, please wait...</span>
</div>

// Additional context for icons
<Button>
  <Icon path={mdiTrash} aria-hidden="true" />
  <span>Delete</span>
  <span className="sr-only">This action cannot be undone</span>
</Button>
```

---

## 🎨 Color & Contrast

### WCAG 2.1 Level AA Contrast Requirements

**WCAG Criterion:** 1.4.3 Contrast (Minimum) (Level AA)

| Content Type | Minimum Ratio | Compliance Level |
|--------------|---------------|------------------|
| **Normal text** (< 18pt) | **4.5:1** | AA |
| **Large text** (≥ 18pt or 14pt bold) | **3:1** | AA |
| **UI components** (buttons, inputs, borders) | **3:1** | AA |
| **Interactive states** (focus, hover) | **3:1** | AA |
| **Graphics** (icons, charts) | **3:1** | AA |

---

### Octuple Color Compliance

#### Text Colors (on white background)

| Usage | Color | Hex | Contrast | Compliant |
|-------|-------|-----|----------|-----------|
| Primary text | Gray 900 | `#1a1a1a` | 15.8:1 | ✅ AAA |
| Body text | Gray 600 | `#595959` | 7.5:1 | ✅ AAA |
| Secondary text | Gray 500 | `#8c8c8c` | 4.7:1 | ✅ AA |
| **Disabled text** | Gray 400 | `#bfbfbf` | 2.9:1 | ❌ Fail (decorative only) |
| Link text | Primary | `#1890ff` | 4.54:1 | ✅ AA |
| Error text | Error | `#ff4d4f` | 4.03:1 | ✅ AA (18px+) |
| Success text | Success Dark | `#389e0d` | 4.77:1 | ✅ AA |

**Usage Guidelines:**
- ✅ Use Gray 900 (`#1a1a1a`) for headings
- ✅ Use Gray 600 (`#595959`) for body text
- ✅ Use Gray 500 (`#8c8c8c`) for secondary text
- ❌ Don't use Gray 400 for text (fails contrast - decorative only)

---

#### Button Contrast

```tsx
// Primary button: White text on blue (#1890ff)
<Button
  text="Submit"
  variant={ButtonVariant.Primary}
  // White on #1890ff = 4.54:1 ✅ AA compliant
/>

// Default button: Text needs sufficient contrast
<Button
  text="Cancel"
  variant={ButtonVariant.Default}
  // Gray 600 text on white background = 7.5:1 ✅ AAA compliant
/>

// Focus indicator: 2px outline
<Button
  text="Action"
  // Focus outline: #1890ff on white = 4.54:1 ✅ AA compliant
/>
```

---

### Don't Rely on Color Alone

**WCAG Criterion:** 1.4.1 Use of Color (Level A)

#### ❌ WRONG: Color Only

```tsx
// Bad: Error indication by color alone
<TextInput
  value={email}
  style={{ borderColor: hasError ? 'red' : 'gray' }}
/>
<p style={{ color: 'red' }}>Invalid email</p>
```

#### ✅ CORRECT: Color + Icon + Text

```tsx
// Good: Multiple indicators
<Form.Item
  label="Email"
  name="email"
  validateStatus={hasError ? "error" : ""}  // Red border
  help={hasError && (
    <>
      <Icon path={mdiAlertCircle} size={0.6} color="#ff4d4f" />  {/* Icon */}
      <span>Please enter a valid email address</span>  {/* Text */}
    </>
  )}
>
  <TextInput />
</Form.Item>
```

---

### Semantic Colors with Icons

| State | Color | Icon | Usage |
|-------|-------|------|-------|
| **Success** | Green `#52c41a` | `mdiCheckCircle` | Success messages, completion |
| **Error** | Red `#ff4d4f` | `mdiAlertCircle` | Errors, validation failures |
| **Warning** | Orange `#faad14` | `mdiAlert` | Warnings, caution |
| **Info** | Blue `#1890ff` | `mdiInformation` | Information, help |

```tsx
import { mdiCheckCircle, mdiAlertCircle, mdiAlert, mdiInformation } from '@mdi/js';

// Success message
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52c41a' }}>
  <Icon path={mdiCheckCircle} size={0.8} />
  <span>Profile updated successfully</span>
</div>

// Error message
<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4f' }}>
  <Icon path={mdiAlertCircle} size={0.8} />
  <span>Failed to save changes. Please try again.</span>
</div>
```

---

### Testing Color Contrast

**Tools:**
1. **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
2. **Chrome DevTools:** Inspect > Accessibility panel
3. **axe DevTools:** Browser extension
4. **WAVE:** Browser extension

**Quick Test:**
```
1. Take a screenshot of your UI
2. Convert to grayscale
3. Can you still distinguish different elements?
4. If no, add more visual differentiation (icons, borders, labels)
```

---

## 📝 Text & Content

### Reading Level

**WCAG Criterion:** 3.1.5 Reading Level (Level AAA - Recommended)

**Guidelines:**
- Target: 8th-9th grade reading level
- Use short sentences (15-20 words)
- Use common words
- Avoid jargon
- Define technical terms

**Example:**

❌ **Complex:**
```
"Utilize the aforementioned functionality to facilitate expeditious data transmission."
```

✅ **Clear:**
```
"Use this feature to send data faster."
```

---

### Text Sizing & Resizing

**WCAG Criterion:** 1.4.4 Resize Text (Level AA)

**Requirements:**
- Minimum body text: 14px (Octuple default)
- Allow text resizing up to 200%
- No loss of functionality when zoomed
- No horizontal scrolling at 200% zoom

**Implementation:**
```css
/* Use relative units */
body {
  font-size: 14px;  /* Base size */
}

h1 {
  font-size: 2.57em;  /* 36px relative to 14px base */
}

/* Avoid fixed heights */
.button {
  padding: 0.57em 1.14em;  /* Scales with text size */
  /* NOT: height: 32px; */
}
```

**Testing:**
```
1. Zoom browser to 200% (Cmd/Ctrl + +)
2. Verify all text is readable
3. Verify no content is cut off
4. Verify all functionality works
```

---

### Link Text

**WCAG Criterion:** 2.4.4 Link Purpose (In Context) (Level A)

#### ❌ WRONG: Generic Link Text

```tsx
<a href="/docs">Click here</a> for documentation.
<a href="/contact">More information</a> is available.
```

**Problems:**
- Screen reader users often navigate by links
- "Click here" provides no context
- Links should make sense out of context

#### ✅ CORRECT: Descriptive Link Text

```tsx
<a href="/docs">Read the documentation</a>
<a href="/contact">Contact our support team</a>

// Or with Button
<Button
  text="View profile settings"
  variant={ButtonVariant.Neutral}
  onClick={() => navigate('/settings/profile')}
/>
```

---

### Headings Hierarchy

**WCAG Criterion:** 1.3.1 Info and Relationships (Level A)

**Rules:**
- Start with `<h1>` (only one per page)
- Don't skip levels (h1 → h2 → h3, NOT h1 → h3)
- Use headings for structure, not styling

**Correct Structure:**
```tsx
<main>
  <h1>Page Title</h1>  {/* Only one h1 */}
  
  <section>
    <h2>Section 1</h2>
    <p>Content...</p>
    
    <h3>Subsection 1.1</h3>
    <p>Content...</p>
    
    <h3>Subsection 1.2</h3>
    <p>Content...</p>
  </section>
  
  <section>
    <h2>Section 2</h2>
    <p>Content...</p>
  </section>
</main>
```

**Don't Use Headings for Styling:**
```tsx
// ❌ Wrong: Using h3 just because it looks right
<h3 style={{ fontSize: '14px', fontWeight: 400 }}>
  Not a heading, just styled text
</h3>

// ✅ Correct: Use appropriate element with styling
<p style={{ fontSize: '14px', fontWeight: 600 }}>
  Emphasized text
</p>
```

---

## 🖼️ Images & Media

### Alternative Text

**WCAG Criterion:** 1.1.1 Non-text Content (Level A)

#### Informative Images

**Provide descriptive alt text:**
```tsx
// Chart/graph
<img
  src="sales-chart.png"
  alt="Bar chart showing 40% sales increase in Q3 2024"
/>

// Logo
<img
  src="company-logo.png"
  alt="Acme Corporation"
/>

// Avatar with user info
<Avatar
  src="user-photo.jpg"
  alt="John Doe, Senior Developer"
  size="80px"
/>
```

#### Decorative Images

**Use empty alt or aria-hidden:**
```tsx
// Decorative border
<img src="decorative-line.png" alt="" role="presentation" />

// Decorative icon next to text
<div>
  <Icon path={mdiStar} aria-hidden="true" />
  <span>Featured Item</span>
</div>
```

#### Icons

**With text (hide icon from screen readers):**
```tsx
<Button>
  <Icon path={mdiHome} aria-hidden="true" />
  <span>Home</span>
</Button>
```

**Icon-only (provide accessible name):**
```tsx
<Button
  iconProps={{ path: mdiClose as IconName }}
  ariaLabel="Close dialog"  // ✅ Required!
/>
```

#### Complex Images

**Provide long description:**
```tsx
// Diagram or complex chart
<figure>
  <img
    src="architecture-diagram.png"
    alt="System architecture diagram"
    aria-describedby="diagram-description"
  />
  <figcaption id="diagram-description">
    The diagram shows a three-tier architecture with:
    1. Frontend layer (React application)
    2. API layer (Node.js backend)
    3. Database layer (PostgreSQL)
    Arrows indicate data flow from frontend through API to database.
  </figcaption>
</figure>
```

---

### Video & Audio

**WCAG Criterion:** 1.2.2 Captions (Prerecorded) (Level A), 1.2.3 Audio Description or Media Alternative (Level A)

**Requirements:**
- ✅ Captions for all video with audio
- ✅ Transcripts for audio-only content
- ✅ Audio descriptions for video-only content
- ✅ Controls are keyboard accessible

```tsx
<video controls aria-label="Product demo video">
  <source src="demo.mp4" type="video/mp4" />
  <track kind="captions" src="demo-en.vtt" srclang="en" label="English" />
  <track kind="descriptions" src="demo-desc.vtt" srclang="en" label="English descriptions" />
</video>

<p>
  <a href="/demo-transcript.txt">Read video transcript</a>
</p>
```

---

## 📋 Forms

### Form Labels

**WCAG Criterion:** 3.3.2 Labels or Instructions (Level A)

**Every input MUST have a label:**

```tsx
// ✅ With Form.Item (automatic labeling)
<Form.Item label="Email Address" name="email" required>
  <TextInput />
</Form.Item>

// ✅ With explicit <label>
<label htmlFor="email-input">Email Address</label>
<TextInput id="email-input" aria-required="true" />

// ✅ With aria-label (when visual label not desired)
<TextInput
  aria-label="Search"
  placeholder="Search..."  // Placeholder is NOT a label
/>

// ❌ WRONG: No label
<TextInput placeholder="Email" />  // Placeholder disappears on focus!
```

**Placeholder vs Label:**
- **Label:** Always visible, associated with field
- **Placeholder:** Disappears on focus, NOT a replacement for label

---

### Error Messages

**WCAG Criterion:** 3.3.1 Error Identification (Level A), 3.3.3 Error Suggestion (Level AA)

**Requirements:**
- ✅ Identify fields with errors
- ✅ Provide clear error messages
- ✅ Suggest how to fix errors
- ✅ Announce errors to screen readers

```tsx
<Form form={form} onFinish={handleSubmit}>
  <Form.Item
    label="Email Address"
    name="email"
    validateStatus={emailError ? "error" : ""}
    help={emailError}  // Automatically linked with aria-describedby
    rules={[
      {
        required: true,
        message: 'Email is required'  // Clear error
      },
      {
        type: 'email',
        message: 'Please enter a valid email address (e.g., name@example.com)'  // Suggestion
      }
    ]}
  >
    <TextInput />
  </Form.Item>
</Form>

// Manual error handling
<div>
  <label htmlFor="password">Password</label>
  <TextInput
    id="password"
    type="password"
    aria-invalid={passwordError ? "true" : "false"}
    aria-describedby={passwordError ? "password-error" : undefined}
  />
  {passwordError && (
    <div id="password-error" role="alert" style={{ color: '#ff4d4f' }}>
      <Icon path={mdiAlertCircle} size={0.6} aria-hidden="true" />
      Password must be at least 8 characters and include a number
    </div>
  )}
</div>
```

---

### Required Fields

**WCAG Criterion:** 3.3.2 Labels or Instructions (Level A)

**Indicate required fields both visually and programmatically:**

```tsx
// ✅ Correct: Visual + programmatic
<Form.Item
  label={
    <>
      Email Address
      <span style={{ color: '#ff4d4f', marginLeft: '4px' }} aria-label="required">
        *
      </span>
    </>
  }
  name="email"
  required  // Adds aria-required="true"
  rules={[{ required: true, message: 'Email is required' }]}
>
  <TextInput />
</Form.Item>

// Or add legend at top of form
<Form>
  <p>
    Fields marked with an asterisk (<span style={{ color: '#ff4d4f' }}>*</span>) are required.
  </p>
  {/* Form fields */}
</Form>
```

---

### Form Validation Timing

**WCAG Criterion:** 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)

**Best Practices:**
- ✅ Inline validation after field blur (not on every keystroke)
- ✅ Summary of errors at top of form on submit
- ✅ Confirmation for destructive actions
- ✅ Allow users to review and correct before final submission

```tsx
const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (values) => {
    try {
      await submitRegistration(values);
    } catch (error) {
      setErrors(error.fieldErrors);
      // Focus first error
      const firstError = form.getFieldsError().find(({ errors }) => errors.length);
      if (firstError) {
        form.scrollToField(firstError.name);
      }
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      {/* Error summary */}
      {errors.length > 0 && (
        <div role="alert" style={{ marginBottom: '24px', padding: '16px', background: '#fff1f0' }}>
          <h3>Please correct the following errors:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                <a href={`#${error.field}`}>{error.message}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form fields */}
      <Form.Item label="Email" name="email" required>
        <TextInput />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" text="Register" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

---

## ✅ Testing Procedures

### 1. Keyboard Testing

**Goal:** Ensure all functionality is available via keyboard

**Test Checklist:**

- [ ] **Tab Through Page**
  - Start at top of page
  - Press Tab to move through all interactive elements
  - Verify logical order (reading order)
  - No elements skipped

- [ ] **Visible Focus**
  - Focus indicator visible on ALL elements
  - Minimum 2px outline
  - 3:1 contrast with background
  - Never completely invisible

- [ ] **Keyboard Shortcuts**
  - Enter/Space activates buttons
  - Arrow keys navigate menus/tabs
  - Escape closes modals/dropdowns
  - No custom shortcuts conflict with browser/AT

- [ ] **No Keyboard Traps**
  - Can Tab into and out of all components
  - Modals trap focus (intentionally) but Escape exits
  - No infinite loops

- [ ] **Skip Links (Optional)**
  - "Skip to main content" link appears on focus
  - Jumps focus to main content area

**Testing Process:**
```
1. Disconnect mouse/trackpad
2. Navigate entire page using only keyboard
3. Complete all tasks (form submission, navigation, etc.)
4. Note any issues or unreachable elements
```

---

### 2. Screen Reader Testing

**Goal:** Ensure content is properly announced and understandable

**Screen Readers to Test:**
- **Windows:** NVDA (free) or JAWS
- **Mac:** VoiceOver (built-in)
- **Mobile:** VoiceOver (iOS), TalkBack (Android)

**Test Checklist:**

- [ ] **Page Structure**
  - Landmarks announced (header, nav, main, aside, footer)
  - Heading hierarchy makes sense
  - Page title is descriptive

- [ ] **Navigation**
  - Can navigate by headings (H key in NVDA/JAWS)
  - Can navigate by landmarks (D key)
  - Can list all links (Insert+F7 in NVDA)
  - Current page indicated in navigation

- [ ] **Forms**
  - All labels announced correctly
  - Required fields indicated
  - Error messages announced
  - Field types announced (text, checkbox, select)

- [ ] **Interactive Elements**
  - Buttons announced as buttons
  - Links announced as links
  - Current state announced (checked, selected, expanded)
  - Icon-only buttons have accessible names

- [ ] **Dynamic Content**
  - Loading states announced
  - Success/error messages announced
  - Live regions work (role="alert", role="status")

- [ ] **Images**
  - Alt text is meaningful
  - Decorative images hidden (aria-hidden or alt="")

**NVDA Quick Keys:**
- Insert+Down: Read next item
- H: Next heading
- D: Next landmark
- B: Next button
- F: Next form field
- L: Next list
- Insert+F7: Elements list

**VoiceOver Quick Keys:**
- VO+Right Arrow: Next item
- VO+Command+H: Next heading
- VO+U: Rotor (elements list)
- VO+Space: Activate item

---

### 3. Color Contrast Testing

**Goal:** Ensure sufficient contrast for all text and UI elements

**Tools:**
1. **axe DevTools** (Browser extension)
   - Automatically checks contrast
   - Highlights failing elements
   - Provides fix suggestions

2. **WAVE** (Browser extension)
   - Visual overlay of contrast errors
   - Color-codes issues

3. **Chrome DevTools**
   - Inspect element > Accessibility panel
   - Shows contrast ratio
   - Indicates pass/fail

4. **WebAIM Contrast Checker**
   - Manual checker: https://webaim.org/resources/contrastchecker/
   - Test specific color combinations

**Test Checklist:**

- [ ] **Body Text**
  - 4.5:1 minimum (AA)
  - Test on all backgrounds

- [ ] **Large Text** (18pt+ or 14pt bold)
  - 3:1 minimum (AA)

- [ ] **UI Components**
  - Button borders: 3:1
  - Input borders: 3:1
  - Focus indicators: 3:1

- [ ] **Icons**
  - 3:1 against background
  - If conveying information

- [ ] **Disabled States**
  - Can be less than 4.5:1 (not required to meet contrast)
  - But should still be distinguishable

**Testing Process:**
```
1. Install axe DevTools
2. Open page in Chrome
3. Open DevTools (F12)
4. Go to axe DevTools tab
5. Click "Scan All of My Page"
6. Review contrast issues
7. Fix and re-test
```

---

### 4. Zoom & Reflow Testing

**WCAG Criterion:** 1.4.4 Resize Text (Level AA), 1.4.10 Reflow (Level AA)

**Goal:** Content remains usable at 200% zoom and 400% zoom

**Test Checklist:**

- [ ] **200% Zoom**
  - All text readable
  - No content cut off
  - No horizontal scrolling (vertical OK)
  - All functionality works

- [ ] **400% Zoom** (WCAG 2.1)
  - Content reflows (no horizontal scrolling)
  - Equivalent to 1280px wide at 400% = 320px viewport
  - Mobile-like experience

- [ ] **Browser Zoom**
  - Test Cmd/Ctrl + + (zoom in)
  - Test Cmd/Ctrl + - (zoom out)
  - Test Cmd/Ctrl + 0 (reset)

- [ ] **Text-Only Zoom**
  - Some browsers support text-only zoom
  - Layout should adapt

**Testing Process:**
```
1. Open page in browser
2. Zoom to 200% (Cmd/Ctrl + +)
3. Scroll through page vertically
4. Verify no horizontal scrolling needed
5. Test all interactive elements
6. Zoom to 400%
7. Verify content reflows (single column OK)
```

---

### 5. Automated Testing

**Goal:** Catch common accessibility issues early

**Tools:**

#### axe DevTools (Browser Extension)
```
1. Install axe DevTools for Chrome/Firefox
2. Open page
3. Open DevTools (F12)
4. Click "axe DevTools" tab
5. Click "Scan All of My Page"
6. Review issues by severity (Critical, Serious, Moderate, Minor)
7. Fix issues
8. Re-scan
```

**Catches:**
- Missing alt text
- Form labels
- Color contrast
- ARIA usage errors
- Heading hierarchy

#### WAVE (Browser Extension)
- Visual overlay
- Color-coded issues
- Structural outline

#### Lighthouse (Built into Chrome)
```
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Click "Generate report"
5. Review score and issues
```

#### pa11y-ci (Command Line)
```bash
# Install
npm install --save-dev pa11y-ci

# Run tests
npx pa11y-ci http://localhost:3000

# Add to package.json
"scripts": {
  "test:a11y": "pa11y-ci"
}
```

---

### 6. Manual Testing Workflow

**Complete Accessibility Test (30-45 minutes per page)**

```
Phase 1: Automated Scan (5 min)
├─ Run axe DevTools
├─ Run WAVE
├─ Run Lighthouse
└─ Fix critical issues

Phase 2: Keyboard Test (10 min)
├─ Disconnect mouse
├─ Tab through entire page
├─ Test all interactions
├─ Verify focus indicators
└─ Test modals/dropdowns

Phase 3: Screen Reader Test (15 min)
├─ Turn on NVDA/VoiceOver
├─ Navigate by headings
├─ Navigate by landmarks
├─ Test forms
├─ Test dynamic content
└─ Verify announcements

Phase 4: Visual Test (10 min)
├─ Test color contrast
├─ Zoom to 200%
├─ Zoom to 400%
├─ Test in grayscale
└─ Verify responsive behavior

Phase 5: Documentation (5 min)
├─ Document issues found
├─ Prioritize fixes
├─ Create tickets
└─ Retest after fixes
```

---

## 🚫 Common Accessibility Pitfalls

### 1. ❌ Icon-Only Button Without Label

**Problem:** Screen readers can't describe the button

```tsx
// ❌ WRONG
<Button iconProps={{ path: mdiClose }} onClick={handleClose} />
```

**Fix:**
```tsx
// ✅ CORRECT
<Button
  iconProps={{ path: mdiClose as IconName }}
  ariaLabel="Close dialog"
  onClick={handleClose}
/>
```

---

### 2. ❌ Missing Form Labels

**Problem:** Screen readers don't announce field purpose

```tsx
// ❌ WRONG
<TextInput placeholder="Email" />  // Placeholder is NOT a label
```

**Fix:**
```tsx
// ✅ CORRECT
<Form.Item label="Email Address" name="email">
  <TextInput placeholder="your.email@example.com" />
</Form.Item>
```

---

### 3. ❌ Low Color Contrast

**Problem:** Text unreadable for users with low vision

```tsx
// ❌ WRONG
<p style={{ color: '#999' }}>  {/* 2.85:1 - fails WCAG AA */}
  Important information
</p>
```

**Fix:**
```tsx
// ✅ CORRECT
<p style={{ color: '#595959' }}>  {/* 7.5:1 - passes AAA */}
  Important information
</p>
```

---

### 4. ❌ Keyboard Trap

**Problem:** User can't navigate out of component

```tsx
// ❌ WRONG
<div onKeyDown={(e) => e.preventDefault()}>
  <Button text="Trapped" />
</div>
```

**Fix:**
```tsx
// ✅ CORRECT - Allow keyboard navigation
<div>
  <Button text="Not Trapped" />
</div>
```

---

### 5. ❌ Missing Alt Text

**Problem:** Screen readers can't describe images

```tsx
// ❌ WRONG
<img src="chart.png" />
<Avatar src="user.jpg" />
```

**Fix:**
```tsx
// ✅ CORRECT
<img src="chart.png" alt="Sales growth chart showing 40% increase" />
<Avatar src="user.jpg" alt="John Doe" />

// Decorative images
<img src="decorative.png" alt="" role="presentation" />
```

---

### 6. ❌ Div/Span as Button

**Problem:** Not keyboard accessible, not announced as button

```tsx
// ❌ WRONG
<div onClick={handleClick} style={{ cursor: 'pointer' }}>
  Click me
</div>
```

**Fix:**
```tsx
// ✅ CORRECT
<Button text="Click me" onClick={handleClick} />
```

---

### 7. ❌ Placeholder as Label

**Problem:** Placeholder disappears on focus, not announced as label

```tsx
// ❌ WRONG
<TextInput placeholder="Enter your email address" />
```

**Fix:**
```tsx
// ✅ CORRECT
<Form.Item label="Email Address" name="email">
  <TextInput placeholder="your.email@example.com" />
</Form.Item>
```

---

### 8. ❌ No Focus Indicator

**Problem:** Keyboard users can't see where focus is

```css
/* ❌ WRONG */
*:focus {
  outline: none;  /* NEVER do this without replacement! */
}
```

**Fix:**
```css
/* ✅ CORRECT */
*:focus-visible {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}
```

---

### 9. ❌ Timing Without User Control

**Problem:** Content disappears before users can read it

```tsx
// ❌ WRONG
useEffect(() => {
  const timer = setTimeout(() => {
    setNotification(null);  // Disappears after 3 seconds
  }, 3000);
  return () => clearTimeout(timer);
}, [notification]);
```

**Fix:**
```tsx
// ✅ CORRECT - User can dismiss
<div role="alert">
  {notification}
  <Button ariaLabel="Close notification" onClick={() => setNotification(null)} />
</div>
```

---

### 10. ❌ Color-Only Error Indication

**Problem:** Color-blind users can't identify errors

```tsx
// ❌ WRONG
<TextInput
  value={email}
  style={{ borderColor: hasError ? 'red' : 'gray' }}  // Color only
/>
```

**Fix:**
```tsx
// ✅ CORRECT - Icon + text + color
<Form.Item
  label="Email"
  name="email"
  validateStatus={hasError ? "error" : ""}  // Border color
  help={hasError && (
    <>
      <Icon path={mdiAlertCircle} size={0.6} />  {/* Icon */}
      <span>Please enter a valid email address</span>  {/* Text */}
    </>
  )}
>
  <TextInput aria-invalid={hasError} />
</Form.Item>
```

---

## 🎓 Accessibility Best Practices

### DO ✅

1. **Use Semantic HTML**
   - Use `<button>` for buttons, not `<div onClick>`
   - Use `<a>` for links, not `<button onClick={navigate}>`
   - Use headings (`<h1>-<h6>`) for structure

2. **Provide Text Alternatives**
   - Alt text for images
   - aria-label for icon-only buttons
   - Captions for videos

3. **Ensure Keyboard Access**
   - All interactive elements reachable with Tab
   - Logical tab order
   - Visible focus indicators

4. **Maintain Color Contrast**
   - 4.5:1 for body text
   - 3:1 for large text and UI components
   - Test with contrast checker

5. **Test with Assistive Technologies**
   - NVDA or VoiceOver
   - Keyboard only
   - Browser zoom

6. **Use ARIA Appropriately**
   - Use semantic HTML first
   - Add ARIA when semantic HTML insufficient
   - Follow ARIA Authoring Practices

7. **Handle Errors Gracefully**
   - Clear error messages
   - Associate errors with fields
   - Provide suggestions for fixes

8. **Support Text Resize**
   - Use relative units (em, rem)
   - Test at 200% zoom
   - Avoid fixed heights

### DON'T ❌

1. **Don't Remove Focus Indicators**
   - Never use `outline: none` without replacement
   - Focus must always be visible

2. **Don't Use Color Alone**
   - Add icons, text, or other indicators
   - Test in grayscale

3. **Don't Rely on Mouse**
   - Ensure keyboard alternatives
   - Test without mouse/trackpad

4. **Don't Use Placeholder as Label**
   - Placeholders disappear on focus
   - Not announced by screen readers

5. **Don't Block Zoom**
   - Never use `user-scalable=no`
   - Never set `maximum-scale=1`

6. **Don't Auto-Play Media**
   - Provide controls
   - Allow user to start

7. **Don't Create Keyboard Traps**
   - Users must be able to navigate away
   - Except modals (with Escape to close)

8. **Don't Use Divs as Buttons**
   - Not keyboard accessible by default
   - Not announced as buttons

---

## 📚 Resources

### Official Standards
- **WCAG 2.1 Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/
- **Section 508:** https://www.section508.gov/

### Testing Tools
- **axe DevTools:** https://www.deque.com/axe/devtools/
- **WAVE:** https://wave.webaim.org/extension/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Lighthouse:** Built into Chrome DevTools

### Screen Readers
- **NVDA (Windows):** https://www.nvaccess.org/download/ (Free)
- **JAWS (Windows):** https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver (Mac):** Built-in (Cmd+F5)
- **TalkBack (Android):** Built-in

### Learning Resources
- **WebAIM:** https://webaim.org/
- **A11y Project:** https://www.a11yproject.com/
- **MDN Accessibility:** https://developer.mozilla.org/en-US/docs/Web/Accessibility

### Octuple Resources
- **Component Guides:** `docs/components/` - Component-specific accessibility
- **Verified Examples:** `docs/verified-octuple-examples.md` - Accessible code examples
- **AI Quick Reference:** `docs/ai-quick-reference.md` - Accessibility checklist

---

## 📋 Accessibility Checklist

### Quick Pre-Launch Checklist

**Page Structure:**
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Landmarks present (header, nav, main, aside, footer)
- [ ] Skip to main content link (optional but recommended)

**Keyboard:**
- [ ] All interactive elements keyboard accessible
- [ ] Logical tab order
- [ ] Visible focus indicators (2px minimum)
- [ ] No keyboard traps
- [ ] Modals trap focus with Escape to exit

**Screen Readers:**
- [ ] All images have alt text (or alt="" if decorative)
- [ ] All buttons have accessible names
- [ ] All form fields have labels
- [ ] Error messages announced (role="alert")
- [ ] Dynamic content changes announced (live regions)

**Color & Contrast:**
- [ ] Text contrast ≥ 4.5:1 (body text)
- [ ] Large text contrast ≥ 3:1
- [ ] UI component contrast ≥ 3:1
- [ ] Color not used as only indicator

**Forms:**
- [ ] All fields have labels
- [ ] Required fields indicated (* + aria-required)
- [ ] Error messages clear and specific
- [ ] Errors linked to fields (aria-describedby)

**Zoom & Reflow:**
- [ ] Page usable at 200% zoom
- [ ] No horizontal scrolling at 200% zoom
- [ ] Content reflows at 400% zoom

**Testing:**
- [ ] Automated scan (axe DevTools, WAVE)
- [ ] Keyboard test (disconnect mouse)
- [ ] Screen reader test (NVDA/VoiceOver)
- [ ] Zoom test (200%, 400%)
- [ ] Color contrast check

---

**Last Updated:** November 20, 2024  
**Version:** 1.10.0  
**Status:** ✅ Complete and WCAG 2.1 Level AA Compliant

**For questions or contributions, see `docs/CONTRIBUTING-TO-DOCS.md`.**
