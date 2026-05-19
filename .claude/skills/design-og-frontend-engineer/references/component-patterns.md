# Octuple Component Patterns

This guide provides common UI patterns and best practices for building applications with the Octuple Design System.

## Table of Contents

1. [Form Patterns](#form-patterns)
2. [Table Patterns](#table-patterns)
3. [Modal Patterns](#modal-patterns)
4. [Layout Patterns](#layout-patterns)
5. [Navigation Patterns](#navigation-patterns)
6. [Data Display Patterns](#data-display-patterns)
7. [Feedback Patterns](#feedback-patterns)

---

## Form Patterns

### Basic Form with Validation

```tsx
import { Form, Input, Button, Toast } from '@eightfold.ai/octuple';
import { useState } from 'react';

const BasicForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // API call here
      await submitData(values);
      Toast.success('Form submitted successfully!');
      form.resetFields();
    } catch (error) {
      Toast.error('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item>
        <Button
          htmlType="submit"
          text="Submit"
          variant="primary"
          loading={loading}
        />
      </Form.Item>
    </Form>
  );
};
```

### Multi-Step Form

```tsx
import { Form, Input, Button, Stepper, Card } from '@eightfold.ai/octuple';
import { useState } from 'react';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();

  const steps = [
    { title: 'Personal Info', description: 'Basic details' },
    { title: 'Account', description: 'Account setup' },
    { title: 'Confirmation', description: 'Review & submit' }
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Submit all form data
    console.log('Final form data:', formData);
  };

  return (
    <Card>
      <Stepper current={currentStep}>
        {steps.map((step) => (
          <Stepper.Step
            key={step.title}
            title={step.title}
            description={step.description}
          />
        ))}
      </Stepper>

      <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
        {currentStep === 0 && (
          <>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Enter last name" />
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item label="Username" name="username" rules={[{ required: true }]}>
              <Input placeholder="Choose username" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="Choose password" />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <div>
            <p>Review your information before submitting</p>
            {/* Display summary */}
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          {currentStep > 0 && (
            <Button text="Previous" onClick={handlePrevious} />
          )}
          {currentStep < steps.length - 1 ? (
            <Button text="Next" variant="primary" onClick={handleNext} />
          ) : (
            <Button text="Submit" variant="primary" onClick={handleSubmit} />
          )}
        </div>
      </Form>
    </Card>
  );
};
```

### Inline Form (Search/Filter)

```tsx
import { Form, Input, Select, Button, Row, Col } from '@eightfold.ai/octuple';

const SearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleSearch = (values: any) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Form form={form} layout="inline" onFinish={handleSearch}>
      <Form.Item name="keyword">
        <Input placeholder="Search..." />
      </Form.Item>
      <Form.Item name="category">
        <Select placeholder="Category" style={{ width: 150 }}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="tech">Technology</Select.Option>
          <Select.Option value="business">Business</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" text="Search" variant="primary" />
        <Button text="Reset" onClick={handleReset} style={{ marginLeft: '8px' }} />
      </Form.Item>
    </Form>
  );
};
```

---

## Table Patterns

### Basic Table with Actions

```tsx
import { Table, Button, Space, Tag } from '@eightfold.ai/octuple';

interface DataType {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const UserTable = () => {
  const data: DataType[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
    // ... more data
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: DataType, b: DataType) => a.name.localeCompare(b.name),
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
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DataType) => (
        <Space>
          <Button text="Edit" onClick={() => handleEdit(record)} />
          <Button text="Delete" variant="danger" onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ];

  const handleEdit = (record: DataType) => {
    console.log('Edit:', record);
  };

  const handleDelete = (record: DataType) => {
    console.log('Delete:', record);
  };

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};
```

### Table with Selection

```tsx
import { Table, Button, Space } from '@eightfold.ai/octuple';
import { useState } from 'react';

const SelectableTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: string[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleBulkDelete = () => {
    console.log('Delete selected:', selectedRowKeys);
    setSelectedRowKeys([]);
  };

  return (
    <>
      {selectedRowKeys.length > 0 && (
        <Space style={{ marginBottom: '16px' }}>
          <span>{selectedRowKeys.length} selected</span>
          <Button text="Delete Selected" variant="danger" onClick={handleBulkDelete} />
        </Space>
      )}
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        rowSelection={rowSelection}
      />
    </>
  );
};
```

---

## Modal Patterns

### Confirmation Modal

```tsx
import { Modal, Button } from '@eightfold.ai/octuple';
import { useState } from 'react';

const DeleteConfirmation = ({ itemName, onConfirm }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button text="Delete" variant="danger" onClick={() => setVisible(true)} />
      <Modal
        visible={visible}
        title="Confirm Deletion"
        onOk={handleConfirm}
        onCancel={() => setVisible(false)}
        okText="Delete"
        okButtonProps={{ variant: 'danger', loading }}
      >
        <p>Are you sure you want to delete <strong>{itemName}</strong>?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};
```

### Form Modal

```tsx
import { Modal, Form, Input, Button } from '@eightfold.ai/octuple';
import { useState } from 'react';

const AddUserModal = ({ onSuccess }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await saveUser(values);
      setVisible(false);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <>
      <Button text="Add User" variant="primary" onClick={() => setVisible(true)} />
      <Modal
        visible={visible}
        title="Add New User"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        okButtonProps={{ loading }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
```

---

## Layout Patterns

### App Layout with Sidebar

```tsx
import { Layout, Menu } from '@eightfold.ai/octuple';
import { useState } from 'react';

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <h2 style={{ color: 'white' }}>Logo</h2>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Dashboard</Menu.Item>
          <Menu.Item key="2">Users</Menu.Item>
          <Menu.SubMenu key="sub1" title="Settings">
            <Menu.Item key="3">Profile</Menu.Item>
            <Menu.Item key="4">Security</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Layout.Sider>

      <Layout>
        <Layout.Header style={{ background: '#fff', padding: '0 24px' }}>
          <h1>Page Title</h1>
        </Layout.Header>
        <Layout.Content style={{ margin: '24px', padding: '24px', background: '#fff' }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
```

### Card Grid Layout

```tsx
import { Row, Col, Card, Button } from '@eightfold.ai/octuple';

const CardGrid = () => {
  const items = [
    { id: 1, title: 'Card 1', description: 'Description 1' },
    { id: 2, title: 'Card 2', description: 'Description 2' },
    // ... more items
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            title={item.title}
            hoverable
            actions={[
              <Button text="View" />,
              <Button text="Edit" />
            ]}
          >
            <p>{item.description}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
```

---

## Navigation Patterns

### Top Navigation

```tsx
import { Menu, Dropdown, Avatar } from '@eightfold.ai/octuple';

const TopNav = () => {
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', background: '#fff' }}>
      <Menu mode="horizontal" defaultSelectedKeys={['home']}>
        <Menu.Item key="home">Home</Menu.Item>
        <Menu.Item key="products">Products</Menu.Item>
        <Menu.Item key="about">About</Menu.Item>
      </Menu>
      <Dropdown menu={userMenu} trigger={['click']}>
        <Avatar>UN</Avatar>
      </Dropdown>
    </div>
  );
};
```

### Breadcrumb Navigation

```tsx
import { Breadcrumb } from '@eightfold.ai/octuple';
import { useLocation, Link } from 'react-router-dom';

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSnippets.length - 1;

    return (
      <Breadcrumb.Item key={url}>
        {isLast ? (
          snippet
        ) : (
          <Link to={url}>{snippet}</Link>
        )}
      </Breadcrumb.Item>
    );
  });

  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
      {breadcrumbItems}
    </Breadcrumb>
  );
};
```

---

## Data Display Patterns

### Statistics Cards

```tsx
import { Row, Col, Card } from '@eightfold.ai/octuple';

const StatisticsCards = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', change: '+12%' },
    { title: 'Revenue', value: '$45,678', change: '+8%' },
    { title: 'Orders', value: '890', change: '-3%' },
    { title: 'Conversion', value: '3.2%', change: '+0.5%' },
  ];

  return (
    <Row gutter={16}>
      {stats.map((stat, index) => (
        <Col key={index} xs={24} sm={12} md={6}>
          <Card>
            <div style={{ fontSize: '14px', color: '#666' }}>{stat.title}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: stat.change.startsWith('+') ? 'green' : 'red' }}>
              {stat.change}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
```

### Empty State

```tsx
import { Card, Button } from '@eightfold.ai/octuple';

const EmptyState = ({ onAdd }) => {
  return (
    <Card>
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <h3>No data yet</h3>
        <p>Get started by adding your first item</p>
        <Button text="Add Item" variant="primary" onClick={onAdd} />
      </div>
    </Card>
  );
};
```

---

## Feedback Patterns

### Loading States

```tsx
import { Spinner, Card } from '@eightfold.ai/octuple';

const LoadingCard = ({ loading, children }) => {
  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Spinner size="large" tip="Loading..." />
        </div>
      </Card>
    );
  }

  return <Card>{children}</Card>;
};
```

### Toast Notifications

```tsx
import { Button, Toast } from '@eightfold.ai/octuple';

const NotificationExamples = () => {
  const showSuccess = () => {
    Toast.success('Operation completed successfully!');
  };

  const showError = () => {
    Toast.error('An error occurred. Please try again.');
  };

  const showWarning = () => {
    Toast.warning('This action requires confirmation.');
  };

  const showInfo = () => {
    Toast.info('New update available.');
  };

  return (
    <div>
      <Button text="Success" onClick={showSuccess} />
      <Button text="Error" onClick={showError} />
      <Button text="Warning" onClick={showWarning} />
      <Button text="Info" onClick={showInfo} />
    </div>
  );
};
```

---

## Best Practices

### 1. Consistent Spacing
- Use Octuple's Grid system (Row/Col) for layout
- Use consistent gutter values (8, 16, 24)
- Maintain visual hierarchy with padding and margins

### 2. Form Validation
- Always provide clear error messages
- Validate on submit, not on every keystroke
- Show success feedback after form submission

### 3. Loading States
- Show loading indicators for async operations
- Disable buttons during loading to prevent double-submission
- Provide feedback when operations complete

### 4. Responsive Design
- Use Octuple's responsive props (xs, sm, md, lg, xl)
- Test layouts on different screen sizes
- Consider mobile-first approach

### 5. Accessibility
- Use proper labels for form fields
- Provide alt text for images
- Ensure keyboard navigation works
- Use appropriate ARIA attributes

### 6. Error Handling
- Always handle errors gracefully
- Provide clear error messages
- Offer recovery actions when possible

---

## Anti-Patterns to Avoid

❌ **Mixing UI Libraries**
Don't mix Octuple with other UI libraries like Material-UI or Ant Design.

❌ **Custom CSS Classes**
Avoid creating custom CSS classes when Octuple provides the functionality.

❌ **Inline Styles Everywhere**
Use Octuple's component props instead of inline styles when possible.

❌ **Ignoring Loading States**
Always handle loading states for async operations.

❌ **Poor Form Validation**
Don't rely only on client-side validation; always validate on the server too.

---

For more detailed component APIs, always refer to `docs/design-system-ai.md`.

