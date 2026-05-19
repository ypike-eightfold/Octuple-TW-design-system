# User Profile Pattern

**Pattern Type:** Display  
**Complexity:** Medium  
**Last Updated:** November 20, 2024

---

## Overview

User profile page with Avatar, Tabs, and editable information.

---

## Basic Pattern

```typescript
import { Avatar, Tabs, Tab, Card, Form, TextInput, Button, ButtonVariant, Badge, Row, Col } from '@eightfold.ai/octuple';
import { useState } from 'react';

const UserProfilePattern = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      {/* Profile Header */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Avatar size="120px" type="square">JD</Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ margin: 0 }}>John Doe</h1>
              <Badge count="Active" />
            </div>
            <p style={{ margin: 0, color: '#666' }}>Senior Software Engineer</p>
            <p style={{ margin: 0, color: '#666' }}>San Francisco, CA</p>
          </div>
          <Button
            text={isEditing ? 'Cancel' : 'Edit Profile'}
            onClick={() => setIsEditing(!isEditing)}
          />
        </div>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} style={{ marginTop: '24px' }}>
        <Tab value="info" label="Information">
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="First Name" name="firstName">
                    <TextInput disabled={!isEditing} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="lastName">
                    <TextInput disabled={!isEditing} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Email" name="email">
                <TextInput disabled={!isEditing} />
              </Form.Item>
              {isEditing && (
                <Button text="Save Changes" variant={ButtonVariant.Primary} htmlType="submit" />
              )}
            </Form>
          </Card>
        </Tab>

        <Tab value="settings" label="Settings">
          <Card>
            <p>Settings content</p>
          </Card>
        </Tab>

        <Tab value="activity" label="Activity">
          <Card>
            <p>Activity content</p>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};
```

---

## Resources

- [Avatar Component Guide](../components/Avatar.md)
- [Tabs Component Guide](../components/Tabs.md)
- [Form Component Guide](../components/Form.md)

