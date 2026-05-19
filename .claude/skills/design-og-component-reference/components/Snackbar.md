# Snackbar

Snackbar component for brief notification messages that appear temporarily.

## Import

```typescript
import { Snackbar } from '@eightfold.ai/octuple';
```

## API Reference

### Snackbar Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| actionButtonProps | Props for action button | `ButtonProps` | | |
| classNames | Snackbar class names | `string` | | |
| closeButtonAriaLabelText | Close button aria label | `string` | `'Close'` | |
| closeButtonProps | Props for close button | `ButtonProps` | | |
| closable | Whether snackbar can be closed | `boolean` | `true` | |
| closeIcon | Custom close icon | `IconName \| React.ReactNode` | | |
| content | Snackbar content | `React.ReactNode` | | |
| duration | Auto-close duration in milliseconds (0 = no auto-close) | `number` | `4500` | |
| icon | Custom icon | `IconName \| React.ReactNode` | | |
| onClose | Callback when snackbar closes | `() => void` | | |
| placement | Snackbar placement | `<enum>SnackbarPlacement` | `SnackbarPlacement.bottomCenter` | |
| style | Custom styles | `React.CSSProperties` | | |
| type | Snackbar type | `<enum>SnackbarType` | `SnackbarType.neutral` | |
| visible | Whether snackbar is visible | `boolean` | `false` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum SnackbarType {
  disruptive = 'disruptive',
  warning = 'warning',
  success = 'success',
  neutral = 'neutral'
}

enum SnackbarPlacement {
  top = 'top',
  topCenter = 'top-center',
  topLeft = 'top-left',
  topRight = 'top-right',
  bottom = 'bottom',
  bottomCenter = 'bottom-center',
  bottomLeft = 'bottom-left',
  bottomRight = 'bottom-right'
}
```

## Usage Examples

### Basic Snackbar

```typescript
import { Snackbar, Button } from '@eightfold.ai/octuple';

function BasicSnackbar() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Show Snackbar" onClick={() => setVisible(true)} />
      
      <Snackbar
        visible={visible}
        content="This is a notification message"
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

### Snackbar Types

```typescript
import { Snackbar, Button, SnackbarType } from '@eightfold.ai/octuple';

function SnackbarTypes() {
  const [type, setType] = React.useState<SnackbarType | null>(null);

  return (
    <>
      <Button text="Success" onClick={() => setType(SnackbarType.success)} />
      <Button text="Warning" onClick={() => setType(SnackbarType.warning)} />
      <Button text="Error" onClick={() => setType(SnackbarType.disruptive)} />
      <Button text="Info" onClick={() => setType(SnackbarType.neutral)} />
      
      <Snackbar
        visible={type !== null}
        type={type || SnackbarType.neutral}
        content={`This is a ${type} message`}
        onClose={() => setType(null)}
      />
    </>
  );
}
```

### Snackbar with Action

```typescript
import { Snackbar, Button } from '@eightfold.ai/octuple';

function ActionSnackbar() {
  const [visible, setVisible] = React.useState(false);

  const handleUndo = () => {
    console.log('Undo action');
    setVisible(false);
  };

  return (
    <>
      <Button text="Delete Item" onClick={() => setVisible(true)} />
      
      <Snackbar
        visible={visible}
        content="Item deleted"
        actionButtonProps={{
          text: 'Undo',
          onClick: handleUndo
        }}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

### Snackbar Placements

```typescript
import { Snackbar, Button, SnackbarPlacement } from '@eightfold.ai/octuple';

function PlacementSnackbars() {
  const [placement, setPlacement] = React.useState<SnackbarPlacement | null>(null);

  return (
    <>
      <Button text="Top" onClick={() => setPlacement(SnackbarPlacement.topCenter)} />
      <Button text="Bottom" onClick={() => setPlacement(SnackbarPlacement.bottomCenter)} />
      
      <Snackbar
        visible={placement !== null}
        placement={placement || SnackbarPlacement.bottomCenter}
        content="Notification message"
        onClose={() => setPlacement(null)}
      />
    </>
  );
}
```

### Auto-Close Snackbar

```typescript
import { Snackbar, Button } from '@eightfold.ai/octuple';

function AutoCloseSnackbar() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Show Message" onClick={() => setVisible(true)} />
      
      <Snackbar
        visible={visible}
        content="This message will disappear in 3 seconds"
        duration={3000}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

### Persistent Snackbar

```typescript
import { Snackbar, Button } from '@eightfold.ai/octuple';

function PersistentSnackbar() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button text="Show Persistent Message" onClick={() => setVisible(true)} />
      
      <Snackbar
        visible={visible}
        content="This message won't auto-close"
        duration={0}
        onClose={() => setVisible(false)}
      />
    </>
  );
}
```

### Success Notification

```typescript
import { Snackbar, SnackbarType } from '@eightfold.ai/octuple';

function SuccessNotification() {
  const showSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  // Call this after successful operation
  // showSuccess('Changes saved successfully');

  return (
    <Snackbar
      visible={snackbarVisible}
      type={SnackbarType.success}
      content={snackbarMessage}
      onClose={() => setSnackbarVisible(false)}
    />
  );
}
```

### Snackbar Queue

```typescript
import { Snackbar } from '@eightfold.ai/octuple';

function SnackbarQueue() {
  const [queue, setQueue] = React.useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState('');

  const addNotification = (message: string) => {
    setQueue(prev => [...prev, message]);
  };

  React.useEffect(() => {
    if (queue.length > 0 && !currentMessage) {
      setCurrentMessage(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [queue, currentMessage]);

  return (
    <Snackbar
      visible={!!currentMessage}
      content={currentMessage}
      onClose={() => setCurrentMessage('')}
    />
  );
}
```

## Accessibility

- Provide clear, concise messages
- Use appropriate type for message severity
- Ensure sufficient color contrast
- Announce notifications to screen readers
- Make action buttons keyboard accessible

## Best Practices

1. **Brief Messages**: Keep snackbar text short and clear
2. **Appropriate Duration**: 3-5 seconds for auto-close
3. **Single Message**: Show one snackbar at a time
4. **Action Placement**: Limit to one action button
5. **Don't Overuse**: Use sparingly for important notifications
6. **Dismissible**: Allow users to close manually

## Common Mistakes

❌ **Don't** show multiple snackbars simultaneously

```typescript
// Bad - confusing UI
<Snackbar visible={true} content="Message 1" />
<Snackbar visible={true} content="Message 2" />
<Snackbar visible={true} content="Message 3" />
```

✅ **Do** queue messages

```typescript
// Good - show one at a time
const [queue, setQueue] = React.useState([]);
// Show only first message, queue the rest
```

❌ **Don't** use long messages

```typescript
// Bad - too long
<Snackbar
  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
/>
```

✅ **Do** keep messages concise

```typescript
// Good
<Snackbar content="Changes saved" />
```

❌ **Don't** use for critical errors

```typescript
// Bad - user might miss it
<Snackbar
  type="disruptive"
  content="Payment failed"
/>
```

✅ **Do** use Modal/Dialog for critical messages

```typescript
// Good
<Modal
  visible={paymentFailed}
  header="Payment Failed"
  body="Your payment could not be processed. Please try again."
/>
```

## Related Components

- [MessageBar](./MessageBar.md) - For persistent inline messages
- [InfoBar](./InfoBar.md) - For informational banners
- [Modal](./Modal.md) - For critical notifications
- [Button](./Button.md) - For snackbar actions

