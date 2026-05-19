# Empty

Empty state component for displaying when there is no data or content.

## Import

```typescript
import { Empty, EmptyMode } from '@eightfold.ai/octuple';
```

## API Reference

### Empty Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| classNames | The Empty class names | `string` | | |
| children | The Empty children | `React.ReactNode` | | |
| description | The Empty description | `React.ReactNode` | | |
| descriptionClassNames | The Empty description class names | `string` | | |
| mode | The Empty mode. Sets the empty state icon | `EmptyMode` | `EmptyMode.data` | |
| image | Custom image source | `string \| React.ReactNode` | | |
| imageStyle | The Empty image style | `React.CSSProperties` | | |
| style | The Empty custom styles | `React.CSSProperties` | | |
| title | The Empty title | `React.ReactNode` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum EmptyMode {
  data = 'data',
  error = 'error',
  messages = 'messages',
  plan = 'plan',
  profile = 'profile',
  search = 'search',
  tasks = 'tasks'
}
```

## Usage Examples

### Basic Empty State

```typescript
import { Empty } from '@eightfold.ai/octuple';

function NoData() {
  return (
    <Empty
      description="No data available"
    />
  );
}
```

### Empty with Mode

```typescript
import { Empty, EmptyMode } from '@eightfold.ai/octuple';

function EmptyStates() {
  return (
    <>
      <Empty
        mode={EmptyMode.data}
        description="No data found"
      />
      
      <Empty
        mode={EmptyMode.search}
        description="No search results"
      />
      
      <Empty
        mode={EmptyMode.messages}
        description="No messages"
      />
      
      <Empty
        mode={EmptyMode.tasks}
        description="No tasks to display"
      />
    </>
  );
}
```

### Empty with Title and Description

```typescript
import { Empty, EmptyMode } from '@eightfold.ai/octuple';

function DetailedEmpty() {
  return (
    <Empty
      mode={EmptyMode.search}
      title="No Results Found"
      description="Try adjusting your search criteria or filters"
    />
  );
}
```

### Empty with Action Button

```typescript
import { Empty, Button, ButtonVariant, EmptyMode } from '@eightfold.ai/octuple';

function EmptyWithAction() {
  const handleCreate = () => {
    console.log('Create new item');
  };

  return (
    <Empty
      mode={EmptyMode.data}
      title="No Projects Yet"
      description="Get started by creating your first project"
    >
      <Button
        text="Create Project"
        variant={ButtonVariant.Primary}
        onClick={handleCreate}
      />
    </Empty>
  );
}
```

### Empty in Table

```typescript
import { Table, Empty, EmptyMode } from '@eightfold.ai/octuple';

function EmptyTable() {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' }
  ];

  return (
    <Table
      columns={columns}
      dataSource={[]}
      locale={{
        emptyText: (
          <Empty
            mode={EmptyMode.data}
            description="No records found"
          />
        )
      }}
    />
  );
}
```

### Custom Empty Image

```typescript
import { Empty } from '@eightfold.ai/octuple';

function CustomImageEmpty() {
  return (
    <Empty
      image="/path/to/custom-image.svg"
      description="Custom empty state"
      imageStyle={{ height: 200 }}
    />
  );
}
```

### Empty with Custom Content

```typescript
import { Empty, Button, ButtonVariant } from '@eightfold.ai/octuple';
import Icon from '@mdi/react';
import { mdiFileDocumentPlus } from '@mdi/js';

function CustomEmpty() {
  return (
    <Empty
      title="No Documents"
      description="Upload your first document to get started"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <Button
          text="Upload Document"
          variant={ButtonVariant.Primary}
          iconProps={{ path: mdiFileDocumentPlus }}
        />
        <Button
          text="Browse Examples"
          variant={ButtonVariant.Secondary}
        />
      </div>
    </Empty>
  );
}
```

### Error Empty State

```typescript
import { Empty, Button, ButtonVariant, EmptyMode } from '@eightfold.ai/octuple';

function ErrorState() {
  const handleRetry = () => {
    console.log('Retrying...');
  };

  return (
    <Empty
      mode={EmptyMode.error}
      title="Something Went Wrong"
      description="We couldn't load your data. Please try again."
    >
      <Button
        text="Retry"
        variant={ButtonVariant.Primary}
        onClick={handleRetry}
      />
    </Empty>
  );
}
```

## Accessibility

- Provide clear, descriptive text for empty states
- Use appropriate EmptyMode for context
- Include actionable steps when possible
- Ensure sufficient color contrast
- Make action buttons keyboard accessible

## Best Practices

1. **Clear Messaging**: Explain why the state is empty
2. **Actionable**: Provide next steps or actions when appropriate
3. **Appropriate Mode**: Use the right EmptyMode for context
4. **Consistent Design**: Keep empty states consistent across your app
5. **Helpful Guidance**: Tell users what they can do next

## Common Mistakes

❌ **Don't** leave empty states without context

```typescript
// Bad - user doesn't know what's empty or why
<Empty />
```

✅ **Do** provide clear description

```typescript
// Good
<Empty
  mode={EmptyMode.data}
  title="No Data Available"
  description="Start by adding your first item"
/>
```

❌ **Don't** use generic messages for specific contexts

```typescript
// Bad - not helpful for search results
<Empty description="No data" />
```

✅ **Do** use contextual messages

```typescript
// Good
<Empty
  mode={EmptyMode.search}
  title="No Results Found"
  description="Try different keywords or adjust your filters"
/>
```

❌ **Don't** forget to provide actions

```typescript
// Bad - user has no next steps
<Empty description="You have no projects" />
```

✅ **Do** provide actionable next steps

```typescript
// Good
<Empty
  mode={EmptyMode.data}
  title="No Projects Yet"
  description="Create your first project to get started"
>
  <Button text="Create Project" onClick={handleCreate} />
</Empty>
```

## Related Components

- [Table](./Table.md) - Often uses Empty for no data state
- [List](./List.md) - Uses Empty when list is empty
- [Card](./Card.md) - Can contain Empty states
- [Button](./Button.md) - For empty state actions

