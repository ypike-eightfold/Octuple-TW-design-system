# Loader

Loader (Spinner) component for indicating loading states.

## Import

```typescript
import { Loader, Spinner } from '@eightfold.ai/octuple';
```

## API Reference

### Spinner Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| classNames | The Spinner class names | `string` | | |
| size | The Spinner size | `<enum>SpinnerSize` | `SpinnerSize.Default` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum SpinnerSize {
  Large = 'large',
  Default = 'default',
  Small = 'small'
}
```

## Usage Examples

### Basic Spinner

```typescript
import { Spinner } from '@eightfold.ai/octuple';

function LoadingState() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Spinner />
    </div>
  );
}
```

### Spinner Sizes

```typescript
import { Spinner, SpinnerSize } from '@eightfold.ai/octuple';

function SpinnerSizes() {
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Spinner size={SpinnerSize.Small} />
      <Spinner size={SpinnerSize.Default} />
      <Spinner size={SpinnerSize.Large} />
    </div>
  );
}
```

### Loading Content

```typescript
import { Spinner, SpinnerSize } from '@eightfold.ai/octuple';

function LoadingContent() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData('Content loaded!');
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spinner size={SpinnerSize.Large} />
      </div>
    );
  }

  return <div>{data}</div>;
}
```

### Spinner with Text

```typescript
import { Spinner } from '@eightfold.ai/octuple';

function SpinnerWithText() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <Spinner />
      <p>Loading data...</p>
    </div>
  );
}
```

### Inline Spinner

```typescript
import { Spinner, SpinnerSize, Button } from '@eightfold.ai/octuple';

function InlineSpinner() {
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button text="Load Data" onClick={handleClick} disabled={loading} />
      {loading && <Spinner size={SpinnerSize.Small} />}
    </div>
  );
}
```

### Full Page Loader

```typescript
import { Spinner, SpinnerSize } from '@eightfold.ai/octuple';

function FullPageLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      }}
    >
      <Spinner size={SpinnerSize.Large} />
    </div>
  );
}
```

### Spinner in Button

```typescript
import { Button, Spinner, SpinnerSize } from '@eightfold.ai/octuple';

function LoadingButton() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Button
      text={loading ? 'Submitting...' : 'Submit'}
      onClick={handleSubmit}
      disabled={loading}
      iconProps={loading ? { 
        component: <Spinner size={SpinnerSize.Small} />
      } : undefined}
    />
  );
}
```

### Conditional Loading

```typescript
import { Spinner, Card } from '@eightfold.ai/octuple';

interface DataCardProps {
  loading: boolean;
  data: any;
}

function DataCard({ loading, data }: DataCardProps) {
  return (
    <Card>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Spinner />
        </div>
      ) : (
        <div>{data}</div>
      )}
    </Card>
  );
}
```

### Table Loading State

```typescript
import { Table, Spinner, SpinnerSize } from '@eightfold.ai/octuple';

function LoadingTable() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
    />
  );
}
```

## Accessibility

- Provide context about what is loading
- Use `aria-live` regions for loading announcements
- Ensure spinner is visible against background
- Don't rely solely on spinner for loading feedback
- Consider adding text descriptions for screen readers

## Best Practices

1. **Provide Context**: Tell users what's loading
2. **Appropriate Size**: Match spinner size to context
3. **Center Alignment**: Center spinners in their containers
4. **Timeout Handling**: Handle cases where loading takes too long
5. **Skeleton Screens**: Consider using skeleton screens for better UX
6. **Disable Interactions**: Disable buttons/inputs during loading

## Common Mistakes

❌ **Don't** use spinner without context

```typescript
// Bad - user doesn't know what's loading
<Spinner />
```

✅ **Do** provide context

```typescript
// Good
<div>
  <p>Loading your profile...</p>
  <Spinner />
</div>
```

❌ **Don't** forget to remove spinner when done

```typescript
// Bad - spinner stays forever
const [loading] = React.useState(true);
return loading && <Spinner />;
```

✅ **Do** update loading state

```typescript
// Good
const [loading, setLoading] = React.useState(true);

useEffect(() => {
  fetchData().then(() => setLoading(false));
}, []);

return loading && <Spinner />;
```

❌ **Don't** block entire UI unnecessarily

```typescript
// Bad - blocks everything for small operation
<FullPageLoader />
```

✅ **Do** use localized loading

```typescript
// Good - only block affected area
<Card>
  {loading ? <Spinner /> : <Content />}
</Card>
```

## Related Components

- [Progress](./Progress.md) - For determinate loading (with percentage)
- [Empty](./Empty.md) - For empty states after loading completes
- [Table](./Table.md) - Has built-in loading prop

