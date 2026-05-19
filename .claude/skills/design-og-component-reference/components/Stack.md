# Stack

Stack component for layout spacing and alignment of child components.

## Import

```typescript
import { Stack } from '@eightfold.ai/octuple';
```

## API Reference

### Stack Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| align | Align items along the cross axis | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | | |
| classNames | Stack class names | `string` | | |
| direction | Direction of stack | `'vertical' \| 'horizontal'` | `'vertical'` | |
| flexGrow | Whether children should grow to fill space | `boolean` | `false` | |
| fullWidth | Whether stack takes full width | `boolean` | `false` | |
| gap | Spacing between items | `'xxxs' \| 'xxs' \| 'xs' \| 's' \| 'm' \| 'l' \| 'xl' \| 'xxl' \| 'xxxl'` | `'m'` | |
| justify | Justify content along main axis | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | | |
| style | Custom styles | `React.CSSProperties` | | |
| wrap | Whether items should wrap | `boolean` | `false` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## Usage Examples

### Basic Vertical Stack

```typescript
import { Stack, Button } from '@eightfold.ai/octuple';

function VerticalStack() {
  return (
    <Stack direction="vertical" gap="m">
      <Button text="Button 1" />
      <Button text="Button 2" />
      <Button text="Button 3" />
    </Stack>
  );
}
```

### Horizontal Stack

```typescript
import { Stack, Button } from '@eightfold.ai/octuple';

function HorizontalStack() {
  return (
    <Stack direction="horizontal" gap="s">
      <Button text="Save" />
      <Button text="Cancel" />
      <Button text="Delete" />
    </Stack>
  );
}
```

### Stack with Different Gaps

```typescript
import { Stack, Card } from '@eightfold.ai/octuple';

function GappedStacks() {
  return (
    <>
      <Stack gap="xs">
        <Card>Small gap</Card>
        <Card>Small gap</Card>
      </Stack>
      
      <Stack gap="l">
        <Card>Large gap</Card>
        <Card>Large gap</Card>
      </Stack>
    </>
  );
}
```

### Centered Stack

```typescript
import { Stack, Card } from '@eightfold.ai/octuple';

function CenteredStack() {
  return (
    <Stack
      direction="horizontal"
      align="center"
      justify="center"
      gap="m"
      style={{ minHeight: '200px' }}
    >
      <Card>Centered</Card>
      <Card>Content</Card>
    </Stack>
  );
}
```

### Space Between Layout

```typescript
import { Stack, Button } from '@eightfold.ai/octuple';

function SpaceBetweenStack() {
  return (
    <Stack
      direction="horizontal"
      justify="space-between"
      fullWidth
    >
      <Button text="Left" />
      <Button text="Right" />
    </Stack>
  );
}
```

### Wrapped Stack

```typescript
import { Stack, Pill } from '@eightfold.ai/octuple';

function WrappedStack() {
  const tags = ['React', 'TypeScript', 'Vite', 'Node.js', 'Octuple', 'Design System'];

  return (
    <Stack
      direction="horizontal"
      wrap
      gap="s"
    >
      {tags.map((tag) => (
        <Pill key={tag} label={tag} />
      ))}
    </Stack>
  );
}
```

### Form Layout with Stack

```typescript
import { Stack, Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';

function FormLayout() {
  return (
    <Stack gap="l">
      <Form.Item label="Name">
        <TextInput placeholder="Enter name" />
      </Form.Item>
      
      <Form.Item label="Email">
        <TextInput placeholder="Enter email" />
      </Form.Item>
      
      <Stack direction="horizontal" justify="end" gap="s">
        <Button text="Cancel" variant={ButtonVariant.Secondary} />
        <Button text="Save" variant={ButtonVariant.Primary} />
      </Stack>
    </Stack>
  );
}
```

### Card Grid with Stack

```typescript
import { Stack, Card } from '@eightfold.ai/octuple';

function CardGrid() {
  const cards = [
    { id: 1, title: 'Card 1', content: 'Content 1' },
    { id: 2, title: 'Card 2', content: 'Content 2' },
    { id: 3, title: 'Card 3', content: 'Content 3' }
  ];

  return (
    <Stack direction="horizontal" wrap gap="m">
      {cards.map((card) => (
        <Card key={card.id} style={{ width: '200px' }}>
          <h4>{card.title}</h4>
          <p>{card.content}</p>
        </Card>
      ))}
    </Stack>
  );
}
```

### Flex Grow Stack

```typescript
import { Stack, Card } from '@eightfold.ai/octuple';

function FlexGrowStack() {
  return (
    <Stack direction="horizontal" flexGrow fullWidth>
      <Card style={{ flex: 1 }}>Grows</Card>
      <Card style={{ flex: 1 }}>Grows</Card>
      <Card style={{ flex: 1 }}>Grows</Card>
    </Stack>
  );
}
```

## Accessibility

- Stack is a layout component and doesn't add semantic meaning
- Ensure child components are properly accessible
- Use appropriate HTML elements for content structure
- Don't rely solely on visual spacing for meaning

## Best Practices

1. **Consistent Spacing**: Use gap prop for consistent spacing
2. **Direction**: Choose appropriate direction for content flow
3. **Responsive**: Consider wrap for responsive layouts
4. **Semantic HTML**: Stack is for layout, use semantic elements for structure
5. **Full Width**: Use fullWidth for layouts that should stretch

## Common Mistakes

❌ **Don't** use Stack for single items

```typescript
// Bad - unnecessary wrapper
<Stack>
  <Button text="Single button" />
</Stack>
```

✅ **Do** use Stack for multiple items

```typescript
// Good
<Stack gap="s">
  <Button text="Button 1" />
  <Button text="Button 2" />
</Stack>
```

❌ **Don't** nest too many Stacks unnecessarily

```typescript
// Bad - overly nested
<Stack>
  <Stack>
    <Stack>
      <Content />
    </Stack>
  </Stack>
</Stack>
```

✅ **Do** use Stack judiciously

```typescript
// Good
<Stack gap="l">
  <Header />
  <Stack direction="horizontal" gap="s">
    <Content />
    <Sidebar />
  </Stack>
</Stack>
```

## Related Components

- [Row](./Row.md) - For grid-based layouts (if available)
- [Col](./Col.md) - For grid columns (if available)
- [Layout](./Layout.md) - For page-level layouts

