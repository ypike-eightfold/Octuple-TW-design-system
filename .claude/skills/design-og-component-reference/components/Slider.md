# Slider

Slider component for selecting a numeric value from a range.

## Import

```typescript
import { Slider } from '@eightfold.ai/octuple';
```

## API Reference

### Slider Props

Slider extends Slider Input and shares base props of HTMLInputElement. `onChange` and `value` types are omitted.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| showLabels | Indicates if the value should be displayed under the Slider | `boolean` | `true` | |
| showMarkers | Indicates if marker segments should be displayed on the Slider track | `boolean` | `false` | |

### Slider Input Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| activeDotStyle | Custom active dot style | `React.CSSProperties \| ((dotValue: number) => React.CSSProperties)` | | 2.20.0 |
| allowDisabledFocus | Allows focus on the Slider when it's disabled | `boolean` | `false` | |
| ariaLabel | The Slider aria label text | `string` | | |
| autoFocus | The Slider autoFocus attribute | `boolean` | `false` | |
| classNames | Custom classnames of the Slider | `string` | | |
| configContextProps | Configure how contextual props are consumed by enabling or disabling contextually set properties | `<interface>ConfigContextProps` | `{ noDisabledContext: false, noSizeContext: false }` | 2.10.0 |
| containerClassNames | Custom class names of the component container | `string` | | 2.20.0 |
| disabled | The Slider disabled state | `boolean` | `false` | |
| dots | Enable Slider step dots | `boolean` | `false` | 2.20.0 |
| dotClassNames | Slider dot custom class names | `string` | | 2.28.1 |
| dotStyle | Custom dot style | `React.CSSProperties \| ((dotValue: number) => React.CSSProperties)` | | 2.20.0 |
| formItemInput | The Slider is a form item | `boolean` | `false` | |
| hideMax | Hide the maximum value of the Slider | `boolean` | `false` | |
| hideMin | Hide the minimum value of the Slider | `boolean` | `false` | |
| hideRail | Whether to hide the Slider rail | `boolean` | `false` | 2.28.1 |
| hideThumb | Whether to hide the Slider thumb until rail is clicked | `boolean` | `false` | 2.20.0 |
| hideTrack | Whether to hide the Slider track | `boolean` | `false` | 2.28.1 |
| hideValue | Hide the value(s) of the Slider | `boolean` | `false` | |
| id | The input id. NOTE: For range Slider, each input's id will have an index value added | `string` | | |
| included | Make effect when marks isn't null, true means containment and false means coordinative | `boolean` | `true` | 2.20.0 |
| labelPosition | Sets the Slider extremity label position | `SliderLabelPosition` | `'bottom'` | 2.20.0 |
| marks | Slider custom marks, type of key must be number, and must in closed interval [min, max], each mark may declare its own style | `Record<string \| number, React.ReactNode \| Marker>` | | 2.20.0 |
| max | The maximum value of the Slider | `number` | `100` | |
| maxLabel | The custom maximum value label of the Slider | `string \| string[]` | | |
| min | The minimum value of the Slider | `number` | `0` | |
| minLabel | The custom minimum value label of the Slider | `string` | | |
| name | The input name. NOTE: For range Slider, each input's name will have an index value added | `string` | | |
| onChange | The input onChange event handler | `(value: number \| number[]) => void` | | |
| railBorder | Whether to visually hide the Slider rail border | `boolean` | `true` | 2.42.0 |
| readonly | The Slider is read only | `boolean` | `false` | 2.20.0 |
| size | The Slider size | `SliderSize \| Size` | `SliderSize.Medium` | |
| step | Selected values must be a multiple of step | `number` | `1` | |
| tooltipContent | The Slider thumb tooltip content | `React.ReactNode \| React.ReactNode[]` | | 2.20.0 |
| tooltipProps | The tooltip props | `Omit<TooltipProps, 'content'>` | | 2.20.0 |
| trackBorder | Whether to visually hide the Slider track border | `boolean` | `true` | 2.42.0 |
| trackStatus | The Slider track status. Options: `success`, `warning`, and `error` | `<enum>SliderTrackStatus` | | |
| type | The type of Slider | `SliderType` | `'default'` | 2.20.0 |
| value | The current Slider value. Provide an array for range Slider | `number \| number[]` | | |
| valueLabel | The custom value label of the Slider | `string \| string[]` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLInputElement>` | | |

### Slider Marker

| Property | Description | Type |
|----------|-------------|------|
| label | Custom Marker label | `React.ReactNode` |
| style | Custom Marker style | `React.CSSProperties` |
| value | The step value of the marker | `number` |

## TypeScript Enums

```typescript
enum SliderType {
  Data = 'data',
  Default = 'default'
}

enum SliderSize {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

enum SliderTrackStatus {
  Error = 'error',
  Success = 'success',
  Warning = 'warning'
}
```

## Usage Examples

### Basic Slider

```typescript
import { Slider } from '@eightfold.ai/octuple';

function VolumeControl() {
  const [volume, setVolume] = React.useState(50);

  return (
    <Slider
      min={0}
      max={100}
      value={volume}
      onChange={(value) => setVolume(value as number)}
    />
  );
}
```

### Slider with Steps and Marks

```typescript
import { Slider } from '@eightfold.ai/octuple';

function RatingSlider() {
  const [rating, setRating] = React.useState(3);

  const marks = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5'
  };

  return (
    <Slider
      min={1}
      max={5}
      step={1}
      marks={marks}
      value={rating}
      onChange={(value) => setRating(value as number)}
      showMarkers
      dots
    />
  );
}
```

### Range Slider

```typescript
import { Slider } from '@eightfold.ai/octuple';

function PriceRangeFilter() {
  const [priceRange, setPriceRange] = React.useState([20, 80]);

  return (
    <Slider
      min={0}
      max={100}
      value={priceRange}
      onChange={(value) => setPriceRange(value as number[])}
      minLabel="$0"
      maxLabel="$100"
    />
  );
}
```

### Slider with Custom Labels

```typescript
import { Slider } from '@eightfold.ai/octuple';

function TemperatureSlider() {
  const [temp, setTemp] = React.useState(20);

  return (
    <Slider
      min={-10}
      max={40}
      value={temp}
      onChange={(value) => setTemp(value as number)}
      minLabel="Cold"
      maxLabel="Hot"
      valueLabel={`${temp}°C`}
    />
  );
}
```

### Slider with Status

```typescript
import { Slider, SliderTrackStatus } from '@eightfold.ai/octuple';

function ProgressSlider() {
  const [progress, setProgress] = React.useState(75);

  const getStatus = (value: number) => {
    if (value < 30) return SliderTrackStatus.Error;
    if (value < 70) return SliderTrackStatus.Warning;
    return SliderTrackStatus.Success;
  };

  return (
    <Slider
      min={0}
      max={100}
      value={progress}
      onChange={(value) => setProgress(value as number)}
      trackStatus={getStatus(progress)}
    />
  );
}
```

## Accessibility

- Ensure the slider has a clear label (use Form.Item or ariaLabel)
- Keyboard navigation: Tab to focus, Arrow Left/Right to adjust value
- Use appropriate `step` values for keyboard navigation
- Provide `minLabel` and `maxLabel` for context
- Consider showing current value for screen readers

## Best Practices

1. **Set Appropriate Steps**: Use `step` values that make sense for your range
2. **Show Labels**: Enable `showLabels` to display min/max/current values
3. **Use Marks for Discrete Values**: When there are specific meaningful points, use `marks`
4. **Provide Context**: Use `minLabel` and `maxLabel` to explain the range
5. **Enable Dots for Steps**: Use `dots` prop when step increments are important to visualize

## Common Mistakes

❌ **Don't** use slider for binary choices

```typescript
// Bad
<Slider min={0} max={1} step={1} />
```

✅ **Do** use Switch for on/off

```typescript
// Good
<Switch label="Enable feature" />
```

❌ **Don't** forget to handle array values for range sliders

```typescript
// Bad - will crash with range slider
<Slider value={[10, 20]} onChange={(value) => setSingle(value)} />
```

✅ **Do** check value type

```typescript
// Good
<Slider value={[10, 20]} onChange={(value) => {
  if (Array.isArray(value)) {
    setRange(value);
  }
}} />
```

## Related Components

- [Progress](./Progress.md) - For displaying progress (non-interactive)
- [Form](./Form.md) - For form integration

