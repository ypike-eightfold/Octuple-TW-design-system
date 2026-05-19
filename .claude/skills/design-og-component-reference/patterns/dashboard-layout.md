# Dashboard Layout Pattern

**Pattern Type:** Layout  
**Complexity:** Medium  
**Last Updated:** November 20, 2024

---

## Overview

Dashboard layout with metric cards and widgets using Row/Col grid system.

---

## Basic Pattern

```typescript
import { Row, Col, Card, Button, ButtonVariant } from '@eightfold.ai/octuple';

const DashboardLayout = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Dashboard</h1>
        <Button text="Export Report" variant={ButtonVariant.Primary} />
      </div>

      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Users</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>1,234</div>
            <div style={{ color: '#52c41a' }}>↑ 12% from last month</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Revenue</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>$45,678</div>
            <div style={{ color: '#52c41a' }}>↑ 8% from last month</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Active Sessions</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>156</div>
            <div style={{ color: '#ff4d4f' }}>↓ 3% from last month</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Conversion Rate</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>3.2%</div>
            <div style={{ color: '#52c41a' }}>↑ 0.5% from last month</div>
          </Card>
        </Col>
      </Row>

      {/* Widget Cards */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Recent Activity">
            <p>Activity chart or list would go here</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Quick Actions">
            <Button text="Create Report" buttonWidth="fill" style={{ marginBottom: '8px' }} />
            <Button text="Add User" buttonWidth="fill" style={{ marginBottom: '8px' }} />
            <Button text="View Analytics" buttonWidth="fill" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

---

## Responsive Dashboard

```typescript
import { Row, Col, Card } from '@eightfold.ai/octuple';

const ResponsiveDashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        {/* Metric cards - 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div>Total Users</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>1,234</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div>Revenue</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>$45,678</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div>Sessions</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>156</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div>Conversion</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>3.2%</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

---

## Resources

- [Row Component Guide](../components/Row.md)
- [Col Component Guide](../components/Col.md)
- [Card Component Guide](../components/Card.md)

