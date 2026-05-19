# FadeIn

FadeIn component for animating content with a fade-in effect.

## Import

```typescript
import { FadeIn } from '@eightfold.ai/octuple';
```

## API Reference

### FadeIn Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| children | The FadeIn child renderer | `ReactNode` | | |
| delay | The FadeIn delay amount in milliseconds | `number` | | |
| duration | The FadeIn animation duration in milliseconds | `number` | `300` | |
| disabled | Whether the FadeIn style is disabled | `boolean` | `false` | |
| ...rest | FadeIn inherits all attributes of HTMLDivElement. Only use this if absolutely necessary. With great power comes great responsibility | `HTMLDivElement` | | |

## Usage Examples

### Basic FadeIn

```typescript
import { FadeIn } from '@eightfold.ai/octuple';

function BasicFadeIn() {
  return (
    <FadeIn>
      <div>This content will fade in</div>
    </FadeIn>
  );
}
```

### FadeIn with Custom Duration

```typescript
import { FadeIn } from '@eightfold.ai/octuple';

function SlowFadeIn() {
  return (
    <FadeIn duration={1000}>
      <div>This content fades in slowly over 1 second</div>
    </FadeIn>
  );
}
```

### FadeIn with Delay

```typescript
import { FadeIn } from '@eightfold.ai/octuple';

function DelayedFadeIn() {
  return (
    <FadeIn delay={500} duration={300}>
      <div>This content fades in after 500ms delay</div>
    </FadeIn>
  );
}
```

### Sequential FadeIn

```typescript
import { FadeIn } from '@eightfold.ai/octuple';

function SequentialFadeIn() {
  return (
    <>
      <FadeIn delay={0} duration={300}>
        <div>First item (no delay)</div>
      </FadeIn>
      
      <FadeIn delay={200} duration={300}>
        <div>Second item (200ms delay)</div>
      </FadeIn>
      
      <FadeIn delay={400} duration={300}>
        <div>Third item (400ms delay)</div>
      </FadeIn>
      
      <FadeIn delay={600} duration={300}>
        <div>Fourth item (600ms delay)</div>
      </FadeIn>
    </>
  );
}
```

### Conditional FadeIn

```typescript
import { FadeIn } from '@eightfold.ai/octuple';

function ConditionalFadeIn() {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'} Content
      </button>
      
      {show && (
        <FadeIn duration={500}>
          <div>This content appears with fade-in effect</div>
        </FadeIn>
      )}
    </div>
  );
}
```

### FadeIn with Card

```typescript
import { FadeIn, Card } from '@eightfold.ai/octuple';

function FadeInCard() {
  return (
    <FadeIn duration={600}>
      <Card>
        <h3>Card Title</h3>
        <p>This card fades in smoothly</p>
      </Card>
    </FadeIn>
  );
}
```

### List with Staggered FadeIn

```typescript
import { FadeIn } from '@eightfold.ai/octuple';

function StaggeredList() {
  const items = [
    'First item',
    'Second item',
    'Third item',
    'Fourth item',
    'Fifth item'
  ];

  return (
    <div>
      {items.map((item, index) => (
        <FadeIn key={index} delay={index * 100} duration={300}>
          <div style={{ padding: '12px', marginBottom: '8px', background: '#f0f0f0' }}>
            {item}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
```

### FadeIn with Loading State

```typescript
import { FadeIn, Skeleton } from '@eightfold.ai/octuple';

function LoadingFadeIn() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    setTimeout(() => {
      setData({ title: 'Loaded Content', description: 'This is the loaded data' });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <Skeleton width={300} height={100} />;
  }

  return (
    <FadeIn duration={500}>
      <div>
        <h3>{data?.title}</h3>
        <p>{data?.description}</p>
      </div>
    </FadeIn>
  );
}
```

### Disabled FadeIn

```typescript
import { FadeIn } from '@eightfold.ai/octuple';

function DisabledFadeIn() {
  const [animate, setAnimate] = React.useState(true);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={animate}
          onChange={(e) => setAnimate(e.target.checked)}
        />
        Enable Animation
      </label>
      
      <FadeIn disabled={!animate} duration={500}>
        <div>This content will fade in only if animation is enabled</div>
      </FadeIn>
    </div>
  );
}
```

### FadeIn Modal Content

```typescript
import { FadeIn, Modal } from '@eightfold.ai/octuple';

function FadeInModal() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <button onClick={() => setVisible(true)}>Open Modal</button>
      
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="Modal Title"
      >
        <FadeIn duration={400}>
          <div>
            <p>Modal content with fade-in effect</p>
            <p>This creates a smooth appearance</p>
          </div>
        </FadeIn>
      </Modal>
    </>
  );
}
```

## Accessibility

- FadeIn is purely visual and doesn't affect accessibility
- Content inside FadeIn is still accessible to screen readers
- Animation duration should not be too long (< 1000ms recommended)
- Respect user's prefers-reduced-motion setting
- Don't rely solely on animation to convey information

## Best Practices

1. **Appropriate Duration**: Use 300-500ms for most cases
2. **Subtle Delays**: Keep delays under 1000ms for better UX
3. **Stagger Sequential Items**: Use progressive delays for lists
4. **Conditional Animation**: Disable animation when not needed
5. **Performance**: Don't animate too many elements simultaneously
6. **User Preference**: Respect reduced-motion preferences

## Common Mistakes

❌ **Don't** use extremely long durations

```typescript
// Bad - animation too slow
<FadeIn duration={5000}>
  <div>Content</div>
</FadeIn>
```

✅ **Do** use reasonable durations

```typescript
// Good - quick and smooth
<FadeIn duration={400}>
  <div>Content</div>
</FadeIn>
```

❌ **Don't** animate everything on the page

```typescript
// Bad - too many animations
<FadeIn>
  <FadeIn>
    <FadeIn>
      <div>Nested animations</div>
    </FadeIn>
  </FadeIn>
</FadeIn>
```

✅ **Do** animate selectively

```typescript
// Good - animate key content
<FadeIn>
  <div>Important content that benefits from animation</div>
</FadeIn>
```

❌ **Don't** forget about performance

```typescript
// Bad - animating large lists without consideration
{items.map(item => (
  <FadeIn>{/* 1000+ items */}</FadeIn>
))}
```

✅ **Do** consider performance

```typescript
// Good - use virtual scrolling or limit animations
{visibleItems.map((item, index) => (
  <FadeIn delay={index * 50}>{item}</FadeIn>
))}
```

## Related Components

- [Skeleton](./Skeleton.md) - For loading states before content
- [Spinner](./Loader.md) - For indeterminate loading
- [Modal](./Modal.md) - Often uses fade-in effects
- [Card](./Card.md) - Can be wrapped in FadeIn

