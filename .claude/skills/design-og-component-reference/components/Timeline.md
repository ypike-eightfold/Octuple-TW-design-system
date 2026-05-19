# Timeline

Timeline component for displaying events in chronological order (extends Stepper).

## Import

```typescript
import { Timeline } from '@eightfold.ai/octuple';
```

## API Reference

### Timeline Props

Timeline extends Stepper with additional timeline-specific props.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| lineStyle | The optional Stepper line style. Options: 'dash', 'dot', 'solid' | `<enum>StepperLineStyle` | `StepperLineStyle.Dash` | |
| showActiveStepIndex | Show active Step index. Use when step is an icon, but an index is desired for the active Step | `boolean` | `false` | |
| size | The Stepper size | `<enum>StepperSize` | `StepperSize.Medium` | |
| status | The validation status | `StepperValidationStatus` | | |
| theme | Theme of the Stepper | `StepperThemeName` | | |
| variant | The Stepper variant | `<enum>StepperVariant` | `StepperVariant.Timeline` | |

For complete inherited props, see [Stepper](./Stepper.md).

## TypeScript Enums

```typescript
enum StepperLineStyle {
  Dash = 'dash',
  Dot = 'dot',
  Solid = 'solid'
}

enum StepperSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large'
}

enum StepperVariant {
  Default = 'default',
  Timeline = 'timeline'
}
```

## Usage Examples

### Basic Timeline

```typescript
import { Timeline } from '@eightfold.ai/octuple';

function BasicTimeline() {
  const items = [
    { title: 'Application Submitted', description: 'May 1, 2024' },
    { title: 'Under Review', description: 'May 5, 2024' },
    { title: 'Interview Scheduled', description: 'May 10, 2024' },
    { title: 'Offer Extended', description: 'Pending' }
  ];

  return (
    <Timeline
      current={2}
      items={items}
    />
  );
}
```

### Timeline with Line Styles

```typescript
import { Timeline, StepperLineStyle } from '@eightfold.ai/octuple';

function StyledTimeline() {
  const events = [
    { title: 'Order Placed', description: '10:00 AM' },
    { title: 'Order Confirmed', description: '10:15 AM' },
    { title: 'Out for Delivery', description: '2:30 PM' }
  ];

  return (
    <>
      <Timeline items={events} lineStyle={StepperLineStyle.Solid} />
      <Timeline items={events} lineStyle={StepperLineStyle.Dash} />
      <Timeline items={events} lineStyle={StepperLineStyle.Dot} />
    </>
  );
}
```

### Timeline with Custom Icons

```typescript
import { Timeline } from '@eightfold.ai/octuple';
import { mdiCheckCircle, mdiClockOutline, mdiAlertCircle } from '@mdi/js';

function IconTimeline() {
  const milestones = [
    {
      title: 'Project Started',
      description: 'January 1, 2024',
      icon: mdiCheckCircle
    },
    {
      title: 'Development Phase',
      description: 'In Progress',
      icon: mdiClockOutline
    },
    {
      title: 'Testing',
      description: 'Pending',
      icon: mdiAlertCircle
    }
  ];

  return (
    <Timeline
      current={1}
      items={milestones}
    />
  );
}
```

### Timeline with Status

```typescript
import { Timeline } from '@eightfold.ai/octuple';

function StatusTimeline() {
  const steps = [
    { title: 'Completed Step', status: 'finish' },
    { title: 'Current Step', status: 'process' },
    { title: 'Upcoming Step', status: 'wait' },
    { title: 'Failed Step', status: 'error' }
  ];

  return (
    <Timeline
      current={1}
      items={steps}
    />
  );
}
```

### Activity Timeline

```typescript
import { Timeline } from '@eightfold.ai/octuple';

function ActivityTimeline() {
  const activities = [
    {
      title: 'User Login',
      description: 'John Doe logged in from New York',
      timestamp: '2 hours ago'
    },
    {
      title: 'Document Updated',
      description: 'Project proposal revised',
      timestamp: '5 hours ago'
    },
    {
      title: 'Comment Added',
      description: 'Jane Smith: "Looks good!"',
      timestamp: '1 day ago'
    },
    {
      title: 'File Uploaded',
      description: 'design-mockup.pdf',
      timestamp: '2 days ago'
    }
  ];

  return (
    <Timeline items={activities} />
  );
}
```

### Project Timeline

```typescript
import { Timeline, StepperLineStyle } from '@eightfold.ai/octuple';

function ProjectTimeline() {
  const projectPhases = [
    {
      title: 'Planning',
      description: 'Requirements gathering and analysis',
      duration: '2 weeks',
      status: 'finish'
    },
    {
      title: 'Design',
      description: 'UI/UX design and prototyping',
      duration: '3 weeks',
      status: 'finish'
    },
    {
      title: 'Development',
      description: 'Frontend and backend implementation',
      duration: '8 weeks',
      status: 'process'
    },
    {
      title: 'Testing',
      description: 'QA and bug fixes',
      duration: '2 weeks',
      status: 'wait'
    },
    {
      title: 'Deployment',
      description: 'Production release',
      duration: '1 week',
      status: 'wait'
    }
  ];

  return (
    <Timeline
      current={2}
      items={projectPhases}
      lineStyle={StepperLineStyle.Solid}
    />
  );
}
```

### Timeline Sizes

```typescript
import { Timeline, StepperSize } from '@eightfold.ai/octuple';

function SizedTimelines() {
  const items = [
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' }
  ];

  return (
    <>
      <Timeline items={items} size={StepperSize.Small} />
      <Timeline items={items} size={StepperSize.Medium} />
      <Timeline items={items} size={StepperSize.Large} />
    </>
  );
}
```

### Interactive Timeline

```typescript
import { Timeline } from '@eightfold.ai/octuple';

function InteractiveTimeline() {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    { title: 'Step 1', description: 'First step' },
    { title: 'Step 2', description: 'Second step' },
    { title: 'Step 3', description: 'Third step' }
  ];

  return (
    <div>
      <Timeline
        current={currentStep}
        items={steps}
        onChange={(current) => setCurrentStep(current)}
      />
      <div style={{ marginTop: '16px' }}>
        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
          Previous
        </button>
        <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## Accessibility

- Provide clear titles for each timeline step
- Use descriptive descriptions for context
- Ensure keyboard navigation works
- Use appropriate status indicators
- Make interactive timelines keyboard accessible

## Best Practices

1. **Chronological Order**: Display events in time order
2. **Clear Titles**: Use descriptive step titles
3. **Descriptions**: Provide additional context
4. **Status Indicators**: Show completion status visually
5. **Line Style**: Choose appropriate line style for context
6. **Consistent Sizing**: Use consistent size throughout
7. **Timestamps**: Include time information when relevant

## Common Mistakes

❌ **Don't** use timeline without items

```typescript
// Bad - no items
<Timeline current={0} />
```

✅ **Do** provide timeline items

```typescript
// Good
<Timeline
  current={0}
  items={[{ title: 'Event 1' }, { title: 'Event 2' }]}
/>
```

❌ **Don't** forget to show progress

```typescript
// Bad - no current step indicator
<Timeline items={items} />
```

✅ **Do** indicate current step

```typescript
// Good
<Timeline current={2} items={items} />
```

❌ **Don't** mix timeline variants

```typescript
// Bad - inconsistent display
<Timeline variant="default" />
<Timeline variant="timeline" />
```

✅ **Do** use consistent variant

```typescript
// Good
<Timeline variant={StepperVariant.Timeline} />
```

## Related Components

- [Stepper](./Stepper.md) - Base component for Timeline
- [Step](./Step.md) - Individual step component
- [Progress](./Progress.md) - For progress indication

