# Pagination

Pagination component for dividing content into pages.

## Import

```typescript
import { Pagination } from '@eightfold.ai/octuple';
```

## API Reference

### Pagination Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| classNames | The Pagination class names | `string` | | |
| currentPage | Current page number | `number` | `1` | |
| dots | Show dots when page range is large | `boolean` | `true` | |
| goToText | The 'Go to' string | `string` | `'Go to'` | |
| itemRender | Custom item renderer | `(page: number, type: 'page' \| 'prev' \| 'next' \| 'jump-prev' \| 'jump-next', originalElement: React.ReactNode) => React.ReactNode` | | |
| layout | Layout of pagination components | `PaginationLayoutOptions[]` | `['pager']` | |
| nextIconButtonAriaLabel | The next button aria label | `string` | `'Next'` | |
| offset | Number of pages to offset display | `number` | | >= 2.41.0 |
| onChange | Callback when page changes | `(page: number, pageSize: number) => void` | | |
| onPageSizeChange | Callback when page size changes | `(pageSize: number) => void` | | |
| onPreviousClick | Callback when previous is clicked | `React.MouseEventHandler<HTMLButtonElement>` | | |
| onNextClick | Callback when next is clicked | `React.MouseEventHandler<HTMLButtonElement>` | | |
| pageSize | Number of items per page | `number` | `10` | |
| pageSizeButtonAriaLabel | The page size button aria label | `string` | `'Items per page'` | |
| pageSizeLabel | The items per page label | `string` | `'Items per page'` | |
| pageSizeOptions | Page size options | `number[]` | `[10, 20, 30, 40]` | |
| pageString | The 'page' string | `string` | `'page'` | |
| previousIconButtonAriaLabel | The previous button aria label | `string` | `'Previous'` | |
| quickJumper | Show quick jumper | `boolean` | `false` | |
| renderTotalString | Custom total string renderer | `(total: number, range: [number, number]) => string` | `(total, range) => '${range[0]}-${range[1]} of ${total} items'` | |
| showSizeChanger | Show page size selector | `boolean` | `false` | |
| total | Total number of items | `number` | `0` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Types

```typescript
type PaginationLayoutOptions =
  | 'total'
  | 'pager'
  | 'sizer'
  | 'jumper';
```

## Usage Examples

### Basic Pagination

```typescript
import { Pagination } from '@eightfold.ai/octuple';

function BasicPagination() {
  const [currentPage, setCurrentPage] = React.useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      total={100}
      pageSize={10}
      onChange={(page) => setCurrentPage(page)}
    />
  );
}
```

### Pagination with Size Changer

```typescript
import { Pagination } from '@eightfold.ai/octuple';

function PaginationWithSizer() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  return (
    <Pagination
      currentPage={currentPage}
      pageSize={pageSize}
      total={200}
      showSizeChanger
      pageSizeOptions={[10, 20, 50, 100]}
      onChange={(page, size) => {
        setCurrentPage(page);
      }}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page
      }}
    />
  );
}
```

### Pagination with Total

```typescript
import { Pagination } from '@eightfold.ai/octuple';

function PaginationWithTotal() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20;
  const total = 150;

  return (
    <Pagination
      layout={['total', 'pager']}
      currentPage={currentPage}
      pageSize={pageSize}
      total={total}
      onChange={(page) => setCurrentPage(page)}
      renderTotalString={(total, range) =>
        `${range[0]}-${range[1]} of ${total} items`
      }
    />
  );
}
```

### Pagination with Quick Jumper

```typescript
import { Pagination } from '@eightfold.ai/octuple';

function PaginationWithJumper() {
  const [currentPage, setCurrentPage] = React.useState(1);

  return (
    <Pagination
      currentPage={currentPage}
      total={500}
      pageSize={10}
      quickJumper
      onChange={(page) => setCurrentPage(page)}
    />
  );
}
```

### Full Featured Pagination

```typescript
import { Pagination } from '@eightfold.ai/octuple';

function FullPagination() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const total = 500;

  return (
    <Pagination
      layout={['total', 'sizer', 'pager', 'jumper']}
      currentPage={currentPage}
      pageSize={pageSize}
      total={total}
      showSizeChanger
      quickJumper
      pageSizeOptions={[10, 20, 50, 100]}
      onChange={(page) => setCurrentPage(page)}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
    />
  );
}
```

### Pagination with Table

```typescript
import { Table, Pagination } from '@eightfold.ai/octuple';

function PaginatedTable() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [data, setData] = React.useState([]);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' }
  ];

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <>
      <Table
        columns={columns}
        dataSource={paginatedData}
        pagination={false}
      />
      
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={data.length}
        showSizeChanger
        onChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </>
  );
}
```

### Custom Item Renderer

```typescript
import { Pagination } from '@eightfold.ai/octuple';

function CustomPagination() {
  const [currentPage, setCurrentPage] = React.useState(1);

  const itemRender = (page: number, type: string, originalElement: React.ReactNode) => {
    if (type === 'prev') {
      return <a>Previous</a>;
    }
    if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

  return (
    <Pagination
      currentPage={currentPage}
      total={100}
      onChange={(page) => setCurrentPage(page)}
      itemRender={itemRender}
    />
  );
}
```

## Accessibility

- Provide clear aria-labels for navigation buttons
- Ensure keyboard navigation works (Tab, Enter)
- Announce page changes to screen readers
- Use semantic navigation elements
- Make current page visually distinct

## Best Practices

1. **Show Total**: Display total items/pages for context
2. **Size Options**: Provide reasonable page size options
3. **Reset on Size Change**: Reset to page 1 when page size changes
4. **Loading State**: Show loading indicator during page changes
5. **Maintain Scroll**: Consider scrolling to top on page change
6. **URL Sync**: Sync pagination state with URL for bookmarkability

## Common Mistakes

❌ **Don't** forget to handle page size changes

```typescript
// Bad - doesn't reset page when size changes
<Pagination
  onPageSizeChange={(size) => setPageSize(size)}
/>
```

✅ **Do** reset to first page

```typescript
// Good
<Pagination
  onPageSizeChange={(size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  }}
/>
```

❌ **Don't** paginate small datasets

```typescript
// Bad - only 15 items, no need for pagination
<Pagination total={15} pageSize={10} />
```

✅ **Do** only paginate when necessary

```typescript
// Good
{data.length > 50 && (
  <Pagination total={data.length} pageSize={20} />
)}
```

❌ **Don't** forget to update data when page changes

```typescript
// Bad - page changes but data doesn't
<Pagination
  currentPage={currentPage}
  onChange={(page) => setCurrentPage(page)}
/>
<Table dataSource={allData} /> {/* Shows all data */}
```

✅ **Do** slice data based on current page

```typescript
// Good
const startIndex = (currentPage - 1) * pageSize;
const paginatedData = allData.slice(startIndex, startIndex + pageSize);

<Table dataSource={paginatedData} />
<Pagination
  currentPage={currentPage}
  onChange={(page) => setCurrentPage(page)}
/>
```

## Related Components

- [Table](./Table.md) - Often used with pagination
- [List](./List.md) - Can be paginated
- [Button](./Button.md) - Used for navigation controls

