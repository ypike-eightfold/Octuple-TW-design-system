# Card Grid Pattern

**Pattern Type:** Layout  
**Complexity:** Easy  
**Last Updated:** November 20, 2024

---

## Overview

Responsive grid layout using Row/Col with Card components for displaying collections of items.

---

## Basic Pattern

```typescript
import { Row, Col, Card, Button, ButtonVariant } from '@eightfold.ai/octuple';

const CardGrid = () => {
  const items = [
    { id: 1, title: 'Item 1', description: 'Description 1' },
    { id: 2, title: 'Item 2', description: 'Description 2' },
    { id: 3, title: 'Item 3', description: 'Description 3' },
    { id: 4, title: 'Item 4', description: 'Description 4' },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col key={item.id} span={6}> {/* 4 columns */}
          <Card title={item.title}>
            <p>{item.description}</p>
            <Button text="View Details" variant={ButtonVariant.Primary} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};
```

---

## Responsive Grid

```typescript
import { Row, Col, Card } from '@eightfold.ai/octuple';

const ResponsiveCardGrid = () => {
  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col 
          key={item.id}
          xs={24}  // 1 column on mobile
          sm={12}  // 2 columns on small tablets
          md={8}   // 3 columns on medium screens
          lg={6}   // 4 columns on large screens
        >
          <Card title={item.title}>
            {item.description}
          </Card>
        </Col>
      ))}
    </Row>
  );
};
```

---

## Resources

- [Row Component Guide](../components/Row.md)
- [Col Component Guide](../components/Col.md)
- [Card Component Guide](../components/Card.md)

