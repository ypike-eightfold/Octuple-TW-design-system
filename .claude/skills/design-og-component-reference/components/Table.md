# Table

Table component for displaying structured data with sorting, filtering, pagination, and selection.

## Import

```typescript
import { Table } from '@eightfold.ai/octuple';
import type { ColumnsType, ColumnType } from '@eightfold.ai/octuple';
```

## Basic Example

```typescript
import { Table } from '@eightfold.ai/octuple';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

function BasicTable() {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const dataSource: DataType[] = [
    {
      key: '1',
      name: 'John Doe',
      age: 32,
      address: 'New York'
    },
    {
      key: '2',
      name: 'Jane Smith',
      age: 28,
      address: 'London'
    }
  ];

  return <Table columns={columns} dataSource={dataSource} />;
}
```

## API Reference

### Table Props

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| alternateRowColor | The table's rows alternate colors | `boolean` | `false` |
| bordered | Toggle whether the table has all borders | `boolean` | `false` |
| cellBordered | Toggle whether the table has vertical borders | `boolean` | `false` |
| classNames | The table class names | `string` | |
| columnBordered | Toggle whether the table has vertical borders on the header row | `boolean` | `false` |
| columns | Columns of the table | `ColumnsType<RecordType>` | |
| components | Override default table elements | `TableComponents<RecordType>` | |
| configContextProps | Configure how contextual props are consumed | `ConfigContextProps` | |
| dataSource | Data record array to be displayed | `RecordType[]` | |
| defaultExpandAllRows | Expand all rows initially | `boolean` | `false` |
| defaultExpandedRowKeys | Initial expanded row keys | `Key[]` | |
| direction | The direction of the table | `Direction` | |
| emptyIcon | The icon to show when empty | `IconName` | |
| emptyMode | The table mode. Sets the empty state icon | `EmptyMode` | `EmptyMode.Data` |
| emptyText | The text to show when empty | `React.ReactNode` | `'No data'` |
| expandable | Config expandable content | `ExpandableConfig<RecordType>` | |
| expandedRowKeys | Current expanded row keys | `Key[]` | |
| expandIcon | Customize row expand icon | `RenderExpandIcon<RecordType>` | |
| expandIconColumn | Change width and column for expand icon | `ExpandIconColumnProps` | |
| expandRowByClick | Whether expand row by clicking anywhere | `boolean` | `false` |
| filterApplyText | Custom apply button text | `string` | `'Apply'` |
| filterCheckallText | Custom checkall button text | `string` | `'Select all'` |
| filterClearText | Custom clear button text | `string` | `'Clear'` |
| filterConfirmText | Custom confirm button text | `string` | `'OK'` |
| filterResetText | Custom reset button text | `string` | `'Reset'` |
| filterResetToDefaultFilteredValue | Reset to defaultFilteredValue | `boolean` | `false` |
| filterSearchPlaceholder | Custom search placeholder | `string` | `'Search'` |
| footer | Table footer renderer | `FrameWrapperRender<RecordType>` | |
| getPopupContainer | The render container of dropdown in table | `(triggerNode: HTMLElement) => HTMLElement` | |
| headerBordered | Toggle whether the header row has a border | `boolean` | `false` |
| indentSize | Indent size in pixels of tree data | `number` | `15` |
| loading | Loading status of table | `boolean` | `false` |
| locale | i18n text including filter, sort, empty text, etc | `TableLocale` | |
| onChange | Callback executed when pagination, filters or sorter is changed | `(pagination, filters, sorter, extra) => void` | |
| onExpand | Callback executed when the expand icon is clicked | `(expanded, record) => void` | |
| onExpandedRowsChange | Callback executed when expanded rows change | `(expandedKeys) => void` | |
| onHeaderRow | Set props on per header row | `(columns, index) => object` | |
| onRow | Set props on per row | `(record, index) => object` | |
| pagination | Config of pagination | `false \| TablePaginationConfig` | |
| rowClassName | Row's className | `RowClassName<RecordType>` | |
| rowExpandable | Enable row can be expandable | `(record) => boolean` | |
| rowHoverBackgroundEnabled | Toggle row hover background enabled | `boolean` | `true` |
| rowKey | Row's unique key | `string \| GetRowKey<RecordType>` | `'key'` |
| rowSelection | Row selection config | `TableRowSelection<RecordType>` | |
| scroll | Whether the table can be scrollable | `{ x?: number \| true \| string, y?: number \| string }` | |
| showHeader | Whether to show table header | `boolean` | `true` |
| showSorterTooltip | The header show next sorter direction tooltip | `boolean \| TooltipProps` | `true` |
| size | Size of table | `TableSize` | `TableSize.Medium` |
| sortDirections | Supported sort way | `SortOrder[]` | `['ascend', 'descend']` |
| sticky | Set sticky header and scroll bar | `boolean \| { offsetHeader?: number, offsetScroll?: number, getContainer?: () => Window \| HTMLElement }` | `false` |
| style | The table custom styles | `React.CSSProperties` | |
| summary | Summary content | `(data) => React.ReactNode` | |
| tableLayout | Table layout type | `'auto' \| 'fixed'` | |
| title | Table title renderer | `FrameWrapperRender<RecordType>` | |
| triggerAscText | Custom trigger ascending sort text | `string` | `'Click to sort ascending'` |
| triggerDescText | Custom trigger descending sort text | `string` | `'Click to sort descending'` |

### Column Props

Column props for defining table columns.

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| align | Alignment of this column | `'left' \| 'right' \| 'center'` | `'left'` |
| classNames | The column class names | `string` | |
| dataIndex | Display field of the data record | `string \| string[]` | |
| defaultFilteredValue | Default filtered values | `string[]` | |
| defaultSortOrder | Default order of sorted values | `SortOrder` | |
| ellipsis | Ellipsis cell content | `boolean \| { showTitle?: boolean }` | `false` |
| filterDropdown | Custom filter dropdown | `React.ReactNode \| ((props) => React.ReactNode)` | |
| filterDropdownOpen | Whether filterDropdown is visible | `boolean` | |
| filtered | Whether the dataSource is filtered | `boolean` | |
| filteredValue | Controlled filtered value | `string[]` | |
| filterIcon | Customized filter icon | `React.ReactNode \| ((filtered: boolean) => React.ReactNode)` | |
| filterMultiple | Multiple select | `boolean` | `true` |
| filterMode | Filter menu mode | `'menu' \| 'tree'` | `'menu'` |
| filterSearch | Whether filter search input is displayed | `boolean \| function` | `false` |
| filters | Filter menu config | `ColumnFilterItem[]` | |
| fixed | Set column to be fixed | `boolean \| 'left' \| 'right'` | `false` |
| key | Unique key of this column | `React.Key` | |
| onCell | Set props on per cell | `(record, index) => object` | |
| onFilter | Callback executed when filter is determined | `(value, record) => boolean` | |
| onFilterDropdownOpenChange | Callback when filterDropdown visibility changes | `(visible: boolean) => void` | |
| onHeaderCell | Set props on per header cell | `(column) => object` | |
| render | Renderer of the table cell | `(value, record, index) => React.ReactNode` | |
| responsive | The list of breakpoints at which to display this column | `Breakpoint[]` | |
| rowScope | Th scope attribute | `'row' \| 'col' \| 'rowgroup' \| 'colgroup'` | |
| shouldCellUpdate | Control cell render logic | `(record, prevRecord) => boolean` | |
| showSorterTooltip | Show tooltip on header | `boolean \| TooltipProps` | `true` |
| sortDirections | Supported sort way | `SortOrder[]` | `['ascend', 'descend']` |
| sorter | Sort function | `boolean \| CompareFn<RecordType>` | |
| sortOrder | Controlled sorted value | `SortOrder` | |
| title | Title of this column | `React.ReactNode` | |
| width | Width of this column | `string \| number` | |

## Usage Examples

### Table with Pagination

```typescript
import { Table } from '@eightfold.ai/octuple';

function PaginatedTable() {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' }
  ];

  const dataSource = Array.from({ length: 100 }, (_, i) => ({
    key: i,
    name: `User ${i}`,
    age: 20 + (i % 50),
    address: `Address ${i}`
  }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
      }}
    />
  );
}
```

### Table with Sorting

```typescript
import { Table } from '@eightfold.ai/octuple';
import type { ColumnsType } from '@eightfold.ai/octuple';

interface DataType {
  key: string;
  name: string;
  age: number;
  score: number;
}

function SortableTable() {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      defaultSortOrder: 'descend'
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score
    }
  ];

  const dataSource: DataType[] = [
    { key: '1', name: 'John', age: 32, score: 85 },
    { key: '2', name: 'Jane', age: 28, score: 92 },
    { key: '3', name: 'Bob', age: 35, score: 78 }
  ];

  return <Table columns={columns} dataSource={dataSource} />;
}
```

### Table with Row Selection

```typescript
import { Table } from '@eightfold.ai/octuple';
import type { TableRowSelection } from '@eightfold.ai/octuple';

function SelectableTable() {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
      console.log('Selected:', selectedKeys);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' }
  ];

  const dataSource = [
    { key: '1', name: 'John', age: 32 },
    { key: '2', name: 'Jane', age: 28 }
  ];

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
    />
  );
}
```

### Table with Actions Column

```typescript
import { Table, Button, ButtonVariant } from '@eightfold.ai/octuple';

function ActionsTable() {
  const handleEdit = (record: any) => {
    console.log('Edit:', record);
  };

  const handleDelete = (record: any) => {
    console.log('Delete:', record);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            text="Edit"
            variant={ButtonVariant.Secondary}
            onClick={() => handleEdit(record)}
          />
          <Button
            text="Delete"
            variant={ButtonVariant.Disruptive}
            onClick={() => handleDelete(record)}
          />
        </div>
      )
    }
  ];

  const dataSource = [
    { key: '1', name: 'John', email: 'john@example.com' },
    { key: '2', name: 'Jane', email: 'jane@example.com' }
  ];

  return <Table columns={columns} dataSource={dataSource} />;
}
```

### Expandable Table

```typescript
import { Table } from '@eightfold.ai/octuple';

function ExpandableTable() {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' }
  ];

  const dataSource = [
    { key: '1', name: 'John', age: 32, description: 'Software Engineer' },
    { key: '2', name: 'Jane', age: 28, description: 'Product Manager' }
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>{record.description}</p>
        )
      }}
    />
  );
}
```

## Accessibility

- Use semantic table markup
- Provide clear column headers
- Ensure keyboard navigation works (Tab, Arrow keys)
- Use appropriate ARIA labels for interactive elements
- Make sure row selection is keyboard accessible

## Best Practices

1. **Always Set rowKey**: Use unique identifier for each row
2. **TypeScript Types**: Define proper types for dataSource and columns
3. **Pagination for Large Datasets**: Always paginate tables with many rows
4. **Loading State**: Show loading spinner during data fetch
5. **Empty State**: Provide meaningful empty state message
6. **Action Columns**: Put actions in the last column
7. **Column Width**: Set fixed widths for action columns

## Common Mistakes

❌ **Don't** forget rowKey for dynamic data

```typescript
// Bad - may cause rendering issues
<Table columns={columns} dataSource={data} />
```

✅ **Do** provide unique rowKey

```typescript
// Good
<Table columns={columns} dataSource={data} rowKey="id" />
```

❌ **Don't** put too many columns

```typescript
// Bad - 15+ columns makes table unusable
<Table columns={manyColumns} dataSource={data} />
```

✅ **Do** limit columns and use expandable rows for details

```typescript
// Good
<Table
  columns={essentialColumns}
  dataSource={data}
  expandable={{
    expandedRowRender: (record) => <DetailView data={record} />
  }}
/>
```

## Related Components

- [Pagination](./Pagination.md) - For table pagination
- [Button](./Button.md) - For action columns
- [Form](./Form.md) - For inline editing
- [Empty](./Empty.md) - For empty states

