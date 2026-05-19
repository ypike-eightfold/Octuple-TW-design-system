# RangePicker

RangePicker component for selecting date ranges with calendar interface.

## Import

```typescript
import { RangePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';
```

## API Reference

### RangePicker Props

RangePicker extends DatePicker and inherits all [Shared Picker Props](./DatePicker.md#shared-picker-props).

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| ranges | The preset ranges for quick selection | `Record<string, \| Exclude<RangeValue<DateType>, null> \| (() => Exclude<RangeValue<DateType>, null>)>` | | |
| readonly | The range picker is readonly | `boolean \| [boolean, boolean]` | `false` | >= 2.47.0 |
| separator | Custom separator between inputs | `React.ReactNode` | | |
| onCalendarChange | Callback executed when the start time or the end time of the range is changing | `(values: RangeValue<DateType>, formatString: [string, string], info: RangeInfo) => void` | | |

### Additional Date Range Picker Props (Time)

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| disabledTime | Specify time that may not be selected | `(date: EventValue<DateType>, type: RangeType) => DisabledTimes` | | |
| order | Order start and end time | `boolean` | `true` | |

## TypeScript Types

```typescript
type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;
type EventValue<DateType> = DateType | null;

interface RangeInfo {
  range: 'start' | 'end';
}

enum RangeType {
  Start = 'start',
  End = 'end'
}

interface DisabledTimes {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}
```

## Usage Examples

### Basic RangePicker

```typescript
import { RangePicker } from '@eightfold.ai/octuple';
import dayjs, { Dayjs } from 'dayjs';

function MyComponent() {
  const [dateRange, setDateRange] = React.useState<[Dayjs | null, Dayjs | null] | null>(null);

  return (
    <RangePicker
      value={dateRange}
      onChange={(values) => setDateRange(values)}
      placeholder={['Start date', 'End date']}
    />
  );
}
```

### RangePicker with Preset Ranges

```typescript
import { RangePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';

function DateRangeFilter() {
  const presetRanges = {
    'Today': [dayjs().startOf('day'), dayjs().endOf('day')],
    'This Week': [dayjs().startOf('week'), dayjs().endOf('week')],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last 7 Days': [dayjs().subtract(7, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(30, 'days'), dayjs()],
    'Last Quarter': [dayjs().subtract(3, 'months').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  };

  return (
    <RangePicker
      ranges={presetRanges}
      format="YYYY-MM-DD"
    />
  );
}
```

### RangePicker in Form

```typescript
import { Form, RangePicker } from '@eightfold.ai/octuple';

function ProjectForm() {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Project Duration"
        name="duration"
        rules={[{ required: true, message: 'Please select project duration' }]}
      >
        <RangePicker
          placeholder={['Start date', 'End date']}
          format="MMM DD, YYYY"
        />
      </Form.Item>
    </Form>
  );
}
```

### RangePicker with Disabled Dates

```typescript
import { RangePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';

function BookingDateRange() {
  // Disable dates before today and after 1 year
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && (
      current < dayjs().startOf('day') ||
      current > dayjs().add(1, 'year')
    );
  };

  return (
    <RangePicker
      disabledDate={disabledDate}
      placeholder={['Check-in', 'Check-out']}
    />
  );
}
```

### RangePicker with Custom Separator

```typescript
import { RangePicker } from '@eightfold.ai/octuple';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';

function CustomRangePicker() {
  return (
    <RangePicker
      separator={<Icon path={mdiArrowRight} size={0.7} />}
      format="YYYY-MM-DD"
    />
  );
}
```

## Accessibility

- Provide clear placeholder text for both start and end dates
- Use `ariaLabel` or Form.Item label for context
- Keyboard navigation: Tab between inputs, Space/Enter to open, Arrow keys to navigate
- Ensure users understand the date range format
- Use `readonly` instead of `disabled` when appropriate

## Best Practices

1. **Provide Preset Ranges**: Use `ranges` prop for common date ranges (Today, This Week, etc.)
2. **Clear Placeholders**: Use descriptive placeholders like ['Start date', 'End date']
3. **Validate Range**: Ensure end date is after start date
4. **Disable Invalid Dates**: Use `disabledDate` to prevent illogical selections
5. **Format Consistency**: Keep date format consistent throughout your app
6. **Show Useful Ranges**: Only include preset ranges that make sense for your use case

## Common Mistakes

❌ **Don't** allow illogical date ranges

```typescript
// Bad - no validation
<RangePicker />
```

✅ **Do** validate that end date is after start date

```typescript
// Good
<RangePicker
  onCalendarChange={(values) => {
    if (values && values[0] && values[1] && values[1] < values[0]) {
      // Handle error or auto-correct
    }
  }}
/>
```

❌ **Don't** forget to handle null values

```typescript
// Bad
<RangePicker onChange={(values) => values[0].format()} />
```

✅ **Do** check for null/undefined

```typescript
// Good
<RangePicker onChange={(values) => {
  if (values && values[0] && values[1]) {
    const start = values[0].format('YYYY-MM-DD');
    const end = values[1].format('YYYY-MM-DD');
  }
}} />
```

## Related Components

- [DatePicker](./DatePicker.md) - For single date selection
- [TimePicker](./TimePicker.md) - For time selection
- [Form](./Form.md) - For form integration

