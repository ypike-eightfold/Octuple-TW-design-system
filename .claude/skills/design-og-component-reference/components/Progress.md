# Progress

Progress component for displaying progress of operations and tasks.

## Import

```typescript
import { Progress } from '@eightfold.ai/octuple';
```

## API Reference

### Progress Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| type | To set the type | `'line' \| 'circle' \| 'dashboard'` | `'line'` | |
| percent | To set the completion percentage | `number` | `0` | |
| format | Template function of the content | `(percent, successPercent) => React.ReactNode` | `(percent) => percent + '%'` | |
| status | To set the status of the Progress | `'success' \| 'exception' \| 'normal' \| 'active'` | | |
| showInfo | Whether to display the progress value and the status icon | `boolean` | `true` | |
| strokeColor | The color of progress bar | `string \| { from: string; to: string; direction: string }` | | |
| strokeLinecap | To set the style of the progress linecap | `'round' \| 'square'` | `'round'` | |
| strokeWidth | To set the width of the progress bar | `number` | `8` (line) / `6` (circle/dashboard) | |
| success | Configs of successfully progress bar | `{ percent: number, strokeColor: string }` | | |
| trailColor | The color of unfilled part | `string` | | |
| width | To set the canvas width of the circular progress | `number` | `120` | |
| gapDegree | The gap degree of half circle (only for dashboard) | `number` | `75` | |
| gapPosition | The gap position (only for circle/dashboard) | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | |
| size | Progress size | `'default' \| 'small'` | `'default'` | |
| steps | The total step count | `number` | | |
| classNames | The Progress class names | `string` | | |
| style | The Progress custom styles | `React.CSSProperties` | | |

## Usage Examples

### Line Progress (Default)

```typescript
import { Progress } from '@eightfold.ai/octuple';

function LineProgress() {
  const [percent, setPercent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return <Progress percent={percent} />;
}
```

### Progress with Status

```typescript
import { Progress } from '@eightfold.ai/octuple';

function StatusProgress() {
  return (
    <>
      <Progress percent={30} status="active" />
      <Progress percent={50} status="normal" />
      <Progress percent={70} status="exception" />
      <Progress percent={100} status="success" />
    </>
  );
}
```

### Circle Progress

```typescript
import { Progress } from '@eightfold.ai/octuple';

function CircleProgress() {
  return (
    <>
      <Progress type="circle" percent={75} />
      <Progress type="circle" percent={100} status="success" />
      <Progress type="circle" percent={70} status="exception" />
    </>
  );
}
```

### Dashboard Progress

```typescript
import { Progress } from '@eightfold.ai/octuple';

function DashboardProgress() {
  return (
    <Progress
      type="dashboard"
      percent={75}
      gapDegree={30}
    />
  );
}
```

### Custom Color

```typescript
import { Progress } from '@eightfold.ai/octuple';

function ColorProgress() {
  return (
    <>
      <Progress percent={60} strokeColor="#52c41a" />
      <Progress
        percent={80}
        strokeColor={{
          from: '#108ee9',
          to: '#87d068',
          direction: 'to right'
        }}
      />
      <Progress
        type="circle"
        percent={90}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068'
        }}
      />
    </>
  );
}
```

### Progress with Steps

```typescript
import { Progress } from '@eightfold.ai/octuple';

function StepProgress() {
  return (
    <>
      <Progress percent={50} steps={5} />
      <Progress percent={30} steps={5} strokeColor="#1890ff" />
      <Progress percent={100} steps={5} status="success" />
    </>
  );
}
```

### Custom Format

```typescript
import { Progress } from '@eightfold.ai/octuple';

function CustomFormatProgress() {
  return (
    <>
      <Progress
        percent={75}
        format={(percent) => `${percent} Days`}
      />
      <Progress
        type="circle"
        percent={100}
        format={() => 'Done'}
      />
    </>
  );
}
```

### Progress in Card

```typescript
import { Progress, Card } from '@eightfold.ai/octuple';

function ProgressCard() {
  return (
    <Card>
      <h4>Project Progress</h4>
      <Progress percent={65} />
      <p>Task completion: 13 of 20</p>
    </Card>
  );
}
```

### Dynamic Progress

```typescript
import { Progress, Button, ButtonVariant } from '@eightfold.ai/octuple';

function DynamicProgress() {
  const [percent, setPercent] = React.useState(0);

  const increase = () => {
    setPercent((prev) => Math.min(prev + 10, 100));
  };

  const decline = () => {
    setPercent((prev) => Math.max(prev - 10, 0));
  };

  return (
    <>
      <Progress percent={percent} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button text="-" onClick={decline} variant={ButtonVariant.Secondary} />
        <Button text="+" onClick={increase} variant={ButtonVariant.Primary} />
      </div>
    </>
  );
}
```

## Accessibility

- Progress should have appropriate ARIA attributes
- Provide text alternative for screen readers
- Use status prop to indicate success/error states
- Consider adding `aria-label` for context
- Ensure sufficient color contrast

## Best Practices

1. **Show Progress**: Always display progress for long-running operations
2. **Use Appropriate Type**: Line for horizontal, circle for compact spaces
3. **Status Indication**: Use status prop for success/error states
4. **Custom Format**: Provide meaningful progress text
5. **Color Contrast**: Ensure progress bar is visible against background
6. **Indeterminate vs Determinate**: Use active status for unknown duration

## Common Mistakes

❌ **Don't** use progress without context

```typescript
// Bad - user doesn't know what's progressing
<Progress percent={50} />
```

✅ **Do** provide context

```typescript
// Good
<div>
  <p>Uploading file...</p>
  <Progress percent={50} />
</div>
```

❌ **Don't** forget to handle completion

```typescript
// Bad - progress stays at 100% forever
<Progress percent={100} />
```

✅ **Do** handle completion state

```typescript
// Good
{loading && <Progress percent={uploadProgress} />}
{!loading && <p>Upload complete!</p>}
```

❌ **Don't** use circle progress for very small percentages

```typescript
// Bad - hard to see at low percentages
<Progress type="circle" percent={2} />
```

✅ **Do** use line progress for better visibility

```typescript
// Good
<Progress type="line" percent={2} />
```

## Related Components

- [Spinner](./Spinner.md) - For indeterminate loading states
- [Slider](./Slider.md) - For user input (similar visual)
- [Card](./Card.md) - For containing progress displays

