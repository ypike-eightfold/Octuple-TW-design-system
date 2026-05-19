# List

List component for displaying a vertical list of data.

## Import

```typescript
import { List } from '@eightfold.ai/octuple';
import type { ListItemProps } from '@eightfold.ai/octuple';
```

## API Reference

### List Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| bordered | Toggles rendering of the border around the list | `boolean` | `false` | |
| classNames | The list class names | `string` | | |
| configContextProps | Configure how contextual props are consumed | `ConfigContextProps` | `{ noDisabledContext: false, noSizeContext: false }` | >= 2.10.0 |
| getItem | Custom item getter | `(items: T[], index: number) => T` | `(items, index) => items[index]` | |
| header | List header renderer | `React.ReactNode` | | |
| footer | List footer renderer | `React.ReactNode` | | |
| items | Array of items to render | `T[]` | | |
| itemProps | The item props applied to each list item | `Omit<ListItemProps, 'children'>` | | |
| itemClassNames | The item class names applied to each list item | `string` | | |
| itemStyle | The item inline styles applied to each list item | `React.CSSProperties` | | |
| layout | The layout of list | `'horizontal' \| 'vertical'` | `'vertical'` | |
| listType | List item type | `'ul' \| 'ol'` | `'ul'` | |
| loading | Shows a loading indicator | `boolean` | `false` | |
| locale | The list strings locale | `ListLocale` | `enUS` | |
| renderItem | Custom render function for each item | `(item: T, index: number) => React.ReactNode` | | |
| role | Role of the list element | `string` | | |
| rowKey | Row's unique key getter | `string \| ((item: T) => string)` | `'key'` | |
| size | Size of list | `<enum>ListSize \| <enum>Size` | `ListSize.Medium` | |
| style | List custom styles | `React.CSSProperties` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

### List.Item Props

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| classNames | The list item class names | `string` | |
| extra | The extra content of list item. If itemLayout is 'vertical', shows the content on the right, otherwise shows content on the far right | `React.ReactNode` | |
| role | Role of the list item element | `string` | |
| style | List item custom styles | `React.CSSProperties` | |

## TypeScript Enums

```typescript
enum ListSize {
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

### Basic List

```typescript
import { List } from '@eightfold.ai/octuple';

interface User {
  key: string;
  name: string;
  email: string;
}

function UserList() {
  const users: User[] = [
    { key: '1', name: 'John Doe', email: 'john@example.com' },
    { key: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { key: '3', name: 'Bob Johnson', email: 'bob@example.com' }
  ];

  return (
    <List
      items={users}
      renderItem={(user) => (
        <div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
      )}
      rowKey="key"
    />
  );
}
```

### List with Header and Footer

```typescript
import { List } from '@eightfold.ai/octuple';

function TaskList() {
  const tasks = [
    { key: '1', title: 'Complete documentation' },
    { key: '2', title: 'Review pull requests' },
    { key: '3', title: 'Update dependencies' }
  ];

  return (
    <List
      header={<h3>Today's Tasks</h3>}
      footer={<div>Total: {tasks.length} tasks</div>}
      items={tasks}
      renderItem={(task) => <div>{task.title}</div>}
      bordered
    />
  );
}
```

### Ordered List

```typescript
import { List } from '@eightfold.ai/octuple';

function StepsList() {
  const steps = [
    { key: '1', instruction: 'Install dependencies' },
    { key: '2', instruction: 'Configure environment' },
    { key: '3', instruction: 'Run development server' }
  ];

  return (
    <List
      listType="ol"
      items={steps}
      renderItem={(step) => <div>{step.instruction}</div>}
    />
  );
}
```

### Horizontal List

```typescript
import { List } from '@eightfold.ai/octuple';

function TagList() {
  const tags = [
    { key: '1', name: 'React' },
    { key: '2', name: 'TypeScript' },
    { key: '3', name: 'Octuple' }
  ];

  return (
    <List
      layout="horizontal"
      items={tags}
      renderItem={(tag) => (
        <div style={{ padding: '8px 16px', background: '#f0f0f0', borderRadius: '4px' }}>
          {tag.name}
        </div>
      )}
    />
  );
}
```

### List with Extra Content

```typescript
import { List, Button, ButtonVariant } from '@eightfold.ai/octuple';

interface Notification {
  key: string;
  message: string;
  time: string;
}

function NotificationList() {
  const notifications: Notification[] = [
    { key: '1', message: 'New message received', time: '2 mins ago' },
    { key: '2', message: 'Update available', time: '1 hour ago' }
  ];

  const handleDismiss = (key: string) => {
    console.log('Dismiss:', key);
  };

  return (
    <List
      items={notifications}
      renderItem={(item) => (
        <List.Item
          extra={
            <Button
              text="Dismiss"
              variant={ButtonVariant.Secondary}
              onClick={() => handleDismiss(item.key)}
            />
          }
        >
          <div>
            <strong>{item.message}</strong>
            <p style={{ fontSize: '12px', color: '#888' }}>{item.time}</p>
          </div>
        </List.Item>
      )}
      bordered
    />
  );
}
```

### Loading List

```typescript
import { List } from '@eightfold.ai/octuple';

function LoadingList() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([
        { key: '1', name: 'Item 1' },
        { key: '2', name: 'Item 2' }
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <List
      loading={loading}
      items={data}
      renderItem={(item) => <div>{item.name}</div>}
    />
  );
}
```

## Accessibility

- Use semantic list markup (`ul` or `ol`)
- Provide clear item descriptions
- Ensure keyboard navigation works (Tab, Arrow keys)
- Use `role` prop for custom ARIA roles when needed
- Consider `aria-label` for context

## Best Practices

1. **Use rowKey**: Always provide unique key for each item
2. **Consistent Layout**: Keep list item layout consistent
3. **Loading State**: Show loading spinner during data fetch
4. **Empty State**: Handle empty lists gracefully
5. **Pagination**: For long lists, consider pagination or virtual scrolling
6. **Action Placement**: Put actions in consistent locations (typically on the right)

## Common Mistakes

❌ **Don't** forget rowKey for dynamic data

```typescript
// Bad - may cause rendering issues
<List items={data} renderItem={...} />
```

✅ **Do** provide unique rowKey

```typescript
// Good
<List items={data} renderItem={...} rowKey="id" />
```

❌ **Don't** render too many items without pagination

```typescript
// Bad - 1000+ items will cause performance issues
<List items={hugeArray} renderItem={...} />
```

✅ **Do** implement pagination or virtual scrolling

```typescript
// Good
<List
  items={paginatedData}
  renderItem={...}
  // Add pagination controls
/>
```

❌ **Don't** use inconsistent item heights without planning

```typescript
// Bad - items with wildly different heights
<List
  items={items}
  renderItem={(item) => (
    <div style={{ height: Math.random() * 500 }}>...</div>
  )}
/>
```

✅ **Do** keep item heights consistent or use proper spacing

```typescript
// Good
<List
  items={items}
  renderItem={(item) => (
    <div style={{ minHeight: '60px', padding: '16px' }}>...</div>
  )}
/>
```

## Related Components

- [Table](./Table.md) - For tabular data with columns
- [Card](./Card.md) - For card-based layouts
- [Pagination](./Pagination.md) - For paginating long lists

