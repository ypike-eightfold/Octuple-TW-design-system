# Data Table Pattern

**Pattern Type:** Data Display  
**Complexity:** Medium  
**Last Updated:** November 20, 2024

---

## Overview

Note: Octuple Table component was not in the received Confluence documentation. This pattern shows filtering and data display using available components.

---

## Basic Pattern with Filters

```typescript
import { Card, Row, Col, Select, CheckBoxGroup, Button, ButtonVariant } from '@eightfold.ai/octuple';
import { useState } from 'react';

const DataTablePattern = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const typeOptions = [
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' },
    { value: 'type3', label: 'Type 3' },
  ];

  return (
    <Card>
      <h2>Data List</h2>
      
      {/* Filters */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <div style={{ marginBottom: '8px' }}>Status</div>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={statusOptions}
          />
        </Col>
        <Col span={16}>
          <div style={{ marginBottom: '8px' }}>Types</div>
          <CheckBoxGroup
            value={selectedTypes}
            onChange={(values) => setSelectedTypes(values)}
            options={typeOptions}
          />
        </Col>
      </Row>

      {/* Data Display (would be table if available) */}
      <div>
        <p>Status: {statusFilter}</p>
        <p>Selected Types: {selectedTypes.join(', ') || 'None'}</p>
      </div>

      <Button text="Export" variant={ButtonVariant.Primary} />
    </Card>
  );
};
```

---

## Resources

- [Select Component Guide](../components/Select.md)
- [CheckBox Component Guide](../components/CheckBox.md)

