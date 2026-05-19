# Tooltip

Tooltip component for displaying contextual information on hover or focus.

## Import

```typescript
import { Tooltip } from '@eightfold.ai/octuple';
```

## API Reference

### Tooltip Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| classNames | The Tooltip class names | `string` | | |
| closeOnOutsideClick | The Tooltip may be closed by clicking outside of it | `boolean` | `true` | |
| closeOnTooltipClick | The Tooltip may be closed by clicking inside of it | `boolean` | `false` | |
| content | The Tooltip content | `React.ReactNode` | | |
| disabled | The Tooltip disabled state | `boolean` | `false` | |
| offset | Pixels to offset the Tooltip from the trigger | `number` | `8` | |
| onVisibleChange | Callback executed when visibility of the Tooltip changes | `(visible: boolean) => void` | | |
| placement | The placement of the Tooltip | `<<>Side \| <>Placement>` | `'top'` | |
| portal | Whether to render Tooltip in a portal | `boolean` | `true` | |
| portalId | The Tooltip portal element id | `string` | `'portal-tooltip'` | |
| positionStrategy | The position strategy of the Tooltip | `'absolute' \| 'fixed'` | `'absolute'` | |
| reference | The Tooltip reference element | `React.RefObject<HTMLElement>` | | |
| size | The Tooltip size | `TooltipSize` | `TooltipSize.medium` | >= 2.35.0 |
| tabIndex | The Tooltip tab index | `number` | | |
| theme | The Tooltip theme | `TooltipTheme` | `TooltipTheme.dark` | |
| touchInteraction | Enable touch device interaction | `boolean` | `false` | >= 2.35.0 |
| trigger | The Tooltip trigger | `'click' \| 'hover' \| 'focus'` | `'hover'` | >= 2.35.0 |
| triggerDelay | Delay in ms before Tooltip shows | `number` | `0` | >= 2.35.0 |
| visible | Whether the Tooltip is visible | `boolean` | | |
| width | The Tooltip width | `number \| string` | | |
| zIndex | The Tooltip z-index | `number` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum TooltipSize {
  large = 'large',
  medium = 'medium',
  small = 'small'
}

enum TooltipTheme {
  dark = 'dark',
  light = 'light'
}

type Side = 'top' | 'right' | 'bottom' | 'left';

type Placement =
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';
```

## Usage Examples

### Basic Tooltip

```typescript
import { Tooltip, Button } from '@eightfold.ai/octuple';

function BasicTooltip() {
  return (
    <Tooltip content="This is a helpful tooltip">
      <Button text="Hover me" />
    </Tooltip>
  );
}
```

### Tooltip Placements

```typescript
import { Tooltip, Button } from '@eightfold.ai/octuple';

function PlacementTooltips() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Tooltip content="Top tooltip" placement="top">
        <Button text="Top" />
      </Tooltip>
      
      <Tooltip content="Right tooltip" placement="right">
        <Button text="Right" />
      </Tooltip>
      
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button text="Bottom" />
      </Tooltip>
      
      <Tooltip content="Left tooltip" placement="left">
        <Button text="Left" />
      </Tooltip>
    </div>
  );
}
```

### Light Theme Tooltip

```typescript
import { Tooltip, Button, TooltipTheme } from '@eightfold.ai/octuple';

function LightTooltip() {
  return (
    <Tooltip
      content="Light themed tooltip"
      theme={TooltipTheme.light}
    >
      <Button text="Hover me" />
    </Tooltip>
  );
}
```

### Tooltip Sizes

```typescript
import { Tooltip, Button, TooltipSize } from '@eightfold.ai/octuple';

function SizedTooltips() {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Tooltip content="Small tooltip" size={TooltipSize.small}>
        <Button text="Small" />
      </Tooltip>
      
      <Tooltip content="Medium tooltip" size={TooltipSize.medium}>
        <Button text="Medium" />
      </Tooltip>
      
      <Tooltip content="Large tooltip" size={TooltipSize.large}>
        <Button text="Large" />
      </Tooltip>
    </div>
  );
}
```

### Click Trigger Tooltip

```typescript
import { Tooltip, Button } from '@eightfold.ai/octuple';

function ClickTooltip() {
  return (
    <Tooltip
      content="Click the button to see this tooltip"
      trigger="click"
      closeOnOutsideClick={true}
    >
      <Button text="Click me" />
    </Tooltip>
  );
}
```

### Controlled Tooltip

```typescript
import { Tooltip, Button, ButtonVariant } from '@eightfold.ai/octuple';

function ControlledTooltip() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Tooltip
        content="This is a controlled tooltip"
        visible={visible}
        onVisibleChange={setVisible}
      >
        <span>Hover over me</span>
      </Tooltip>
      
      <div style={{ marginTop: '16px' }}>
        <Button
          text={visible ? 'Hide Tooltip' : 'Show Tooltip'}
          onClick={() => setVisible(!visible)}
          variant={ButtonVariant.Primary}
        />
      </div>
    </>
  );
}
```

### Touch Interaction Tooltip

```typescript
import { Tooltip, Button } from '@eightfold.ai/octuple';

function TouchTooltip() {
  return (
    <Tooltip
      content="Works on touch devices too"
      touchInteraction={true}
      trigger="click"
    >
      <Button text="Touch me (mobile)" />
    </Tooltip>
  );
}
```

### Tooltip with Delay

```typescript
import { Tooltip, Button } from '@eightfold.ai/octuple';

function DelayedTooltip() {
  return (
    <Tooltip
      content="This tooltip appears after 500ms"
      triggerDelay={500}
    >
      <Button text="Hover me (with delay)" />
    </Tooltip>
  );
}
```

### Rich Content Tooltip

```typescript
import { Tooltip, Button } from '@eightfold.ai/octuple';
import Icon from '@mdi/react';
import { mdiInformation } from '@mdi/js';

function RichTooltip() {
  const tooltipContent = (
    <div>
      <h4 style={{ margin: '0 0 8px 0' }}>Rich Tooltip</h4>
      <p style={{ margin: 0 }}>
        Tooltips can contain any React content including:
      </p>
      <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
        <li>Lists</li>
        <li>Icons</li>
        <li>Formatted text</li>
      </ul>
    </div>
  );

  return (
    <Tooltip content={tooltipContent} width={250}>
      <Button
        iconProps={{ path: mdiInformation }}
        ariaLabel="More information"
      />
    </Tooltip>
  );
}
```

## Accessibility

- Provide descriptive tooltip content
- Use appropriate trigger (hover for info, click for actions)
- Ensure keyboard accessibility (tooltips should show on focus)
- Don't hide critical information in tooltips
- Keep tooltip text concise and readable
- Consider `aria-describedby` for screen readers

## Best Practices

1. **Concise Content**: Keep tooltip text short and helpful
2. **Appropriate Trigger**: Use hover for hints, click for complex content
3. **Strategic Placement**: Choose placement that doesn't obscure important content
4. **Don't Overuse**: Use sparingly for truly helpful information
5. **Keyboard Access**: Ensure tooltips work with keyboard navigation
6. **Mobile Support**: Enable `touchInteraction` for touch devices

## Common Mistakes

❌ **Don't** put critical information only in tooltips

```typescript
// Bad - users may miss important info
<Tooltip content="This field is required and must be a valid email">
  <TextInput placeholder="Email" />
</Tooltip>
```

✅ **Do** show critical info visibly

```typescript
// Good
<Form.Item label="Email" rules={[{ required: true, type: 'email' }]}>
  <TextInput
    placeholder="Email"
    status="error"
    statusIconProps={{ path: mdiAlert }}
  />
</Form.Item>
```

❌ **Don't** use very long text in tooltips

```typescript
// Bad - tooltip too long
<Tooltip content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.">
  <Button text="Info" />
</Tooltip>
```

✅ **Do** keep tooltips concise

```typescript
// Good
<Tooltip content="Click for more details">
  <Button text="Info" onClick={showModal} />
</Tooltip>
```

❌ **Don't** forget mobile users

```typescript
// Bad - won't work on touch devices
<Tooltip content="Hover info">
  <Button text="Info" />
</Tooltip>
```

✅ **Do** enable touch interaction

```typescript
// Good
<Tooltip content="Tap for info" touchInteraction={true} trigger="click">
  <Button text="Info" />
</Tooltip>
```

## Related Components

- [Popover](./Popover.md) - For more complex interactive content (if available)
- [InfoBar](./InfoBar.md) - For persistent information displays
- [Button](./Button.md) - Common tooltip trigger

