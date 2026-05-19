# RadioButton

RadioButton component for single selection from a set of options.

## Import

```typescript
import { RadioButton, RadioGroup } from '@eightfold.ai/octuple';
```

## API Reference

### RadioButton Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| allowDisabledFocus | Allows focus on the RadioButton when it's disabled | `boolean` | `false` | |
| ariaLabel | The input aria label text | `string` | | |
| checked | The input icon button checked value | `boolean` | `false` | |
| classNames | The RadioButton class names | `string` | | |
| configContextProps | Configure how contextual props are consumed | `<interface>ConfigContextProps` | `{ noDisabledContext: false, noSizeContext: false }` | |
| disabled | The boolean for disabling the RadioButton | `boolean` | `false` | |
| formItemInput | The RadioButton is a form item | `boolean` | `false` | |
| label | Label of the RadioButton | `React.ReactNode` | | |
| labelAlign | The vertical placement of the label | `<enum>LabelAlign` | `LabelAlign.Center` | >= 2.10.1 |
| labelPosition | The label position of the RadioButton | `<enum>LabelPosition` | `LabelPosition.End` | |
| name | The name of the RadioButton group | `string` | | |
| onChange | The RadioButton onChange event handler | `React.ChangeEventHandler<HTMLInputElement>` | | |
| selectorWidth | The RadioButton width type. Use when variant is `SelectorVariant.Pill` | `SelectorWidth` | `SelectorWidth.fitContent` | >= 2.44.0 |
| size | The RadioButton size | `SelectorSize` \| `<enum>Size` | `SelectorSize.Medium` | |
| value | The value of the input | `<string \| number>RadioButtonValue` | | |
| variant | Determines the RadioButton variant | `<enum>SelectorVariant` | `SelectorVariant.Default` | >= 2.44.0 |
| data-testid | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLInputElement>` | | |
| ...rest | RadioButton inherits all attributes of HTMLInputElement. **Only use this if absolutely necessary**. With great power comes great responsibility. | `HTMLInputElement` | | |

### RadioGroup Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| allowDisabledFocus | Allows focus on the RadioGroup when it's disabled | `boolean` | `false` | |
| ariaLabel | The input aria label text | `string` | | |
| checked | The input icon button checked value | `boolean` | `false` | |
| classNames | The RadioGroup class names | `string` | | |
| configContextProps | Configure how contextual props are consumed | `<interface>ConfigContextProps` | `{ noDisabledContext: false, noSizeContext: false }` | |
| disabled | The boolean for disabling the RadioGroup | `boolean` | `false` | |
| formItemInput | The RadioGroup is a form item | `boolean` | `false` | |
| items | The array of items for the RadioGroup | `RadioButtonProps[]` | | |
| labelAlign | The vertical placement of the item labels | `<enum>LabelAlign` | `LabelAlign.Center` | |
| labelPosition | The item label position of the RadioGroup | `<enum>LabelPosition` | `LabelPosition.End` | |
| layout | Type of layout for the RadioGroup | `"vertical" \| "horizontal"` | `"vertical"` | |
| onChange | The RadioButton onChange event handler | `React.ChangeEventHandler<HTMLInputElement>` | | |
| selectorWidth | The RadioGroup width type. Use when variant is `SelectorVariant.Pill` | `SelectorWidth` | `SelectorWidth.fitContent` | >= 2.44.0 |
| size | The RadioGroup size | `SelectorSize` \| `<enum>Size` | `SelectorSize.Medium` | |
| value | The value of the input | `<string \| number>RadioButtonValue` | | |
| variant | Determines the RadioGroup variant | `<enum>SelectorVariant` | `SelectorVariant.Default` | >= 2.44.0 |
| data-testid | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLInputElement>` | | |
| ...rest | RadioGroup inherits all attributes of HTMLInputElement. **Only use this if absolutely necessary**. With great power comes great responsibility. | `HTMLInputElement` | | |

## TypeScript Enums

```typescript
enum SelectorVariant {
  Default = 'default',
  Pill = 'pill'
}

enum SelectorWidth {
  fitContent = 'fitContent'
}

enum SelectorSize {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

enum LabelAlign {
  Center = 'center'
}

enum LabelPosition {
  Start = 'start',
  End = 'end'
}
```

## Usage Examples

### Basic RadioButton

```typescript
import { RadioButton } from '@eightfold.ai/octuple';

function MyComponent() {
  const [selected, setSelected] = React.useState('option1');

  return (
    <>
      <RadioButton
        label="Option 1"
        value="option1"
        checked={selected === 'option1'}
        onChange={(e) => setSelected(e.target.value)}
      />
      <RadioButton
        label="Option 2"
        value="option2"
        checked={selected === 'option2'}
        onChange={(e) => setSelected(e.target.value)}
      />
    </>
  );
}
```

### RadioGroup with Items

```typescript
import { RadioGroup } from '@eightfold.ai/octuple';
import type { RadioButtonProps } from '@eightfold.ai/octuple';

function MyForm() {
  const [value, setValue] = React.useState('medium');

  const items: RadioButtonProps[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  return (
    <RadioGroup
      items={items}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      layout="horizontal"
    />
  );
}
```

### Pill Variant RadioGroup

```typescript
import { RadioGroup, SelectorVariant, SelectorSize } from '@eightfold.ai/octuple';

function FilterSelector() {
  const [filter, setFilter] = React.useState('all');

  const filterItems = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <RadioGroup
      items={filterItems}
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      variant={SelectorVariant.Pill}
      size={SelectorSize.Medium}
      layout="horizontal"
    />
  );
}
```

## Accessibility

- Always provide a `label` for each radio button
- Use `ariaLabel` for additional context when needed
- Ensure keyboard navigation works (Tab, Arrow keys, Space)
- Related radio buttons should share the same `name` attribute
- Use `RadioGroup` to automatically manage keyboard navigation and grouping

## Best Practices

1. **Use RadioGroup for Multiple Options**: When you have multiple radio buttons, use `RadioGroup` with the `items` prop instead of individual `RadioButton` components
2. **Provide Clear Labels**: Each option should have a descriptive label
3. **Pre-select Default**: For better UX, pre-select a sensible default option
4. **Disable When Appropriate**: Use `disabled` prop for unavailable options
5. **Vertical Layout for Forms**: Use vertical layout for form inputs, horizontal for filters/toggles

## Common Mistakes

❌ **Don't** use radio buttons for yes/no choices (use Switch or Checkbox instead)

```typescript
// Bad
<RadioGroup items={[{ label: 'Yes' }, { label: 'No' }]} />
```

✅ **Do** use Switch for binary choices

```typescript
// Good
<Switch label="Enable notifications" />
```

❌ **Don't** forget to set the `name` prop for grouped radio buttons

```typescript
// Bad - radio buttons won't be grouped
<RadioButton label="Option 1" value="1" />
<RadioButton label="Option 2" value="2" />
```

✅ **Do** use the same `name` or use `RadioGroup`

```typescript
// Good
<RadioGroup items={[...]} name="myGroup" />
```

## Related Components

- [Checkbox](./Checkbox.md) - For multiple selections
- [Switch](./Switch.md) - For binary on/off states
- [Select](./Select.md) - For dropdown selection from many options

