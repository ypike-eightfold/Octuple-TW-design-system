# Label

Label component for form fields and inputs.

## Import

```typescript
import { Label } from '@eightfold.ai/octuple';
```

## API Reference

### Label Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| classNames | The Label class names | `string` | | |
| colon | Sets whether to display `:` after Label text | `boolean` | `false` | |
| htmlFor | The Label element name | `string` | | |
| inline | The Label element is inline | `boolean` | `false` | |
| labelIconButtonProps | The Label icon button props (see table below) | `<interface>LabelIconButtonProps` | | |
| size | The Label size | `<enum>LabelSize \| <enum>Size` | `LabelSize.Medium` | |
| text | The Label text | `string` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLLabelElement>` | | |
| ...rest | Label inherits all attributes of HTMLDivElement. **Only use this if absolutely necessary**. With great power comes great responsibility. | `HTMLDivElement` | | |

### LabelIconButton Props

Label Icon Button extends [Button](./Button.md) with additional props:

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| show | The label icon button is shown | `boolean` | `false` |
| tooltipContent | Content to show on the tooltip | `React.ReactNode` | |
| tooltipPlacement | Allows focus on the button when it's disabled | `<<"top" \| "right" \| "bottom" \| "left">Side \| <"top-start" \| "top-end" \| "right-start" \| "right-end" \| "bottom-start" \| "bottom-end" \| "left-start" \| "left-end">Placement` | `"top"` |
| tooltipPositionStrategy | The button `aria-label` text | `<"absolute" \| "fixed">Strategy` | `"absolute"` |
| tooltipTheme | The button class names | `<enum>TooltipTheme` | `light` |

## TypeScript Enums

```typescript
enum LabelSize {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

enum Size {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}
```

## Usage Examples

### Basic Label

```typescript
import { Label, TextInput } from '@eightfold.ai/octuple';

function FormField() {
  return (
    <div>
      <Label text="Email Address" htmlFor="email-input" />
      <TextInput id="email-input" placeholder="Enter your email" />
    </div>
  );
}
```

### Label with Colon

```typescript
import { Label, TextInput } from '@eightfold.ai/octuple';

function RegistrationField() {
  return (
    <div>
      <Label text="Full Name" htmlFor="name-input" colon />
      <TextInput id="name-input" />
    </div>
  );
}
```

### Label with Icon Button (Help Tooltip)

```typescript
import { Label, TextInput } from '@eightfold.ai/octuple';
import { mdiInformation } from '@mdi/js';

function HelpfulLabel() {
  return (
    <div>
      <Label
        text="Password"
        htmlFor="password-input"
        labelIconButtonProps={{
          show: true,
          iconProps: { path: mdiInformation },
          tooltipContent: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
          tooltipPlacement: 'right'
        }}
      />
      <TextInput
        id="password-input"
        type="password"
        placeholder="Enter password"
      />
    </div>
  );
}
```

### Inline Label

```typescript
import { Label, CheckBox } from '@eightfold.ai/octuple';

function InlineLabelExample() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Label text="Remember me" inline htmlFor="remember-checkbox" />
      <CheckBox id="remember-checkbox" />
    </div>
  );
}
```

### Label Sizes

```typescript
import { Label, TextInput, LabelSize } from '@eightfold.ai/octuple';

function SizeVariants() {
  return (
    <>
      <div>
        <Label text="Small Label" size={LabelSize.Small} />
        <TextInput />
      </div>
      
      <div>
        <Label text="Medium Label" size={LabelSize.Medium} />
        <TextInput />
      </div>
      
      <div>
        <Label text="Large Label" size={LabelSize.Large} />
        <TextInput />
      </div>
    </>
  );
}
```

## Accessibility

- Always associate labels with form inputs using `htmlFor`
- Provide clear, descriptive label text
- Use `labelIconButtonProps` for additional context without cluttering the label
- Ensure labels are visible and not hidden visually
- Use appropriate size for readability

## Best Practices

1. **Associate with Input**: Always use `htmlFor` to link label with input
2. **Be Descriptive**: Labels should clearly describe what the input expects
3. **Use Colon Sparingly**: Only use `:` when it matches your design system
4. **Add Help Icons**: Use `labelIconButtonProps` for complex fields that need explanation
5. **Match Sizes**: Ensure label size matches the input size
6. **Keep it Short**: Labels should be concise but descriptive

## Common Mistakes

❌ **Don't** forget to link label to input

```typescript
// Bad - label not associated with input
<Label text="Email" />
<TextInput />
```

✅ **Do** use htmlFor

```typescript
// Good
<Label text="Email" htmlFor="email-input" />
<TextInput id="email-input" />
```

❌ **Don't** use label for non-input elements

```typescript
// Bad
<Label text="Section Title" />
```

✅ **Do** use proper heading tags

```typescript
// Good
<h3>Section Title</h3>
```

❌ **Don't** put long instructions in the label

```typescript
// Bad
<Label text="Email (Must be a valid email address from your company domain, no personal emails allowed)" />
```

✅ **Do** use label + tooltip for help text

```typescript
// Good
<Label
  text="Company Email"
  labelIconButtonProps={{
    show: true,
    tooltipContent: 'Must be from your company domain. Personal emails not allowed.'
  }}
/>
```

## Related Components

- [Form](./Form.md) - Form.Item provides labels automatically
- [TextInput](./TextInput.md) - Common input to label
- [CheckBox](./CheckBox.md) - CheckBox has built-in label prop
- [RadioButton](./RadioButton.md) - RadioButton has built-in label prop

