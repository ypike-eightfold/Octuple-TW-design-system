# Modal

Modal component for displaying content in a modal dialog overlay.

## Import

```typescript
import { Modal } from '@eightfold.ai/octuple';
```

## API Reference

### Modal Props

Modal extends Base Dialog with additional props.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| modalClassNames | Custom class names for the modal | `string` | | |
| modalWrapperClassNames | Custom class names for the modal wrapper | `string` | | |
| size | The Modal size | `<enum>ModalSize` | | |

For complete API including inherited props, see [Dialog](./Dialog.md) and [BaseDialog](#basedialog-props).

## TypeScript Enums

```typescript
enum ModalSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
  xLarge = 'xlarge'
}
```

## BaseDialog Props

Shared props between Modal and Dialog:

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| actionButtons | Array of action buttons | `ButtonProps[]` | |
| body | The dialog body content | `React.ReactNode` | |
| bodyClassNames | Custom class names for body | `string` | |
| bodyPadding | Whether body has padding | `boolean` | `true` |
| bodyStyle | Custom styles for body | `React.CSSProperties` | |
| classNames | Dialog class names | `string` | |
| closable | Whether dialog can be closed | `boolean` | `true` |
| closeButtonAriaLabelText | Close button aria label | `string` | `'Close'` |
| closeButtonProps | Props for close button | `ButtonProps` | |
| closeIcon | Custom close icon | `IconName \| React.ReactNode` | |
| configContextProps | Configure contextual props | `ConfigContextProps` | |
| focusTrap | Enable focus trap | `boolean` | `true` |
| header | The dialog header content | `React.ReactNode` | |
| headerButtonProps | Props for header button | `ButtonProps` | |
| headerClassNames | Custom class names for header | `string` | |
| headerIcon | Icon for header | `IconName \| React.ReactNode` | |
| headerStyle | Custom styles for header | `React.CSSProperties` | |
| height | Dialog height | `string \| number` | |
| maskClosable | Click mask to close | `boolean` | `true` |
| onClose | Callback when dialog closes | `() => void` | |
| onVisibleChange | Callback when visibility changes | `(visible: boolean) => void` | |
| overlay | Show overlay/mask | `boolean` | `true` |
| parent | Parent element for portal | `HTMLElement` | `document.body` |
| positionStrategy | Position strategy | `'absolute' \| 'fixed'` | `'fixed'` |
| renderContentAlways | Always render content | `boolean` | `false` |
| role | Dialog ARIA role | `string` | `'dialog'` |
| style | Custom styles | `React.CSSProperties` | |
| visible | Whether dialog is visible | `boolean` | `false` |
| width | Dialog width | `string \| number` | |
| zIndex | Dialog z-index | `number` | |

## Usage Examples

### Basic Modal

```typescript
import { Modal, Button, ButtonVariant } from '@eightfold.ai/octuple';

function BasicModal() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Open Modal" onClick={() => setVisible(true)} />
      
      <Modal
        visible={visible}
        header="Modal Title"
        body="This is the modal content"
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

### Modal Sizes

```typescript
import { Modal, Button, ModalSize } from '@eightfold.ai/octuple';

function SizedModals() {
  const [size, setSize] = React.useState<ModalSize | null>(null);

  return (
    <>
      <Button text="Small" onClick={() => setSize(ModalSize.small)} />
      <Button text="Medium" onClick={() => setSize(ModalSize.medium)} />
      <Button text="Large" onClick={() => setSize(ModalSize.large)} />
      <Button text="X-Large" onClick={() => setSize(ModalSize.xLarge)} />
      
      <Modal
        visible={size !== null}
        size={size || ModalSize.medium}
        header="Modal Title"
        body="Modal content goes here"
        onClose={() => setSize(null)}
      />
    </>
  );
}
```

### Modal with Actions

```typescript
import { Modal, Button, ButtonVariant } from '@eightfold.ai/octuple';

function ActionModal() {
  const [visible, setVisible] = React.useState(false);

  const handleSave = () => {
    console.log('Saving...');
    setVisible(false);
  };

  return (
    <>
      <Button text="Open Modal" onClick={() => setVisible(true)} />
      
      <Modal
        visible={visible}
        header="Confirm Action"
        body="Are you sure you want to proceed?"
        actionButtons={[
          {
            text: 'Cancel',
            variant: ButtonVariant.Secondary,
            onClick: () => setVisible(false)
          },
          {
            text: 'Confirm',
            variant: ButtonVariant.Primary,
            onClick: handleSave
          }
        ]}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

### Modal with Form

```typescript
import { Modal, Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';

function FormModal() {
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const modalBody = (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter name' }]}
      >
        <TextInput placeholder="Enter name" />
      </Form.Item>
      
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please enter email' },
          { type: 'email', message: 'Please enter valid email' }
        ]}
      >
        <TextInput placeholder="Enter email" />
      </Form.Item>
    </Form>
  );

  return (
    <>
      <Button text="Add User" onClick={() => setVisible(true)} />
      
      <Modal
        visible={visible}
        header="Add New User"
        body={modalBody}
        actionButtons={[
          {
            text: 'Cancel',
            variant: ButtonVariant.Secondary,
            onClick: () => {
              setVisible(false);
              form.resetFields();
            }
          },
          {
            text: 'Save',
            variant: ButtonVariant.Primary,
            onClick: handleSubmit
          }
        ]}
        onClose={() => {
          setVisible(false);
          form.resetFields();
        }}
      />
    </>
  );
}
```

### Confirmation Modal

```typescript
import { Modal, Button, ButtonVariant } from '@eightfold.ai/octuple';
import { mdiAlert } from '@mdi/js';

function ConfirmModal() {
  const [visible, setVisible] = React.useState(false);

  const handleDelete = () => {
    console.log('Deleting...');
    setVisible(false);
  };

  return (
    <>
      <Button
        text="Delete"
        variant={ButtonVariant.Disruptive}
        onClick={() => setVisible(true)}
      />
      
      <Modal
        visible={visible}
        header="Confirm Deletion"
        headerIcon={mdiAlert}
        body="Are you sure you want to delete this item? This action cannot be undone."
        actionButtons={[
          {
            text: 'Cancel',
            variant: ButtonVariant.Secondary,
            onClick: () => setVisible(false)
          },
          {
            text: 'Delete',
            variant: ButtonVariant.Disruptive,
            onClick: handleDelete
          }
        ]}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

### Modal without Mask Close

```typescript
import { Modal, Button } from '@eightfold.ai/octuple';

function NonDismissibleModal() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Open Modal" onClick={() => setVisible(true)} />
      
      <Modal
        visible={visible}
        header="Important"
        body="You must take action before closing this modal"
        maskClosable={false}
        closable={false}
        actionButtons={[
          {
            text: 'I Understand',
            onClick: () => setVisible(false)
          }
        ]}
      />
    </>
  );
}
```

## Accessibility

- Use appropriate ARIA role
- Ensure keyboard navigation (Tab, Esc)
- Trap focus within modal
- Announce modal opening to screen readers
- Provide clear close button
- Use semantic heading in header

## Best Practices

1. **Clear Purpose**: Modal header should clearly state purpose
2. **Action Buttons**: Provide clear primary and secondary actions
3. **Escape Hatch**: Allow users to close modal (Esc key, X button, mask click)
4. **Focus Management**: Focus first input on open, restore focus on close
5. **Appropriate Size**: Choose size based on content
6. **Avoid Nesting**: Don't open modals from modals

## Common Mistakes

❌ **Don't** nest modals

```typescript
// Bad - modal inside modal
<Modal visible={modal1}>
  <Modal visible={modal2}>...</Modal>
</Modal>
```

✅ **Do** close first modal before opening second

```typescript
// Good
const openSecondModal = () => {
  setModal1(false);
  setTimeout(() => setModal2(true), 300);
};
```

❌ **Don't** make modals unclosable without reason

```typescript
// Bad - user is trapped
<Modal
  visible={visible}
  closable={false}
  maskClosable={false}
/>
```

✅ **Do** always provide a way to close

```typescript
// Good
<Modal
  visible={visible}
  actionButtons={[
    { text: 'Close', onClick: handleClose }
  ]}
/>
```

❌ **Don't** forget to reset form on close

```typescript
// Bad - stale data remains
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  body={<Form form={form} />}
/>
```

✅ **Do** reset form state

```typescript
// Good
<Modal
  visible={visible}
  onClose={() => {
    setVisible(false);
    form.resetFields();
  }}
/>
```

## Related Components

- [Dialog](./Dialog.md) - Alternative dialog component
- [Panel](./Panel.md) - For slide-out side panels
- [Drawer](./Drawer.md) - For side drawers
- [Button](./Button.md) - For modal actions
- [Form](./Form.md) - For modal forms

