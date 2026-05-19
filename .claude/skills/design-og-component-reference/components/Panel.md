# Panel

Panel component for slide-out side panels (drawers).

## Import

```typescript
import { Panel } from '@eightfold.ai/octuple';
```

## API Reference

### Panel Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| actionButtonOneProps | Props for action button one | `ButtonProps` | | |
| actionButtonThreeProps | Props for action button three | `ButtonProps` | | |
| actionButtonTwoProps | Props for action button two | `ButtonProps` | | |
| bodyClassNames | Custom class names for body | `string` | | |
| bodyPadding | Whether body has padding | `boolean` | `true` | |
| bodyStyle | Custom styles for body | `React.CSSProperties` | | |
| classNames | Panel class names | `string` | | |
| closable | Whether panel can be closed | `boolean` | `true` | |
| closeButtonAriaLabelText | Close button aria label | `string` | `'Close'` | |
| closeButtonProps | Props for close button | `ButtonProps` | | |
| closeIcon | Custom close icon | `IconName \| React.ReactNode` | | |
| configContextProps | Configure contextual props | `ConfigContextProps` | | |
| footer | Panel footer content | `React.ReactNode` | | |
| footerClassNames | Custom class names for footer | `string` | | |
| header | Panel header content | `React.ReactNode` | | |
| headerButtonProps | Props for header button | `ButtonProps` | | |
| headerClassNames | Custom class names for header | `string` | | |
| headerIcon | Icon for header | `IconName \| React.ReactNode` | | |
| height | Panel height | `string \| number` | | |
| maskClosable | Click mask to close | `boolean` | `true` | |
| onClose | Callback when panel closes | `() => void` | | |
| onVisibleChange | Callback when visibility changes | `(visible: boolean) => void` | | |
| overlay | Show overlay/mask | `boolean` | `true` | |
| parent | Parent element for portal | `HTMLElement` | `document.body` |
| placement | Panel placement | `<enum>PanelPlacement` | `PanelPlacement.right` | |
| push | Push content when panel opens | `boolean \| object` | | |
| renderContentAlways | Always render content | `boolean` | `false` | |
| size | Panel size | `<enum>PanelSize` | | |
| style | Custom styles | `React.CSSProperties` | | |
| visible | Whether panel is visible | `boolean` | `false` | |
| width | Panel width | `string \| number` | | |
| zIndex | Panel z-index | `number` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum PanelPlacement {
  top = 'top',
  right = 'right',
  bottom = 'bottom',
  left = 'left'
}

enum PanelSize {
  small = 'small',
  medium = 'medium',
  large = 'large'
}
```

## Usage Examples

### Basic Panel

```typescript
import { Panel, Button } from '@eightfold.ai/octuple';

function BasicPanel() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Open Panel" onClick={() => setVisible(true)} />
      
      <Panel
        visible={visible}
        header="Panel Title"
        onClose={() => setVisible(false)}
      >
        <p>Panel content goes here</p>
      </Panel>
    </>
  );
}
```

### Panel Placements

```typescript
import { Panel, Button, PanelPlacement } from '@eightfold.ai/octuple';

function PlacementPanels() {
  const [placement, setPlacement] = React.useState<PanelPlacement | null>(null);

  return (
    <>
      <Button text="Top" onClick={() => setPlacement(PanelPlacement.top)} />
      <Button text="Right" onClick={() => setPlacement(PanelPlacement.right)} />
      <Button text="Bottom" onClick={() => setPlacement(PanelPlacement.bottom)} />
      <Button text="Left" onClick={() => setPlacement(PanelPlacement.left)} />
      
      <Panel
        visible={placement !== null}
        placement={placement || PanelPlacement.right}
        header={`${placement} Panel`}
        onClose={() => setPlacement(null)}
      >
        <p>Panel content</p>
      </Panel>
    </>
  );
}
```

### Panel with Actions

```typescript
import { Panel, Button, ButtonVariant } from '@eightfold.ai/octuple';

function ActionPanel() {
  const [visible, setVisible] = React.useState(false);

  const handleSave = () => {
    console.log('Saving...');
    setVisible(false);
  };

  return (
    <>
      <Button text="Edit Profile" onClick={() => setVisible(true)} />
      
      <Panel
        visible={visible}
        header="Edit Profile"
        onClose={() => setVisible(false)}
        actionButtonOneProps={{
          text: 'Cancel',
          variant: ButtonVariant.Secondary,
          onClick: () => setVisible(false)
        }}
        actionButtonTwoProps={{
          text: 'Save',
          variant: ButtonVariant.Primary,
          onClick: handleSave
        }}
      >
        <p>Form content here</p>
      </Panel>
    </>
  );
}
```

### Panel with Form

```typescript
import { Panel, Form, TextInput, Button } from '@eightfold.ai/octuple';

function FormPanel() {
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

  return (
    <>
      <Button text="Add User" onClick={() => setVisible(true)} />
      
      <Panel
        visible={visible}
        header="Add New User"
        onClose={() => {
          setVisible(false);
          form.resetFields();
        }}
        actionButtonOneProps={{
          text: 'Cancel',
          onClick: () => {
            setVisible(false);
            form.resetFields();
          }
        }}
        actionButtonTwoProps={{
          text: 'Save',
          onClick: handleSubmit
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <TextInput placeholder="Enter name" />
          </Form.Item>
          
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <TextInput placeholder="Enter email" />
          </Form.Item>
        </Form>
      </Panel>
    </>
  );
}
```

### Panel Sizes

```typescript
import { Panel, Button, PanelSize } from '@eightfold.ai/octuple';

function SizedPanels() {
  const [size, setSize] = React.useState<PanelSize | null>(null);

  return (
    <>
      <Button text="Small" onClick={() => setSize(PanelSize.small)} />
      <Button text="Medium" onClick={() => setSize(PanelSize.medium)} />
      <Button text="Large" onClick={() => setSize(PanelSize.large)} />
      
      <Panel
        visible={size !== null}
        size={size || PanelSize.medium}
        header="Panel"
        onClose={() => setSize(null)}
      >
        <p>Panel content</p>
      </Panel>
    </>
  );
}
```

### Panel with Footer

```typescript
import { Panel, Button } from '@eightfold.ai/octuple';

function FooterPanel() {
  const [visible, setVisible] = React.useState(false);

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
      <span>© 2024 Company</span>
      <Button text="Help" onClick={() => console.log('Help')} />
    </div>
  );

  return (
    <>
      <Button text="Open Panel" onClick={() => setVisible(true)} />
      
      <Panel
        visible={visible}
        header="Settings"
        footer={footer}
        onClose={() => setVisible(false)}
      >
        <p>Settings content</p>
      </Panel>
    </>
  );
}
```

## Accessibility

- Use appropriate ARIA role
- Ensure keyboard navigation (Tab, Esc)
- Trap focus within panel
- Announce panel opening to screen readers
- Provide clear close button

## Best Practices

1. **Appropriate Use**: Use for secondary content, forms, or details
2. **Clear Header**: Provide descriptive header text
3. **Action Buttons**: Place primary actions in footer
4. **Escape Hatch**: Allow closing via X button, Esc key, or mask click
5. **Loading States**: Show loading for async operations
6. **Responsive**: Consider mobile experience

## Common Mistakes

❌ **Don't** use panel for critical primary content

```typescript
// Bad - main app content in panel
<Panel visible={true}>
  <MainAppContent />
</Panel>
```

✅ **Do** use panel for secondary/detail views

```typescript
// Good
<MainContent />
<Panel visible={showDetails}>
  <ItemDetails />
</Panel>
```

❌ **Don't** forget to reset state on close

```typescript
// Bad - form retains old data
<Panel
  visible={visible}
  onClose={() => setVisible(false)}
>
  <Form form={form} />
</Panel>
```

✅ **Do** reset form state

```typescript
// Good
<Panel
  visible={visible}
  onClose={() => {
    setVisible(false);
    form.resetFields();
  }}
>
  <Form form={form} />
</Panel>
```

## Related Components

- [Modal](./Modal.md) - For centered overlays
- [Dialog](./Dialog.md) - For confirmation dialogs
- [Drawer](./Drawer.md) - Alias for Panel
- [Button](./Button.md) - For panel actions
- [Form](./Form.md) - For panel forms

