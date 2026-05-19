# Skeleton

Skeleton component for loading placeholder states.

## Import

```typescript
import { Skeleton, SkeletonAnimation, SkeletonVariant } from '@eightfold.ai/octuple';
```

## API Reference

### Skeleton Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| animating | Is animating or not | `boolean` | `true` | |
| animation | Animation of the Skeleton component | `<enum>SkeletonAnimation` | `SkeletonAnimation.Wave` | |
| fullWidth | If the Skeleton is full width, will ignore the width prop | `boolean` | | |
| height | Height of the Skeleton | `<number \| string>Dimension` | | |
| variant | Visible variant of the Skeleton | `<enum>SkeletonVariant` | `SkeletonVariant.Rectangular` | |
| width | Width of the Skeleton | `<number \| string>Dimension` | | |

## TypeScript Enums

```typescript
enum SkeletonAnimation {
  Pulse = 'pulse',
  Wave = 'wave',
  None = 'none'
}

enum SkeletonVariant {
  Circular = 'circular',
  Rectangular = 'rectangular',
  Rounded = 'rounded',
  Text = 'text'
}
```

## Usage Examples

### Basic Skeleton

```typescript
import { Skeleton } from '@eightfold.ai/octuple';

function BasicSkeleton() {
  return (
    <Skeleton width={200} height={20} />
  );
}
```

### Skeleton Variants

```typescript
import { Skeleton, SkeletonVariant } from '@eightfold.ai/octuple';

function SkeletonVariants() {
  return (
    <>
      <Skeleton variant={SkeletonVariant.Text} width={200} />
      <Skeleton variant={SkeletonVariant.Circular} width={40} height={40} />
      <Skeleton variant={SkeletonVariant.Rectangular} width={300} height={200} />
      <Skeleton variant={SkeletonVariant.Rounded} width={300} height={50} />
    </>
  );
}
```

### Skeleton Animations

```typescript
import { Skeleton, SkeletonAnimation } from '@eightfold.ai/octuple';

function AnimatedSkeletons() {
  return (
    <>
      <Skeleton animation={SkeletonAnimation.Wave} width={200} height={20} />
      <Skeleton animation={SkeletonAnimation.Pulse} width={200} height={20} />
      <Skeleton animation={SkeletonAnimation.None} width={200} height={20} />
    </>
  );
}
```

### Card Skeleton

```typescript
import { Skeleton, SkeletonVariant, Card } from '@eightfold.ai/octuple';

function CardSkeleton() {
  return (
    <Card style={{ padding: '16px' }}>
      <Skeleton variant={SkeletonVariant.Circular} width={40} height={40} />
      <div style={{ marginTop: '12px' }}>
        <Skeleton variant={SkeletonVariant.Text} width="60%" />
        <Skeleton variant={SkeletonVariant.Text} width="80%" />
        <Skeleton variant={SkeletonVariant.Text} width="40%" />
      </div>
    </Card>
  );
}
```

### User Profile Skeleton

```typescript
import { Skeleton, SkeletonVariant } from '@eightfold.ai/octuple';

function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Skeleton variant={SkeletonVariant.Circular} width={60} height={60} />
      <div style={{ flex: 1 }}>
        <Skeleton variant={SkeletonVariant.Text} width="40%" height={20} />
        <Skeleton variant={SkeletonVariant.Text} width="60%" height={16} />
      </div>
    </div>
  );
}
```

### Table Skeleton

```typescript
import { Skeleton, SkeletonVariant } from '@eightfold.ai/octuple';

function TableSkeleton() {
  const rows = Array.from({ length: 5 });

  return (
    <div>
      {rows.map((_, index) => (
        <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <Skeleton width={50} height={20} />
          <Skeleton width={150} height={20} />
          <Skeleton width={100} height={20} />
          <Skeleton width={200} height={20} />
        </div>
      ))}
    </div>
  );
}
```

### Full Width Skeleton

```typescript
import { Skeleton } from '@eightfold.ai/octuple';

function FullWidthSkeleton() {
  return (
    <>
      <Skeleton fullWidth height={20} />
      <Skeleton fullWidth height={20} />
      <Skeleton fullWidth height={20} />
    </>
  );
}
```

### Conditional Loading

```typescript
import { Skeleton, SkeletonVariant } from '@eightfold.ai/octuple';

interface UserCardProps {
  loading: boolean;
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}

function UserCard({ loading, user }: UserCardProps) {
  if (loading) {
    return (
      <div style={{ padding: '16px' }}>
        <Skeleton variant={SkeletonVariant.Circular} width={60} height={60} />
        <Skeleton variant={SkeletonVariant.Text} width="60%" />
        <Skeleton variant={SkeletonVariant.Text} width="40%" />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <img src={user?.avatar} alt={user?.name} width={60} height={60} />
      <h3>{user?.name}</h3>
      <p>{user?.email}</p>
    </div>
  );
}
```

### Skeleton with Non-Animating State

```typescript
import { Skeleton } from '@eightfold.ai/octuple';

function StaticSkeleton() {
  const [loading, setLoading] = React.useState(true);

  return (
    <Skeleton
      animating={loading}
      width={200}
      height={20}
    />
  );
}
```

## Accessibility

- Skeleton is a visual placeholder and doesn't need specific ARIA attributes
- Ensure actual content loads and replaces skeleton
- Consider announcing content loading to screen readers
- Use appropriate animation speed (not too fast)

## Best Practices

1. **Match Content Shape**: Skeleton should match the shape of actual content
2. **Appropriate Animation**: Use Wave for most cases, Pulse for emphasis
3. **Consistent Sizing**: Keep skeleton dimensions close to actual content
4. **Loading State**: Always replace skeleton with actual content
5. **Performance**: Disable animation (animating={false}) if performance is an issue
6. **Variants**: Use appropriate variant (Circular for avatars, Text for text, etc.)

## Common Mistakes

❌ **Don't** leave skeleton dimensions undefined

```typescript
// Bad - no dimensions
<Skeleton />
```

✅ **Do** specify dimensions

```typescript
// Good
<Skeleton width={200} height={20} />
```

❌ **Don't** use skeleton for quick loads

```typescript
// Bad - skeleton for < 200ms loads
{loading && <Skeleton />}
```

✅ **Do** use skeleton for longer loads

```typescript
// Good - skeleton for > 300ms loads
{loading && loadingDuration > 300 && <Skeleton />}
```

❌ **Don't** forget to stop animation when loaded

```typescript
// Bad - skeleton stays animated
<Skeleton animating={true} />
<Content />
```

✅ **Do** replace skeleton entirely

```typescript
// Good
{loading ? <Skeleton /> : <Content />}
```

## Related Components

- [Spinner](./Loader.md) - For indeterminate loading
- [Progress](./Progress.md) - For determinate loading
- [Card](./Card.md) - Often contains skeleton
- [Empty](./Empty.md) - For empty states after loading

