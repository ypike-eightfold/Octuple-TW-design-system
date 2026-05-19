# Col

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Col component is a column container that works with Row components to create responsive grid layouts. It's part of Octuple's **12-column grid system**.

### When to Use
- Creating column-based layouts within a Row
- Responsive grid designs
- Multi-column content sections
- Form field layouts

### When NOT to Use
- Without a parent Row component
- When you need more granular width control (use custom CSS instead)

---

## API Reference

### Import
```typescript
import { Col } from '@eightfold.ai/octuple';
```

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `flex` | `FlexType` | - | - | The Col flex type. |
| `span` | `ColSpanType` | - | - | The Col span. |
| `order` | `ColSpanType` | - | - | The Col order. |
| `offset` | `ColSpanType` | - | - | The Col offset. |
| `push` | `ColSpanType` | - | - | The Col push. |
| `pull` | `ColSpanType` | - | - | The Col pull. |
| `xs` | `ColSpanType \| ColSize` | - | - | The Col size is extra-small. |
| `sm` | `ColSpanType \| ColSize` | - | - | The Col size is small. |
| `md` | `ColSpanType \| ColSize` | - | - | The Col size is medium. |
| `lg` | `ColSpanType \| ColSize` | - | - | The Col size is large. |

### TypeScript Types

```typescript
type ColSpanType = number | string;
type FlexType = number | string;

interface ColSize {
  span?: ColSpanType;
  order?: ColSpanType;
  offset?: ColSpanType;
  push?: ColSpanType;
  pull?: ColSpanType;
}
```

---

## Visual States

### Span (Width)
- **span={24}**: Full width (100%)
- **span={12}**: Half width (50%)
- **span={8}**: Third width (33.33%)
- **span={6}**: Quarter width (25%)
- **span={16}**: Two-thirds width (66.66%)
- Any number from 1-24

### Responsive Sizes
- **xs**: < 600px (extra small)
- **sm**: ≥ 600px (small)
- **md**: ≥ 900px (medium)
- **lg**: ≥ 1200px (large)

---

## Usage Examples

### Basic Column Widths

```typescript
import React from 'react';
import { Row, Col } from '@eightfold.ai/octuple';

const BasicColumns = () => {
  return (
    <>
      {/* Full width */}
      <Row>
        <Col span={24}>
          <div>Full width (100%)</div>
        </Col>
      </Row>

      {/* Half and half */}
      <Row gutter={16}>
        <Col span={12}>Half (50%)</Col>
        <Col span={12}>Half (50%)</Col>
      </Row>

      {/* Thirds */}
      <Row gutter={16}>
        <Col span={8}>Third (33.33%)</Col>
        <Col span={8}>Third (33.33%)</Col>
        <Col span={8}>Third (33.33%)</Col>
      </Row>

      {/* Quarters */}
      <Row gutter={16}>
        <Col span={6}>Quarter (25%)</Col>
        <Col span={6}>Quarter (25%)</Col>
        <Col span={6}>Quarter (25%)</Col>
        <Col span={6}>Quarter (25%)</Col>
      </Row>
    </>
  );
};
```

### Content/Sidebar Layout (Fixed)

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const ContentSidebar = () => {
  return (
    <Row 
      gutter={24}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      {/* Main content: 2/3 width */}
      <Col 
        span={16}
        style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}
      >
        <div>Main Content (66.66%)</div>
      </Col>
      
      {/* Sidebar: 1/3 width */}
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

**⚠️ IMPORTANT:** Add explicit flex styles to ensure columns display horizontally.

### Responsive Columns

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const ResponsiveColumns = () => {
  return (
    <Row gutter={16}>
      <Col 
        xs={24}  // Full width on mobile
        sm={12}  // Half width on small screens
        md={8}   // Third width on medium screens
        lg={6}   // Quarter width on large screens
      >
        Responsive Column 1
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        Responsive Column 2
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        Responsive Column 3
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        Responsive Column 4
      </Col>
    </Row>
  );
};
```

### Column Offset

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const OffsetColumns = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>Column 1</Col>
      <Col span={8} offset={8}>
        Column 2 (offset by 8 columns)
      </Col>
    </Row>
  );
};
```

### Column Order

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const OrderedColumns = () => {
  return (
    <Row gutter={16}>
      <Col span={8} order={3}>
        Rendered first, appears third
      </Col>
      <Col span={8} order={1}>
        Rendered second, appears first
      </Col>
      <Col span={8} order={2}>
        Rendered third, appears second
      </Col>
    </Row>
  );
};
```

### Flex Column

```typescript
import { Row, Col } from '@eightfold.ai/octuple';

const FlexColumns = () => {
  return (
    <Row gutter={16}>
      <Col flex="100px">Fixed 100px</Col>
      <Col flex="auto">Flexible width (fills remaining space)</Col>
      <Col flex="200px">Fixed 200px</Col>
    </Row>
  );
};
```

---

## Common Patterns

### Pattern 1: Two-Column Form

**When to use:** Form with side-by-side fields

```typescript
import { Row, Col, Form, TextInput } from '@eightfold.ai/octuple';

const TwoColumnForm = () => {
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
    </Form>
  );
};
```

### Pattern 2: Responsive Card Grid

**When to use:** Grid of cards that adapts to screen size

```typescript
import { Row, Col, Card } from '@eightfold.ai/octuple';

const CardGrid = ({ items }: { items: any[] }) => {
  return (
    <Row gutter={[16, 16]}>
      {items.map((item, index) => (
        <Col 
          key={index}
          xs={24}  // 1 column on mobile
          sm={12}  // 2 columns on small tablets
          md={8}   // 3 columns on medium screens
          lg={6}   // 4 columns on large screens
        >
          <Card title={item.title}>
            {item.content}
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
- Always use Col inside a Row
- Use span values that sum to 24 for full width
- Use responsive props (xs, sm, md, lg) for mobile-first design
- Add explicit flex styles when columns don't align properly
- Use `offset` for spacing instead of empty columns

### ❌ Don't
- Don't use Col without a parent Row
- Don't use span values exceeding 24
- Don't nest Rows deeply (affects performance)
- Don't use margins directly on Col (use Row's gutter instead)

---

## Common Mistakes

### Mistake 1: Column Spanning Too Wide

**Problem:**
```typescript
<Row>
  <Col span={16}>Content</Col>
  <Col span={12}>Sidebar</Col> {/* ❌ Total: 28, exceeds 24 */}
</Row>
```

**Solution:**
```typescript
<Row>
  <Col span={16}>Content</Col>
  <Col span={8}>Sidebar</Col> {/* ✅ Total: 24 */}
</Row>
```

---

### Mistake 2: Not Using Row Parent

**Problem:**
```typescript
<Col span={12}>Content</Col> {/* ❌ No Row parent */}
```

**Solution:**
```typescript
<Row>
  <Col span={12}>Content</Col> {/* ✅ Inside Row */}
</Row>
```

---

### Mistake 3: Columns Stacking Unexpectedly

**Problem:**
```typescript
<Row>
  <Col span={16}>Content</Col>
  <Col span={8}>Sidebar</Col>
</Row>
{/* ❌ Columns stack vertically instead of horizontally */}
```

**Solution:**
```typescript
<Row style={{ display: 'flex', flexWrap: 'nowrap' }}>
  <Col span={16} style={{ flex: '0 0 66.666%', maxWidth: '66.666%' }}>Content</Col>
  <Col span={8} style={{ flex: '0 0 33.333%', maxWidth: '33.333%' }}>Sidebar</Col>
</Row>
{/* ✅ Explicit flex styling ensures horizontal layout */}
```

**Why:** Octuple's Col components require explicit flex styles on both Row and Col for reliable horizontal layouts.

---

## Accessibility

- Col is a layout component with no specific ARIA requirements
- Ensure content inside columns is accessible
- Use proper heading hierarchy
- Maintain logical reading order (left-to-right, top-to-bottom)

---

## Related Components

- **Row**: Parent container for Col components
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
- Added responsive column examples
- Included common patterns and mistakes

