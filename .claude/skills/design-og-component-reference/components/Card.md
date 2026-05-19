# Card

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Card component is a flexible container for grouping related content. It provides a consistent, elevated surface for displaying information, actions, and interactive elements.

### When to Use
- Grouping related information
- Displaying preview content
- Creating dashboard widgets
- List items with multiple pieces of information
- Content sections with headers and actions

### When NOT to Use
- Simple text blocks (use Typography instead)
- Full-page layouts (use Layout instead)
- Navigation menus (use Menu instead)

---

## API Reference

### Import
```typescript
import { Card } from '@eightfold.ai/octuple';
```

### Props

From the Confluence documentation, Card has standard container props. Specific props need to be verified from TypeScript definitions.

**Common Usage:**
```typescript
<Card title="Card Title">
  Card content goes here
</Card>
```

---

## Usage Examples

### Basic Card

```typescript
import React from 'react';
import { Card } from '@eightfold.ai/octuple';

const BasicCard = () => {
  return (
    <Card title="Simple Card">
      <p>This is the card content.</p>
    </Card>
  );
};
```

### Card with Actions

```typescript
import { Card, Button } from '@eightfold.ai/octuple';

const CardWithActions = () => {
  return (
    <Card 
      title="Card with Actions"
      actions={[
        <Button key="cancel" text="Cancel" />,
        <Button key="save" text="Save" variant={ButtonVariant.Primary} />
      ]}
    >
      <p>Card content with action buttons.</p>
    </Card>
  );
};
```

### Card Grid

```typescript
import { Row, Col, Card } from '@eightfold.ai/octuple';

const CardGrid = () => {
  const cards = [
    { title: 'Card 1', content: 'Content 1' },
    { title: 'Card 2', content: 'Content 2' },
    { title: 'Card 3', content: 'Content 3' },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card, index) => (
        <Col span={8} key={index}>
          <Card title={card.title}>
            <p>{card.content}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
```

---

## Common Patterns

### Pattern 1: Dashboard Widget

**When to use:** Display metrics or status information

```typescript
import { Card } from '@eightfold.ai/octuple';

const DashboardWidget = () => {
  return (
    <Card title="Active Users">
      <div style={{ fontSize: '32px', fontWeight: 'bold' }}>1,234</div>
      <div style={{ color: '#52c41a' }}>↑ 12% from last month</div>
    </Card>
  );
};
```

### Pattern 2: Profile Card

**When to use:** User profile or contact information

```typescript
import { Card, Avatar, Button, ButtonVariant } from '@eightfold.ai/octuple';

const ProfileCard = () => {
  return (
    <Card>
      <div style={{ textAlign: 'center' }}>
        <Avatar size="80px" type="square" />
        <h3>John Doe</h3>
        <p>Software Engineer</p>
        <Button text="View Profile" variant={ButtonVariant.Primary} />
      </div>
    </Card>
  );
};
```

---

## Best Practices

### ✅ Do
- Use clear, descriptive titles
- Group related content together
- Provide actions when needed
- Use consistent card sizes in grids
- Keep content concise

### ❌ Don't
- Don't nest cards deeply
- Don't overload with too much content
- Don't use for single text elements
- Don't forget padding for content

---

## Accessibility

- Card is a layout component with no specific ARIA requirements
- Ensure content inside cards is accessible
- Use proper heading hierarchy for titles
- Make interactive elements keyboard accessible

---

## Related Components

- **Row / Col**: For card grids
- **Button**: For card actions
- **Avatar**: For user cards
- **Badge**: For status indicators

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Card/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Added common usage patterns
- Included card grid examples

