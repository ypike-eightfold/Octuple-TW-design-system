# Row

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Row component is a horizontal layout container that works with Col components to create responsive grid layouts. It's part of Octuple's **12-column grid system** (not 24).

### When to Use
- Creating horizontal layouts
- Grid-based responsive designs
- Multi-column content layouts
- Form layouts with multiple fields per row

### When NOT to Use
- Simple stacked layouts (use flex or Layout components)
- When you need more than 12 columns
- Single-column layouts

---

## API Reference

### Import
```typescript
import { Row } from '@eightfold.ai/octuple';
```

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `align` | `typeof <tuple('top', 'middle', 'bottom', 'stretch')>RowAligns[number]` | - | - | The Row align attributes. |
| `gutter` | `Gutter \| [Gutter, Gutter]` | `0` | - | The gutter. |
| `justify` | `typeof RowJustify[number]` | - | - | The Row justify attributes. |
| `wrap` | `boolean` | - | - | The Row wraps. |

### TypeScript Types

```typescript
type Gutter = number | [number, number];

// Align options: 'top', 'middle', 'bottom', 'stretch'
// Justify options: 'start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'
```

---

## Visual States

### Align
- **top**: Align columns to top
- **middle**: Center columns vertically
- **bottom**: Align columns to bottom
- **stretch**: Stretch columns to full height

### Justify
- **start**: Align columns to start (left)
- **end**: Align columns to end (right)
- **center**: Center columns horizontally
- **space-around**: Distribute space around columns
- **space-between**: Space between columns
- **space-evenly**: Even space distribution

---

## Usage Examples

### Basic Two-Column Layout

```typescript
import React from 'react';
import { Row, Col } from '@eightfold.ai/octuple';

const BasicLayout = () => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <div style={{ background: '#f0f0f0', padding: '16px' }}>
          Left Column (50%)
        </div>
      </Col>
      <Col span={12}>
        <div style={{ background: '#f0f0f0', padding: '16px' }}>
          Right Column (50%)
        </div>
      </Col>
    </Row>
  );
};
```

### Three-Column Layout

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const ThreeColumns = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>Column 1 (33.33%)</Col>
      <Col span={8}>Column 2 (33.33%)</Col>
      <Col span={8}>Column 3 (33.33%)</Col>
    </Row>
  );
};
```

### Content/Sidebar Layout (Fixed)

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const ContentSidebarLayout = () => {
  return (
    <Row 
      gutter={24}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      <Col 
        span={16} 
        style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}
      >
        <div>Main Content (66.66%)</div>
      </Col>
      <Col 
        span={8} 
        style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}
      >
        <div>Sidebar (33.33%)</div>
      </Col>
    </Row>
  );
};
```

**⚠️ IMPORTANT:** Octuple's Row/Col requires explicit flex styling to display horizontally. See the fixed layout example above.

### Vertical Alignment

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const VerticalAlign = () => {
  return (
    <>
      {/* Top aligned */}
      <Row align="top" gutter={16}>
        <Col span={12}><div style={{ height: '100px' }}>Tall content</div></Col>
        <Col span={12}><div>Short content (top aligned)</div></Col>
      </Row>

      {/* Middle aligned */}
      <Row align="middle" gutter={16}>
        <Col span={12}><div style={{ height: '100px' }}>Tall content</div></Col>
        <Col span={12}><div>Short content (middle aligned)</div></Col>
      </Row>

      {/* Bottom aligned */}
      <Row align="bottom" gutter={16}>
        <Col span={12}><div style={{ height: '100px' }}>Tall content</div></Col>
        <Col span={12}><div>Short content (bottom aligned)</div></Col>
      </Row>
    </>
  );
};
```

### Horizontal Justify

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const HorizontalJustify = () => {
  return (
    <>
      {/* Start (default) */}
      <Row justify="start" gutter={16}>
        <Col span={6}>Column</Col>
        <Col span={6}>Column</Col>
      </Row>

      {/* Center */}
      <Row justify="center" gutter={16}>
        <Col span={6}>Column</Col>
        <Col span={6}>Column</Col>
      </Row>

      {/* Space Between */}
      <Row justify="space-between" gutter={16}>
        <Col span={6}>Column</Col>
        <Col span={6}>Column</Col>
      </Row>
    </>
  );
};
```

### Gutter Spacing

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const GutterExamples = () => {
  return (
    <>
      {/* No gutter */}
      <Row gutter={0}>
        <Col span={12}>No spacing</Col>
        <Col span={12}>No spacing</Col>
      </Row>

      {/* Small gutter */}
      <Row gutter={8}>
        <Col span={12}>Small spacing</Col>
        <Col span={12}>Small spacing</Col>
      </Row>

      {/* Standard gutter */}
      <Row gutter={16}>
        <Col span={12}>Standard spacing</Col>
        <Col span={12}>Standard spacing</Col>
      </Row>

      {/* Large gutter */}
      <Row gutter={24}>
        <Col span={12}>Large spacing</Col>
        <Col span={12}>Large spacing</Col>
      </Row>

      {/* Horizontal and vertical gutter */}
      <Row gutter={[16, 24]}>
        <Col span={12}>16px horizontal</Col>
        <Col span={12}>24px vertical spacing</Col>
      </Row>
    </>
  );
};
```

---

## Common Patterns

### Pattern 1: Form Layout

**When to use:** Multi-column form fields

```typescript
import { Row, Col, Form, TextInput } from '@eightfold.ai/octuple';

const FormLayout = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="First Name" name="firstName">
            <TextInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Last Name" name="lastName">
            <TextInput />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Email" name="email">
            <TextInput />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
```

### Pattern 2: Card Grid

**When to use:** Grid of cards or items

```typescript
import { Row, Col, Card } from '@eightfold.ai/octuple';

const CardGrid = () => {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item, index) => (
        <Col span={6} key={index}>
          <Card title={item}>
            Card content
          </Card>
        </Col>
      ))}
    </Row>
  );
};
```

---

## Best Practices

### ✅ Do
- Use `gutter` for spacing between columns (don't use margin)
- Use span values that sum to **12** for full width (12-column grid)
- Use `align` and `justify` for column alignment
- The Grid is flex-based by default
- Consider responsive behavior with different span values

### ❌ Don't
- Don't use Row without Col children
- Don't use span values exceeding **12**
- Don't add margins to Col directly (use gutter)

### Responsive Breakpoints
- **Large**: >= 1200px (12-column grid, 24px margin, 24px gutter)
- **Medium**: >= 900px (12-column grid)
- **Small**: >= 600px (adapts layout)
- **XSmall**: >= 0 (mobile)

---

## Common Mistakes

### Mistake 1: Columns Stacking Instead of Side-by-Side

**Problem:**
```typescript
<Row gutter={24}>
  <Col span={16}>Content</Col>
  <Col span={8}>Sidebar</Col>
</Row>
{/* ❌ Columns stack vertically */}
```

**Solution:**
```typescript
<Row gutter={24} style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={16} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>Content</Col>
  <Col span={8} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>Sidebar</Col>
</Row>
{/* ✅ Columns display side-by-side */}
```

**Why:** Octuple's Row/Col components need explicit flex styling to ensure horizontal layout.

---

## Accessibility

- Row is a layout component with no specific ARIA requirements
- Ensure proper heading hierarchy within columns
- Use semantic HTML within columns

---

## Related Components

- **Col**: Column component that goes inside Row
- **Layout**: For page-level layouts
- **Form**: Often uses Row/Col for field layouts

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Grid/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial comprehensive documentation from Confluence
- Documented critical fix: explicit flex styling requirement
- Added layout patterns and examples
- Included common mistakes and solutions

