# Step

Step component for individual steps within Stepper or Timeline (extends Stepper Step).

## Import

```typescript
import { Step } from '@eightfold.ai/octuple';
```

## API Reference

### Step Props

Step extends Stepper Step with additional customization options.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| nodeAriaLabelText | The Step custom 'Node' button aria label string | `string` | `'Node'` | |
| nodeIcon | The Step custom 'Node' button icon | `IconName` | | |
| size | The individual Step size. The default depends on the chosen variant | `StepSize` | `StepSize.Large` for Default, `StepSize.Small` for Timeline | |
| status | The validation status | `StepperValidationStatus` | | |
| theme | Theme of the Step | `StepperThemeName` | | |

For complete inherited props, see [Stepper](./Stepper.md).

## TypeScript Enums

```typescript
enum StepSize {
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

enum StepperValidationStatus {
  Error = 'error',
  Success = 'success',
  Warning = 'warning'
}
```

## Usage Examples

### Basic Step

```typescript
import { Stepper, Step } from '@eightfold.ai/octuple';

function BasicSteps() {
  return (
    <Stepper current={1}>
      <Step title="Step 1" description="First step" />
      <Step title="Step 2" description="Second step" />
      <Step title="Step 3" description="Third step" />
    </Stepper>
  );
}
```

### Step with Custom Icon

```typescript
import { Stepper, Step } from '@eightfold.ai/octuple';
import { mdiAccount, mdiEmail, mdiCheck } from '@mdi/js';

function IconSteps() {
  return (
    <Stepper current={1}>
      <Step
        title="Account Info"
        description="Enter your details"
        nodeIcon={mdiAccount}
      />
      <Step
        title="Email Verification"
        description="Verify your email"
        nodeIcon={mdiEmail}
      />
      <Step
        title="Complete"
        description="All done!"
        nodeIcon={mdiCheck}
      />
    </Stepper>
  );
}
```

### Step with Status

```typescript
import { Stepper, Step, StepperValidationStatus } from '@eightfold.ai/octuple';

function StatusSteps() {
  return (
    <Stepper current={2}>
      <Step
        title="Validation Passed"
        status={StepperValidationStatus.Success}
      />
      <Step
        title="Warning Detected"
        status={StepperValidationStatus.Warning}
      />
      <Step
        title="Error Found"
        status={StepperValidationStatus.Error}
      />
    </Stepper>
  );
}
```

### Step Sizes

```typescript
import { Stepper, Step, StepSize } from '@eightfold.ai/octuple';

function SizedSteps() {
  return (
    <>
      <Stepper current={1}>
        <Step title="Small" size={StepSize.Small} />
        <Step title="Small" size={StepSize.Small} />
      </Stepper>
      
      <Stepper current={1}>
        <Step title="Medium" size={StepSize.Medium} />
        <Step title="Medium" size={StepSize.Medium} />
      </Stepper>
      
      <Stepper current={1}>
        <Step title="Large" size={StepSize.Large} />
        <Step title="Large" size={StepSize.Large} />
      </Stepper>
    </>
  );
}
```

### Form Steps with Validation

```typescript
import { Stepper, Step, StepperValidationStatus } from '@eightfold.ai/octuple';

function FormSteps() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      return StepperValidationStatus.Success;
    }
    if (stepIndex === currentStep) {
      return undefined;
    }
    return undefined;
  };

  return (
    <Stepper current={currentStep}>
      <Step
        title="Personal Information"
        description="Name, email, phone"
        status={getStepStatus(0)}
      />
      <Step
        title="Address"
        description="Street, city, zip code"
        status={getStepStatus(1)}
      />
      <Step
        title="Payment"
        description="Credit card information"
        status={getStepStatus(2)}
      />
      <Step
        title="Review"
        description="Confirm your order"
        status={getStepStatus(3)}
      />
    </Stepper>
  );
}
```

### Clickable Steps

```typescript
import { Stepper, Step } from '@eightfold.ai/octuple';

function ClickableSteps() {
  const [current, setCurrent] = React.useState(0);

  return (
    <Stepper current={current} onChange={setCurrent}>
      <Step title="Step 1" description="First step" />
      <Step title="Step 2" description="Second step" />
      <Step title="Step 3" description="Third step" />
      <Step title="Step 4" description="Fourth step" />
    </Stepper>
  );
}
```

### Step with Aria Labels

```typescript
import { Stepper, Step } from '@eightfold.ai/octuple';

function AccessibleSteps() {
  return (
    <Stepper current={1}>
      <Step
        title="Account Setup"
        nodeAriaLabelText="Account setup node"
        description="Create your account"
      />
      <Step
        title="Profile Details"
        nodeAriaLabelText="Profile details node"
        description="Add your information"
      />
      <Step
        title="Preferences"
        nodeAriaLabelText="Preferences node"
        description="Set your preferences"
      />
    </Stepper>
  );
}
```

## Accessibility

- Provide clear titles for each step
- Use `nodeAriaLabelText` for screen readers
- Ensure keyboard navigation works (Tab, Enter, Arrow keys)
- Use status indicators for validation states
- Make clickable steps keyboard accessible

## Best Practices

1. **Clear Titles**: Use descriptive step titles
2. **Descriptions**: Provide helpful step descriptions
3. **Custom Icons**: Use icons for visual clarity
4. **Status Indicators**: Show validation status
5. **Aria Labels**: Provide accessibility labels
6. **Consistent Sizing**: Use consistent size across steps
7. **Logical Order**: Arrange steps in logical sequence

## Common Mistakes

❌ **Don't** use steps outside of Stepper

```typescript
// Bad - steps need Stepper context
<Step title="Step 1" />
<Step title="Step 2" />
```

✅ **Do** wrap steps in Stepper

```typescript
// Good
<Stepper current={0}>
  <Step title="Step 1" />
  <Step title="Step 2" />
</Stepper>
```

❌ **Don't** forget to provide titles

```typescript
// Bad - no titles
<Stepper current={0}>
  <Step description="First step" />
</Stepper>
```

✅ **Do** provide clear titles

```typescript
// Good
<Stepper current={0}>
  <Step title="Step 1" description="First step" />
</Stepper>
```

❌ **Don't** mix step sizes inconsistently

```typescript
// Bad - inconsistent sizes
<Stepper current={0}>
  <Step title="Step 1" size={StepSize.Large} />
  <Step title="Step 2" size={StepSize.Small} />
</Stepper>
```

✅ **Do** use consistent sizing

```typescript
// Good
<Stepper current={0}>
  <Step title="Step 1" size={StepSize.Medium} />
  <Step title="Step 2" size={StepSize.Medium} />
</Stepper>
```

## Related Components

- [Stepper](./Stepper.md) - Container for steps
- [Timeline](./Timeline.md) - Timeline variant of stepper
- [Progress](./Progress.md) - For progress indication

