# InfoBar

InfoBar component for displaying persistent informational messages.

## Import

```typescript
import { InfoBar } from '@eightfold.ai/octuple';
```

## API Reference

### InfoBar Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| actionButtonProps | Props for action button | `ButtonProps` | | |
| bordered | Whether InfoBar has border | `boolean` | `false` | |
| classNames | InfoBar class names | `string` | | |
| closeButtonAriaLabelText | Close button aria label | `string` | `'Close'` | |
| closeButtonProps | Props for close button | `ButtonProps` | | |
| closable | Whether InfoBar can be closed | `boolean` | `true` | |
| closeIcon | Custom close icon | `IconName \| React.ReactNode` | | |
| content | InfoBar content | `React.ReactNode` | | |
| icon | Custom icon | `IconName \| React.ReactNode` | | |
| inline | Whether InfoBar is inline | `boolean` | `false` | |
| onClose | Callback when InfoBar closes | `() => void` | | |
| role | InfoBar ARIA role | `string` | `'status'` | |
| style | Custom styles | `React.CSSProperties` | | |
| title | InfoBar title | `string` | | |
| type | InfoBar type | `<enum>InfoBarType` | `InfoBarType.neutral` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum InfoBarType {
  disruptive = 'disruptive',
  warning = 'warning',
  success = 'success',
  neutral = 'neutral'
}
```

## Usage Examples

### Basic InfoBar

```typescript
import { InfoBar } from '@eightfold.ai/octuple';

function BasicInfoBar() {
  return (
    <InfoBar
      content="This is an informational message"
    />
  );
}
```

### InfoBar Types

```typescript
import { InfoBar, InfoBarType } from '@eightfold.ai/octuple';

function InfoBarTypes() {
  return (
    <>
      <InfoBar
        type={InfoBarType.neutral}
        content="This is a neutral message"
      />
      
      <InfoBar
        type={InfoBarType.success}
        title="Success"
        content="Operation completed successfully"
      />
      
      <InfoBar
        type={InfoBarType.warning}
        title="Warning"
        content="Please review your settings"
      />
      
      <InfoBar
        type={InfoBarType.disruptive}
        title="Error"
        content="An error occurred"
      />
    </>
  );
}
```

### InfoBar with Action

```typescript
import { InfoBar, InfoBarType } from '@eightfold.ai/octuple';

function ActionInfoBar() {
  const handleUpdate = () => {
    console.log('Update clicked');
  };

  return (
    <InfoBar
      type={InfoBarType.warning}
      title="Update Available"
      content="A new version is available"
      actionButtonProps={{
        text: 'Update Now',
        onClick: handleUpdate
      }}
    />
  );
}
```

### Closable InfoBar

```typescript
import { InfoBar } from '@eightfold.ai/octuple';

function ClosableInfoBar() {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <InfoBar
      content="This message can be dismissed"
      closable
      onClose={() => setVisible(false)}
    />
  );
}
```

### Bordered InfoBar

```typescript
import { InfoBar, InfoBarType } from '@eightfold.ai/octuple';

function BorderedInfoBar() {
  return (
    <InfoBar
      type={InfoBarType.success}
      content="Changes saved successfully"
      bordered
    />
  );
}
```

### Inline InfoBar

```typescript
import { InfoBar, InfoBarType, Form, TextInput } from '@eightfold.ai/octuple';

function InlineInfoBar() {
  return (
    <Form layout="vertical">
      <Form.Item label="Email">
        <TextInput placeholder="Enter email" />
        <InfoBar
          inline
          type={InfoBarType.neutral}
          content="We'll never share your email"
        />
      </Form.Item>
    </Form>
  );
}
```

### Banner InfoBar

```typescript
import { InfoBar, InfoBarType } from '@eightfold.ai/octuple';

function BannerInfoBar() {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <InfoBar
        type={InfoBarType.warning}
        title="Scheduled Maintenance"
        content="The system will be under maintenance on Sunday, 2AM-4AM EST"
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

### Custom Icon InfoBar

```typescript
import { InfoBar } from '@eightfold.ai/octuple';
import { mdiLightbulb } from '@mdi/js';

function CustomIconInfoBar() {
  return (
    <InfoBar
      icon={mdiLightbulb}
      title="Pro Tip"
      content="You can use keyboard shortcuts to navigate faster"
    />
  );
}
```

### Multiple InfoBars

```typescript
import { InfoBar, InfoBarType } from '@eightfold.ai/octuple';

function MultipleInfoBars() {
  const [infoBars, setInfoBars] = React.useState([
    { id: 1, type: InfoBarType.warning, content: 'Password expires in 7 days' },
    { id: 2, type: InfoBarType.neutral, content: 'New features available' }
  ]);

  const dismissInfoBar = (id: number) => {
    setInfoBars(infoBars.filter(bar => bar.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {infoBars.map((bar) => (
        <InfoBar
          key={bar.id}
          type={bar.type}
          content={bar.content}
          onClose={() => dismissInfoBar(bar.id)}
        />
      ))}
    </div>
  );
}
```

## Accessibility

- Use appropriate ARIA role (default is 'status')
- Provide clear, descriptive messages
- Ensure sufficient color contrast
- Make action buttons keyboard accessible
- Consider screen reader announcements

## Best Practices

1. **Persistent Messages**: Use for information that should remain visible
2. **Clear Communication**: Write concise, actionable messages
3. **Appropriate Type**: Match type to message severity
4. **Dismissible**: Allow users to close non-critical messages
5. **Strategic Placement**: Place near relevant content
6. **Avoid Overuse**: Don't clutter UI with too many InfoBars

## Common Mistakes

❌ **Don't** use for temporary notifications

```typescript
// Bad - use Snackbar instead
<InfoBar content="File uploaded" onClose={...} />
```

✅ **Do** use for persistent information

```typescript
// Good
<InfoBar
  type="warning"
  content="Your trial ends in 5 days"
  actionButtonProps={{ text: 'Upgrade', onClick: upgrade }}
/>
```

❌ **Don't** hide critical information only in InfoBar

```typescript
// Bad - easy to dismiss critical info
<InfoBar
  closable
  type="disruptive"
  content="Your account will be deleted tomorrow"
/>
```

✅ **Do** make critical messages prominent

```typescript
// Good
<InfoBar
  closable={false}
  type="disruptive"
  content="Action required: Update payment method"
  actionButtonProps={{ text: 'Update', onClick: updatePayment }}
/>
```

❌ **Don't** stack too many InfoBars

```typescript
// Bad - overwhelming
<>
  <InfoBar content="Message 1" />
  <InfoBar content="Message 2" />
  <InfoBar content="Message 3" />
  <InfoBar content="Message 4" />
</>
```

✅ **Do** prioritize and limit InfoBars

```typescript
// Good
<InfoBar
  content="3 important notifications"
  actionButtonProps={{ text: 'View All', onClick: showAll }}
/>
```

## Related Components

- [MessageBar](./MessageBar.md) - For inline contextual messages
- [Snackbar](./Snackbar.md) - For temporary toast notifications
- [Modal](./Modal.md) - For critical blocking messages
- [Button](./Button.md) - For InfoBar actions

