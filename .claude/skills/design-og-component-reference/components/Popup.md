# Popup

Popup component for enhanced tooltip functionality with more control options (derived from Tooltip).

## Import

```typescript
import { Popup } from '@eightfold.ai/octuple';
```

## API Reference

### Popup Props

Popup extends Tooltip with additional control options.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| closeOnPopupClick | Should close Popup on body click | `boolean` | `false` | >= 2.30.0 |
| popupOnKeydown | Callback executed on Popup element keydown | `(event: React.KeyboardEvent) => void` | | >= 2.34.0 |
| popupStyle | The Popup style | `React.CSSProperties` | | >= 2.30.0 |
| showPopup | Callback to control the show/hide behavior of the Popup. Triggered before the visible change | `(show: boolean) => boolean` | | >= 2.30.0 |
| size | Size of the Popup | `PopupSize` | `PopupSize.Medium` | >= 2.30.0 |
| theme | Theme of the Popup | `PopupTheme` | `PopupTheme.light` | >= 2.35.0 |
| touchInteraction | Determines the interaction that triggers the equivalent of hover on touch interfaces | `PopupTouchInteraction` | `PopupTouchInteraction.Tap` | >= 2.47.3 |

For complete inherited props, see [Tooltip](./Tooltip.md).

## TypeScript Enums

```typescript
enum PopupSize {
  large = 'large',
  medium = 'medium',
  small = 'small'
}

enum PopupTheme {
  light = 'light',
  dark = 'dark'
}

enum PopupTouchInteraction {
  Tap = 'tap',
  Press = 'press'
}
```

## Usage Examples

### Basic Popup

```typescript
import { Popup, Button } from '@eightfold.ai/octuple';

function BasicPopup() {
  return (
    <Popup content="This is a popup with enhanced control">
      <Button text="Show Popup" />
    </Popup>
  );
}
```

### Controlled Popup

```typescript
import { Popup, Button } from '@eightfold.ai/octuple';

function ControlledPopup() {
  const [visible, setVisible] = React.useState(false);

  const handleShowPopup = (show: boolean) => {
    console.log('Popup visibility changing:', show);
    return show; // Return true to allow, false to prevent
  };

  return (
    <Popup
      content="Controlled popup content"
      showPopup={handleShowPopup}
      visible={visible}
      onVisibleChange={setVisible}
    >
      <Button text="Toggle Popup" />
    </Popup>
  );
}
```

### Popup with Custom Style

```typescript
import { Popup, Button } from '@eightfold.ai/octuple';

function StyledPopup() {
  const popupStyle = {
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#f0f0f0'
  };

  return (
    <Popup
      content={
        <div>
          <h4>Custom Styled Popup</h4>
          <p>This popup has custom styling applied.</p>
        </div>
      }
      popupStyle={popupStyle}
    >
      <Button text="Show Styled Popup" />
    </Popup>
  );
}
```

### Close on Click Inside Popup

```typescript
import { Popup, Button } from '@eightfold.ai/octuple';

function ClickablePopup() {
  const [visible, setVisible] = React.useState(false);

  return (
    <Popup
      content={
        <div>
          <p>Click inside this popup to close it</p>
          <Button text="Close" onClick={() => setVisible(false)} />
        </div>
      }
      visible={visible}
      onVisibleChange={setVisible}
      closeOnPopupClick={true}
    >
      <Button text="Open Popup" />
    </Popup>
  );
}
```

### Popup with Keyboard Handler

```typescript
import { Popup, Button } from '@eightfold.ai/octuple';

function KeyboardPopup() {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      console.log('Escape key pressed in popup');
    }
  };

  return (
    <Popup
      content="Press Escape key while focused"
      popupOnKeydown={handleKeyDown}
    >
      <Button text="Show Popup" />
    </Popup>
  );
}
```

### Touch Interaction Popup

```typescript
import { Popup, Button, PopupTouchInteraction } from '@eightfold.ai/octuple';

function TouchPopup() {
  return (
    <>
      <Popup
        content="Tap to show (mobile)"
        touchInteraction={PopupTouchInteraction.Tap}
      >
        <Button text="Tap Interaction" />
      </Popup>
      
      <Popup
        content="Long press to show (mobile)"
        touchInteraction={PopupTouchInteraction.Press}
      >
        <Button text="Press Interaction" />
      </Popup>
    </>
  );
}
```

### Themed Popup

```typescript
import { Popup, Button, PopupTheme } from '@eightfold.ai/octuple';

function ThemedPopups() {
  return (
    <>
      <Popup
        content="Light themed popup"
        theme={PopupTheme.light}
      >
        <Button text="Light Theme" />
      </Popup>
      
      <Popup
        content="Dark themed popup"
        theme={PopupTheme.dark}
      >
        <Button text="Dark Theme" />
      </Popup>
    </>
  );
}
```

### Rich Content Popup

```typescript
import { Popup, Button, PopupSize } from '@eightfold.ai/octuple';

function RichContentPopup() {
  const popupContent = (
    <div style={{ padding: '16px' }}>
      <h3>User Information</h3>
      <ul>
        <li>Name: John Doe</li>
        <li>Email: john@example.com</li>
        <li>Role: Administrator</li>
      </ul>
      <Button text="View Profile" />
    </div>
  );

  return (
    <Popup
      content={popupContent}
      size={PopupSize.large}
      closeOnPopupClick={false}
    >
      <Button text="Show User Info" />
    </Popup>
  );
}
```

## Accessibility

- Provide descriptive popup content
- Use appropriate trigger (click, hover)
- Ensure keyboard navigation works
- Use `popupOnKeydown` for custom keyboard handling
- Don't hide critical information only in popups
- Consider touch interactions for mobile

## Best Practices

1. **Control Visibility**: Use `showPopup` callback for conditional display
2. **Keyboard Support**: Implement `popupOnKeydown` for enhanced keyboard navigation
3. **Touch Devices**: Configure `touchInteraction` appropriately for mobile
4. **Content Size**: Use appropriate `size` based on content
5. **Theme Consistency**: Match theme with overall app design
6. **Close Behavior**: Set `closeOnPopupClick` based on interaction needs

## Common Mistakes

❌ **Don't** use popup for critical actions without alternative access

```typescript
// Bad - user might miss critical action
<Popup content={<Button text="Delete Account" />}>
  <span>Options</span>
</Popup>
```

✅ **Do** provide clear primary actions

```typescript
// Good
<Button text="Delete Account" onClick={showConfirmDialog} />
<Popup content="Additional options available">
  <Button text="More Options" />
</Popup>
```

❌ **Don't** forget to handle keyboard events

```typescript
// Bad - no keyboard support
<Popup content="Important info" />
```

✅ **Do** add keyboard handling

```typescript
// Good
<Popup
  content="Important info"
  popupOnKeydown={(e) => {
    if (e.key === 'Escape') handleClose();
  }}
/>
```

## Related Components

- [Tooltip](./Tooltip.md) - Base component for Popup
- [Dropdown](./Dropdown.md) - For menu-style overlays
- [Modal](./Modal.md) - For blocking overlays
- [Button](./Button.md) - Common popup trigger

