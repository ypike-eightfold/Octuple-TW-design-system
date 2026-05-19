# Dialog

Dialog component for displaying content in a centered dialog overlay.

## Import

```typescript
import { Dialog } from '@eightfold.ai/octuple';
```

## API Reference

### Dialog Props

Dialog extends Base Dialog with additional props.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| cancelButtonProps | Props for the cancel button | `ButtonProps` | | |
| cancelText | Text for cancel button | `string` | `'Cancel'` | |
| okButtonProps | Props for the OK button | `ButtonProps` | | |
| okText | Text for OK button | `string` | `'OK'` | |
| onCancel | Callback when cancel is clicked | `() => void` | | |
| onOk | Callback when OK is clicked | `() => void` | | |

For complete API including inherited props, see [Modal](./Modal.md) for all Base Dialog props.

## Usage Examples

### Basic Dialog

```typescript
import { Dialog, Button } from '@eightfold.ai/octuple';

function BasicDialog() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Open Dialog" onClick={() => setVisible(true)} />
      
      <Dialog
        visible={visible}
        header="Dialog Title"
        body="This is the dialog content"
        onOk={() => {
          console.log('OK clicked');
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
```

### Confirmation Dialog

```typescript
import { Dialog, Button, ButtonVariant } from '@eightfold.ai/octuple';

function ConfirmationDialog() {
  const [visible, setVisible] = React.useState(false);

  const handleConfirm = () => {
    console.log('Confirmed');
    setVisible(false);
  };

  return (
    <>
      <Button
        text="Delete Item"
        variant={ButtonVariant.Disruptive}
        onClick={() => setVisible(true)}
      />
      
      <Dialog
        visible={visible}
        header="Confirm Deletion"
        body="Are you sure you want to delete this item? This action cannot be undone."
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ variant: ButtonVariant.Disruptive }}
        onOk={handleConfirm}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
```

### Async Dialog

```typescript
import { Dialog, Button } from '@eightfold.ai/octuple';

function AsyncDialog() {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleOk = async () => {
    setLoading(true);
    
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Operation completed');
      setVisible(false);
    } catch (error) {
      console.error('Operation failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button text="Submit" onClick={() => setVisible(true)} />
      
      <Dialog
        visible={visible}
        header="Submit Form"
        body="Are you ready to submit the form?"
        okButtonProps={{ loading }}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
```

### Info Dialog

```typescript
import { Dialog, Button } from '@eightfold.ai/octuple';
import { mdiInformation } from '@mdi/js';

function InfoDialog() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Show Info" onClick={() => setVisible(true)} />
      
      <Dialog
        visible={visible}
        header="Information"
        headerIcon={mdiInformation}
        body="This is an informational message. Click OK to continue."
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
```

### Dialog with Custom Content

```typescript
import { Dialog, Button, Form, TextInput } from '@eightfold.ai/octuple';

function CustomContentDialog() {
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const dialogBody = (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true }]}
      >
        <TextInput placeholder="Enter username" />
      </Form.Item>
      
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true }]}
      >
        <TextInput type="password" placeholder="Enter password" />
      </Form.Item>
    </Form>
  );

  return (
    <>
      <Button text="Login" onClick={() => setVisible(true)} />
      
      <Dialog
        visible={visible}
        header="Login"
        body={dialogBody}
        okText="Login"
        onOk={handleOk}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
      />
    </>
  );
}
```

## Accessibility

- Use appropriate ARIA role
- Ensure keyboard navigation works
- Trap focus within dialog
- Provide clear button labels
- Announce dialog opening to screen readers

## Best Practices

1. **Clear Actions**: OK/Cancel buttons should have clear labels
2. **Default Action**: OK button should be primary action
3. **Escape Hatch**: Allow closing via Cancel, X button, or Esc key
4. **Async Operations**: Show loading state for async actions
5. **Form Validation**: Validate before closing dialog

## Common Mistakes

❌ **Don't** use generic button text for critical actions

```typescript
// Bad - unclear what OK does
<Dialog
  body="Delete all data?"
  okText="OK"
/>
```

✅ **Do** use descriptive button text

```typescript
// Good
<Dialog
  body="Delete all data? This cannot be undone."
  okText="Delete All Data"
  cancelText="Keep Data"
/>
```

❌ **Don't** forget to handle async operations

```typescript
// Bad - dialog closes immediately
<Dialog
  onOk={() => {
    saveData(); // async function
    setVisible(false);
  }}
/>
```

✅ **Do** wait for async completion

```typescript
// Good
<Dialog
  onOk={async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
    setVisible(false);
  }}
  okButtonProps={{ loading }}
/>
```

## Related Components

- [Modal](./Modal.md) - For more customizable dialogs
- [Drawer](./Drawer.md) - For side panel dialogs
- [Button](./Button.md) - For dialog actions
- [Form](./Form.md) - For dialog forms

