# TimePicker

TimePicker component for selecting time with dropdown interface.

## Import

```typescript
import { TimePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
```

## API Reference

### SharedTimeProps

Time-specific props for TimePicker (extends [DatePicker](./DatePicker.md)).

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| format | To set the date format | `string \| CustomFormat<DateType> \| (string \| CustomFormat<DateType>)[]` | | |
| showNow | Show 'Now' button in partial when `showTime` is set | `boolean` | | |
| showHour | Display as 12 hour format, with default format `h:mm:ss` | `boolean` | `false` | |
| showMinute | Enables time selection partial | `boolean` | | |
| showSecond | Set default time of selected date | `boolean` | | |
| use12Hours | Display as 12 hour format, with default format `h:mm:ss` | `boolean` | `false` | |
| hourStep | Interval between hours in picker | `number` | `1` | |
| minuteStep | Interval between minutes in picker | `number` | `1` | |
| secondStep | Interval between seconds in picker | `number` | `1` | |
| hideDisabledOptions | Hide disabled time options | `boolean` | | |
| defaultValue | The default picker date | `DateType` | | |
| disabledTime | Specify time that may not be selected | `(date: DateType) => DisabledTimes` | | |

### DisabledTime Type

```typescript
interface DisabledTime {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}
```

### TimePicker Inherits

TimePicker inherits all props from [DatePicker](./DatePicker.md) including:
- allowClear, autoComplete, autoFocus, bordered
- placeholder, size, status, disabled
- onChange, onBlur, onFocus
- All shared picker props

## Usage Examples

### Basic TimePicker

```typescript
import { TimePicker } from '@eightfold.ai/octuple';
import dayjs, { Dayjs } from 'dayjs';

function MyComponent() {
  const [time, setTime] = React.useState<Dayjs | null>(dayjs('13:30:56', 'HH:mm:ss'));

  return (
    <TimePicker
      value={time}
      onChange={(value) => setTime(value)}
      placeholder="Select time"
    />
  );
}
```

### 12-Hour Format

```typescript
import { TimePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';

function AppointmentTime() {
  return (
    <TimePicker
      use12Hours
      format="h:mm A"
      placeholder="Select time"
    />
  );
}
```

### Time Intervals

```typescript
import { TimePicker } from '@eightfold.ai/octuple';

function SchedulePicker() {
  return (
    <TimePicker
      minuteStep={15}  // 15-minute intervals
      secondStep={0}   // Hide seconds
      format="HH:mm"
      placeholder="Select time"
    />
  );
}
```

### Disable Specific Times

```typescript
import { TimePicker } from '@eightfold.ai/octuple';

function BusinessHoursOnly() {
  const disableNonBusinessHours = () => ({
    disabledHours: () => {
      // Disable hours before 9 AM and after 5 PM
      return [...Array(9).keys(), ...Array(7).keys().map(i => i + 18)];
    },
    disabledMinutes: (selectedHour: number) => {
      // No minute restrictions
      return [];
    }
  });

  return (
    <TimePicker
      disabledTime={disableNonBusinessHours}
      format="HH:mm"
      placeholder="Business hours only"
    />
  );
}
```

### TimePicker in Form

```typescript
import { Form, TimePicker } from '@eightfold.ai/octuple';

function MeetingForm() {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Meeting Time"
        name="meetingTime"
        rules={[{ required: true, message: 'Please select meeting time' }]}
      >
        <TimePicker
          format="HH:mm"
          minuteStep={30}
          placeholder="Select time"
        />
      </Form.Item>
    </Form>
  );
}
```

## Accessibility

- Provide clear `placeholder` text
- Use `ariaLabel` or Form.Item label
- Keyboard navigation: Tab to focus, Space/Enter to open, Arrow keys to navigate
- Ensure time format is clearly communicated (12h vs 24h)
- Use `readonly` instead of `disabled` when time should be visible but not editable

## Best Practices

1. **Use Appropriate Format**: Match your locale (12h for US, 24h for EU)
2. **Set Reasonable Intervals**: Use `minuteStep` to simplify selection (15 or 30 minutes)
3. **Hide Unnecessary Fields**: If seconds aren't needed, hide them with format
4. **Disable Invalid Times**: Use `disabledTime` for business rules
5. **Default to Current Time**: Consider pre-filling with current time for convenience

## Common Mistakes

❌ **Don't** show seconds for appointment times

```typescript
// Bad - too granular for most use cases
<TimePicker format="HH:mm:ss" />
```

✅ **Do** use appropriate granularity

```typescript
// Good
<TimePicker format="HH:mm" minuteStep={15} />
```

❌ **Don't** forget to extend dayjs with customParseFormat

```typescript
// Bad - will have parsing issues
import dayjs from 'dayjs';
```

✅ **Do** extend dayjs with the plugin

```typescript
// Good
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
```

## Related Components

- [DatePicker](./DatePicker.md) - For date selection
- [RangePicker](./RangePicker.md) - For date range selection
- [Form](./Form.md) - For form integration

