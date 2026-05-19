# MessageBar

MessageBar component for displaying important inline messages to users.

## Import

```typescript
import { MessageBar } from '@eightfold.ai/octuple';
```

## API Reference

### MessageBar Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| actionButtonProps | Props for the action button | `ButtonProps` | | |
| classNames | The MessageBar class names | `string` | | |
| closeButtonAriaLabelText | The close button aria label | `string` | `'Close'` | |
| closeButtonProps | Props for the close button | `ButtonProps` | | |
| closable | Whether the MessageBar can be closed | `boolean` | `true` | |
| content | The MessageBar content | `React.ReactNode` | | |
| icon | Custom icon for the MessageBar | `IconName \| React.ReactNode` | | |
| inline | Whether the MessageBar is inline | `boolean` | `false` | |
| onClose | Callback when MessageBar is closed | `() => void` | | |
| role | The MessageBar ARIA role | `string` | `'alert'` | |
| style | The MessageBar custom styles | `React.CSSProperties` | | |
| title | The MessageBar title | `string` | | |
| type | The MessageBar type | `<enum>MessageBarType` | `MessageBarType.neutral` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum MessageBarType {
  disruptive = 'disruptive',
  warning = 'warning',
  success = 'success',
  neutral = 'neutral'
}
```

## Usage Examples

### Basic MessageBar

```typescript
import { MessageBar } from '@eightfold.ai/octuple';

function BasicMessageBar() {
  return (
    <MessageBar
      content="This is an informational message"
    />
  );
}
```

### MessageBar Types

```typescript
import { MessageBar, MessageBarType } from '@eightfold.ai/octuple';

function MessageBarTypes() {
  return (
    <>
      <MessageBar
        type={MessageBarType.neutral}
        content="This is a neutral message"
      />
      
      <MessageBar
        type={MessageBarType.success}
        content="Operation completed successfully"
      />
      
      <MessageBar
        type={MessageBarType.warning}
        content="Please review your input"
      />
      
      <MessageBar
        type={MessageBarType.disruptive}
        content="An error occurred"
      />
    </>
  );
}
```

### MessageBar with Title

```typescript
import { MessageBar, MessageBarType } from '@eightfold.ai/octuple';

function TitledMessageBar() {
  return (
    <MessageBar
      type={MessageBarType.success}
      title="Success"
      content="Your changes have been saved successfully"
    />
  );
}
```

### MessageBar with Action

```typescript
import { MessageBar, MessageBarType } from '@eightfold.ai/octuple';

function ActionMessageBar() {
  const handleAction = () => {
    console.log('Action clicked');
  };

  return (
    <MessageBar
      type={MessageBarType.warning}
      title="Update Available"
      content="A new version of the app is available"
      actionButtonProps={{
        text: 'Update Now',
        onClick: handleAction
      }}
    />
  );
}
```

### Closable MessageBar

```typescript
import { MessageBar } from '@eightfold.ai/octuple';

function ClosableMessageBar() {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <MessageBar
      content="This message can be dismissed"
      closable
      onClose={() => setVisible(false)}
    />
  );
}
```

### MessageBar with Custom Icon

```typescript
import { MessageBar, MessageBarType } from '@eightfold.ai/octuple';
import { mdiInformation } from '@mdi/js';

function CustomIconMessageBar() {
  return (
    <MessageBar
      type={MessageBarType.neutral}
      icon={mdiInformation}
      title="Did you know?"
      content="You can customize the icon for any message bar"
    />
  );
}
```

### Inline MessageBar

```typescript
import { MessageBar, MessageBarType, Form, TextInput } from '@eightfold.ai/octuple';

function InlineMessageBar() {
  return (
    <Form layout="vertical">
      <Form.Item label="Email">
        <TextInput placeholder="Enter email" />
        <MessageBar
          inline
          type={MessageBarType.disruptive}
          content="Please enter a valid email address"
        />
      </Form.Item>
    </Form>
  );
}
```

### MessageBar in Page Header

```typescript
import { MessageBar, MessageBarType, Button } from '@eightfold.ai/octuple';

function PageHeaderMessage() {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <MessageBar
        type={MessageBarType.warning}
        title="Maintenance Scheduled"
        content="System maintenance is scheduled for tonight at 11 PM EST. Some features may be unavailable."
        actionButtonProps={{
          text: 'Learn More',
          onClick: () => console.log('Learn more')
        }}
        onClose={() => setDismissed(true)}
      />
    </div>
  );
}
```

### Stack of MessageBars

```typescript
import { MessageBar, MessageBarType } from '@eightfold.ai/octuple';

function MessageStack() {
  const [messages, setMessages] = React.useState([
    { id: 1, type: MessageBarType.success, content: 'Profile updated' },
    { id: 2, type: MessageBarType.warning, content: 'Password expires in 3 days' }
  ]);

  const removeMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {messages.map((message) => (
        <MessageBar
          key={message.id}
          type={message.type}
          content={message.content}
          onClose={() => removeMessage(message.id)}
        />
      ))}
    </div>
  );
}
```

## Accessibility

- Use appropriate ARIA role (default is 'alert')
- Provide clear, concise messages
- Ensure sufficient color contrast
- Make action buttons keyboard accessible
- Announce important messages to screen readers

## Best Practices

1. **Be Concise**: Keep messages short and actionable
2. **Appropriate Type**: Use correct type for message severity
3. **Actionable**: Provide clear actions when needed
4. **Dismissible**: Allow users to close non-critical messages
5. **Positioning**: Place at top of relevant content section
6. **Avoid Overuse**: Don't show too many MessageBars at once

## Common Mistakes

❌ **Don't** use disruptive type for non-errors

```typescript
// Bad - not actually an error
<MessageBar
  type={MessageBarType.disruptive}
  content="Welcome to our app"
/>
```

✅ **Do** use appropriate types

```typescript
// Good
<MessageBar
  type={MessageBarType.neutral}
  content="Welcome to our app"
/>
```

❌ **Don't** show too many MessageBars

```typescript
// Bad - overwhelming
<>
  <MessageBar content="Message 1" />
  <MessageBar content="Message 2" />
  <MessageBar content="Message 3" />
  <MessageBar content="Message 4" />
  <MessageBar content="Message 5" />
</>
```

✅ **Do** prioritize and limit messages

```typescript
// Good
<MessageBar
  content="2 warnings, 1 error. Click to view details."
  actionButtonProps={{ text: 'View', onClick: showDetails }}
/>
```

❌ **Don't** make critical messages closable

```typescript
// Bad - user might dismiss critical error
<MessageBar
  type={MessageBarType.disruptive}
  content="Payment failed"
  closable
/>
```

✅ **Do** make critical messages persistent

```typescript
// Good
<MessageBar
  type={MessageBarType.disruptive}
  content="Payment failed. Please update your payment method."
  closable={false}
  actionButtonProps={{ text: 'Update Payment', onClick: updatePayment }}
/>
```

## Related Components

- [Snackbar](./Snackbar.md) - For temporary toast notifications
- [InfoBar](./InfoBar.md) - For persistent information displays
- [Modal](./Modal.md) - For blocking important messages
- [Button](./Button.md) - For message bar actions

