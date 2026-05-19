# DatePicker

DatePicker component for selecting dates with calendar interface.

## Import

```typescript
import { DatePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';
```

## API Reference

### Shared Picker Props

APIs shared by DatePicker and RangePicker.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| allowClear | Show the clear button | `boolean` | `true` | |
| autoComplete | Configure how to provide automated assistance in filling out form field values (MDN reference) | `string` | `off` | |
| autoFocus | Place focus on picker when component renders | `boolean` | `false` | |
| bordered | Determines if the picker has a border style | `boolean` | | |
| changeOnBlur | Triggers the onChange event on blur | `boolean` | `true` | >= 2.44.0 |
| classNames | The picker classNames | `string` | | |
| clearIcon | Custom clear icon | `React.ReactNode` | | |
| configContextProps | Configure how contextual props are consumed | `<interface>ConfigContextProps` | `{ noDisabledContext: false, noShapeContext: false, noSizeContext: false }` | >= 2.10.0 |
| defaultOpen | The picker is open by default | `boolean` | | |
| dateRender | Custom rendering function for date cells | `function(currentDate: dayjs, today: dayjs) => React.ReactNode` | | |
| defaultPickerValue | The default picker date | `DateType` | | |
| defaultValue | The default date | `DateType` | | |
| disabled | The DatePicker disabled state | `boolean` | `false` | |
| disabledDate | Specify a date that may not be selected | `(currentDate: dayjs) => boolean` | | |
| disabledTime | Specify time that may not be selected | `(date: EventValue<DateType>, type: RangeType) => DisabledTimes` | | |
| dropdownClassNames | Custom classnames of the dropdown | `string` | | |
| dropdownAlign | The dropdown alignment | `<interface>AlignType` | | |
| format | To set the date format, refer to either [momentjs](https://momentjs.com/docs/#/parsing/special-formats/) or [day.js](https://day.js.org/docs/en/plugin/custom-parse-format) | `string \| CustomFormat<DateType> \| (string \| CustomFormat<DateType>)[]` | | |
| formItemInput | The picker is a form item | `boolean` | | |
| getPopupContainer | Gets the container of the surface UI. The default is a div element child of body | `(node: HTMLElement) => HTMLElement` | | |
| id | The picker id | `string` | | |
| inputReadOnly | Make input readOnly to avoid popup keyboard in mobile | `boolean` | | |
| inputRender | The input render method | `(props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactNode` | | |
| locale | Localization configuration | `PickerLocale` | `enUS` | |
| mode | The picker partial mode | `<"time" \| "date" \| "week" \| "month" \| "quarter" \| "year" \| "decade">PartialMode` | | |
| monthCellRender | Custom month cell content render method | `<(currentDate: DateType, locale: Locale) => React.ReactNode>MonthCellRender<DateType>` | | |
| name | The picker aria name | `string` | | |
| nextIcon | The custom next icon | `IconName` | | |
| nowButtonProps | The 'Now' button props | `ButtonProps` | | >= 2.44.0 |
| okButtonProps | The 'OK' button props | `ButtonProps` | | >= 2.44.0 |
| onBlur | Callback executes on picker blur event | `React.FocusEventHandler<HTMLInputElement>` | | |
| onChange | Callback executed when the selected time is changing | `(value: DateType \| null, dateString: string) => void` | | |
| onClick | Callback executes on picker click event | `React.MouseEventHandler<HTMLDivElement>` | | |
| onContextMenu | Callback executes on picker contextual menu event | `React.MouseEventHandler<HTMLDivElement>` | | |
| onFocus | Callback executes on picker focus event | `React.FocusEventHandler<HTMLInputElement>` | | |
| onKeyDown | Callback executes on picker key down event | `(event: React.KeyboardEvent<HTMLInputElement>, preventDefault: () => void) => void` | | |
| onMouseDown | Callback executes on picker mouse down event | `React.MouseEventHandler<HTMLDivElement>` | | |
| onMouseEnter | Callback executes on picker mouse enter event | `React.MouseEventHandler<HTMLDivElement>` | | |
| onMouseLeave | Callback executes on picker mouse leave event | `React.MouseEventHandler<HTMLDivElement>` | | |
| onMouseUp | Callback executes on picker mouse up event | `React.MouseEventHandler<HTMLDivElement>` | | |
| onOpenChange | Callback when the popup calendar is opened or closed | `(open: boolean) => void` | | |
| onPartialChange | Callback when partial is changed | `(mode: PartialMode \| null, viewValue: DateType) => void` | | |
| open | The open state of the picker | `boolean` | | |
| partialRender | Custom partial render | `(originPartial: React.ReactNode) => React.ReactNode` | | |
| placeholder | The placeholder text of the input | `string` | `Select [date \| week \| month \| quarter \| year]` | |
| picker | The picker type | `date \| week \| month \| quarter \| year` | `date` | |
| popupPlacement | The picker dropdown placement | `<"bottomLeft" \| "bottomRight" \| "topLeft" \| "topRight">DataPickerPlacement` | | |
| popupStyle | The picker dropdown style | `React.CSSProperties` | | |
| prevIcon | The custom previous icon | `IconName` | | |
| readonly | The picker is readonly | `boolean` | `false` | >= 2.47.0 |
| readonlyIcon | The custom readonly icon | `React.ReactNode` | | >= 2.47.0 |
| renderExtraFooter | Renders extra footer in the partial | `(mode: PartialMode) => React.ReactNode` | | |
| role | The picker aria role | `string` | | |
| shape | The picker shape | `<enum>DatePickerShape \| <enum>Shape` | | |
| showNow | Show 'Now' button in partial when `showTime` is set | `boolean` | `true` | >= 2.44.0 |
| showOk | Show the 'OK' button | `boolean` | `true` | >= 2.44.0 |
| showToday | Show the 'Today' button | `boolean` | `true` | >= 2.44.0 |
| size | The picker size | `<enum>DatePickerSize \| <enum>Size` | | |
| status | The picker validation status | `<"" \| "success" \| "warning" \| "error" \| "validating">InputStatus` | | |
| style | The picker custom input style | `React.CSSProperties` | | |
| suffixIcon | The custom suffix icon | `React.ReactNode` | | |
| superNextIcon | The custom super next icon | `IconName` | | |
| superPrevIcon | The custom super prev icon | `IconName` | | |
| tabIndex | The picker tab index | `number` | | |
| todayActive | The current day appears to be active | `boolean` | `true` | >= 2.44.0 |
| todayButtonProps | The 'Today' button props | `ButtonProps` | | >= 2.44.0 |

### Shared Methods

| Method | Description | Type |
|--------|-------------|------|
| blur | Remove focus | `() => void` |
| focus | Get focus | `() => void` |

## Usage Examples

### Basic DatePicker

```typescript
import { DatePicker } from '@eightfold.ai/octuple';
import dayjs, { Dayjs } from 'dayjs';

function MyComponent() {
  const [date, setDate] = React.useState<Dayjs | null>(null);

  return (
    <DatePicker
      value={date}
      onChange={(value) => setDate(value)}
      placeholder="Select date"
    />
  );
}
```

### DatePicker with Format

```typescript
import { DatePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';

function BirthdayPicker() {
  const [birthday, setBirthday] = React.useState(null);

  return (
    <DatePicker
      value={birthday}
      onChange={(value, dateString) => {
        setBirthday(value);
        console.log('Selected:', dateString);
      }}
      format="YYYY-MM-DD"
      placeholder="Select birthday"
    />
  );
}
```

### DatePicker in Form

```typescript
import { Form, DatePicker } from '@eightfold.ai/octuple';

function RegistrationForm() {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Date of Birth"
        name="birthday"
        rules={[{ required: true, message: 'Please select your birthday' }]}
      >
        <DatePicker placeholder="Select date" />
      </Form.Item>
    </Form>
  );
}
```

### Week/Month/Year Picker

```typescript
import { DatePicker } from '@eightfold.ai/octuple';

function VariousPickers() {
  return (
    <>
      <DatePicker picker="week" placeholder="Select week" />
      <DatePicker picker="month" placeholder="Select month" />
      <DatePicker picker="quarter" placeholder="Select quarter" />
      <DatePicker picker="year" placeholder="Select year" />
    </>
  );
}
```

### Disabled Dates

```typescript
import { DatePicker } from '@eightfold.ai/octuple';
import dayjs from 'dayjs';

function FutureDateOnly() {
  const disablePastDates = (current: dayjs.Dayjs) => {
    // Disable all dates before today
    return current && current < dayjs().startOf('day');
  };

  return (
    <DatePicker
      disabledDate={disablePastDates}
      placeholder="Select future date"
    />
  );
}
```

## Accessibility

- Always provide a `placeholder` for the input
- Use `ariaLabel` or associate with a `Form.Item` label
- Keyboard navigation: Tab to focus, Space/Enter to open, Arrow keys to navigate dates
- Ensure date format is clearly communicated to users
- Use `readonly` prop instead of `disabled` when date should be visible but not editable

## Best Practices

1. **Use dayjs for Date Handling**: Octuple's DatePicker works best with dayjs
2. **Provide Format**: Always specify the date format for clarity
3. **Disable Invalid Dates**: Use `disabledDate` to prevent invalid selections
4. **Show Today Button**: Keep `showToday` enabled for quick date selection
5. **Form Integration**: Always wrap in `Form.Item` when used in forms

## Common Mistakes

❌ **Don't** use JavaScript Date objects directly

```typescript
// Bad
<DatePicker value={new Date()} />
```

✅ **Do** use dayjs objects

```typescript
// Good
import dayjs from 'dayjs';
<DatePicker value={dayjs()} />
```

❌ **Don't** forget to handle null values

```typescript
// Bad - will crash if user clears the date
<DatePicker onChange={(value) => value.format('YYYY-MM-DD')} />
```

✅ **Do** check for null

```typescript
// Good
<DatePicker onChange={(value) => value ? value.format('YYYY-MM-DD') : null} />
```

## Related Components

- [RangePicker](./RangePicker.md) - For selecting date ranges
- [TimePicker](./TimePicker.md) - For time selection
- [Form](./Form.md) - For form integration

