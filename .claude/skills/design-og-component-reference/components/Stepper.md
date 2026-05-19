# Stepper

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Stepper component displays progress through a sequence of logical steps, commonly used in multi-step forms, workflows, or onboarding processes.

### When to Use
- Multi-step forms or wizards
- Sequential workflows
- Onboarding processes
- Progress indication
- Checkout flows

### When NOT to Use
- Simple progress bars (use ProgressBar instead)
- Tabs for navigation (use Tabs instead)
- Single-step processes

---

## API Reference

### Import
```typescript
import { Stepper, Step, StepperSize, StepperVariant } from '@eightfold.ai/octuple';
```

### Stepper Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `activeStepIndex` | `<number>StepIndex` | - | - | The currently active Step index. Use when readonly is false. Maintains click-ability of active step. |
| `completeAriaLabelText` | `string` | `'complete'` | - | The Stepper 'complete' button aria label string. Used when variant is `StepperVariant.Default`. |
| `height` | `number` | - | - | The Stepper height. Use when layout is vertical. |
| `index` | `<number>StepIndex` | - | - | The Step index. |
| `layout` | `<'horizontal' \| 'vertical'>ItemLayout` | `'horizontal'` | - | The Stepper layout direction. |
| `lineStyle` | `<enum>StepperLineStyle` | `StepperLineStyle.Dash` | - | The optional Stepper line style. Options: 'dash', 'dot', 'solid' |
| `locale` | `StepperLocale` | `'enUS'` | - | The Stepper locale. |
| `onChange` | `OnChangeHandler` | - | - | The onChange event handler. |
| `readonly` | `boolean` | `true` | - | The Stepper is read only. |
| `required` | `boolean` | `false` | - | Each Step is required, but previous are enabled. Use when readonly is false. |
| `scrollable` | `boolean` | - | - | Whether the Stepper is scrollable. |
| `scrollDownAriaLabelText` | `string` | `'Scroll down'` | - | The Stepper 'Scroll down' button aria label string. |
| `scrollLeftAriaLabelText` | `string` | `'Scroll left'` | - | The Stepper 'Scroll left' button aria label string. |
| `scrollRightAriaLabelText` | `string` | `'Scroll right'` | - | The Stepper 'Scroll right' button aria label string. |
| `scrollToActiveStep` | `boolean` | `false` | - | Scroll to active step on load. **(v2.35.0+)** |
| `scrollUpAriaLabelText` | `string` | `'Scroll up'` | - | The Stepper 'Scroll up' button aria label string. |
| `size` | `<enum>StepperSize` | `StepperSize.Medium` | - | The Stepper size. |
| `steps` | `Step[]` | - | - | The Stepper Steps. |
| `theme` | `StepperThemeName` | - | - | Theme of the Stepper. |
| `variant` | `<enum>StepperVariant` | `StepperVariant.Default` | - | The Stepper variant. Options: `Default`, `Timeline`. Timeline is pending release - ETA week of January 16th. |
| `width` | `number` | - | - | The Stepper width. Use when layout is `horizontal`. |

### Step Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `complete` | `<number>StepIndex` | - | - | Whether the Step is complete. Use when the Stepper isn't readonly. |
| `completeAriaLabelText` | `string` | `'complete'` | - | The Stepper custom complete button aria label string. |
| `content` | `React.ReactNode` | - | - | The Step content. |
| `index` | `StepIndex` | - | - | The Step index. |
| `size` | `StepSize` | `StepSize.Large` for Default, `StepSize.Small` for Timeline | - | The individual Step size. The default depends on the chosen variant. |
| `status` | `StepperValidationStatus` | - | - | The validation status. |
| `style` | `React.CSSProperties` | - | - | Custom Step style. |
| `theme` | `StepperThemeName` | - | - | Theme of the Step. |

### TypeScript Enums

```typescript
enum StepperSize {
  Medium = 'medium',
}

enum StepperVariant {
  Default = 'default',
  // Timeline = 'timeline', // Coming soon
}

enum StepperLineStyle {
  Dash = 'dash',
  Dot = 'dot',
  Solid = 'solid',
}
```

---

## Visual States

### Variants
- **Default**: Standard stepper with circles and connecting lines
- **Timeline**: Timeline-style stepper (coming soon - ETA January 16th)

### Layouts
- **Horizontal**: Steps arranged left-to-right (default)
- **Vertical**: Steps arranged top-to-bottom

### Step States
- **Active**: Current step (highlighted)
- **Complete**: Completed step (checkmark)
- **Incomplete**: Not yet reached
- **Error**: Step with validation error

---

## Usage Examples

### Basic Horizontal Stepper

```typescript
import React, { useState } from 'react';
import { Stepper } from '@eightfold.ai/octuple';

const BasicStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { index: 0, content: 'Step 1: Account Info' },
    { index: 1, content: 'Step 2: Personal Details' },
    { index: 2, content: 'Step 3: Review' },
  ];

  return (
    <Stepper
      activeStepIndex={activeStep}
      steps={steps}
      onChange={(index) => setActiveStep(index)}
      readonly={false}
    />
  );
};
```

### Interactive Multi-Step Form

```typescript
import { Stepper, Button, ButtonVariant } from '@eightfold.ai/octuple';
import { useState } from 'react';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { index: 0, content: 'Basic Information' },
    { index: 1, content: 'Contact Details' },
    { index: 2, content: 'Preferences' },
    { index: 3, content: 'Review & Submit' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <Stepper
        activeStepIndex={currentStep}
        steps={steps}
        onChange={(index) => setCurrentStep(index)}
        readonly={false}
      />

      <div style={{ marginTop: '24px' }}>
        {/* Your form content for current step */}
        <div>Content for Step {currentStep + 1}</div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
        <Button
          text="Previous"
          onClick={handlePrev}
          disabled={currentStep === 0}
        />
        <Button
          text={currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          variant={ButtonVariant.Primary}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};
```

### Vertical Stepper

```typescript
import { Stepper } from '@eightfold.ai/octuple';

const VerticalStepper = () => {
  const steps = [
    { index: 0, content: 'Order Placed' },
    { index: 1, content: 'Processing' },
    { index: 2, content: 'Shipped' },
    { index: 3, content: 'Delivered' },
  ];

  return (
    <Stepper
      activeStepIndex={2}
      steps={steps}
      layout="vertical"
      height={400}
      readonly={true}
    />
  );
};
```

### Stepper with Required Steps

```typescript
import { Stepper } from '@eightfold.ai/octuple';

const RequiredStepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { index: 0, content: 'Required Step 1', complete: true },
    { index: 1, content: 'Required Step 2', complete: false },
    { index: 2, content: 'Required Step 3', complete: false },
  ];

  return (
    <Stepper
      activeStepIndex={currentStep}
      steps={steps}
      onChange={(index) => setCurrentStep(index)}
      readonly={false}
      required={true} // Previous steps are enabled
    />
  );
};
```

### Scrollable Stepper

```typescript
import { Stepper } from '@eightfold.ai/octuple';

const ScrollableStepper = () => {
  const steps = Array.from({ length: 10 }, (_, i) => ({
    index: i,
    content: `Step ${i + 1}`,
  }));

  return (
    <Stepper
      activeStepIndex={3}
      steps={steps}
      scrollable={true}
      scrollToActiveStep={true}
      width={600}
      readonly={false}
    />
  );
};
```

---

## Common Patterns

### Pattern 1: Checkout Flow

**When to use:** E-commerce checkout process

```typescript
import { Stepper } from '@eightfold.ai/octuple';

const CheckoutStepper = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { index: 0, content: 'Cart' },
    { index: 1, content: 'Shipping' },
    { index: 2, content: 'Payment' },
    { index: 3, content: 'Confirmation' },
  ];

  return (
    <Stepper
      activeStepIndex={step}
      steps={steps}
      onChange={(index) => setStep(index)}
      readonly={false}
    />
  );
};
```

### Pattern 2: Onboarding Wizard

**When to use:** User onboarding process

```typescript
import { Stepper } from '@eightfold.ai/octuple';

const OnboardingStepper = () => {
  const steps = [
    { index: 0, content: 'Welcome' },
    { index: 1, content: 'Profile Setup' },
    { index: 2, content: 'Preferences' },
    { index: 3, content: 'Get Started' },
  ];

  return (
    <Stepper
      activeStepIndex={1}
      steps={steps}
      readonly={true}
    />
  );
};
```

---

## Best Practices

### ✅ Do
- Use clear, concise step labels
- Show current progress visually
- Allow users to go back to previous steps
- Provide navigation buttons (Previous/Next)
- Mark completed steps clearly
- Use `readonly={false}` for interactive steppers
- Use `scrollable={true}` for many steps

### ❌ Don't
- Don't use too many steps (5-7 maximum recommended)
- Don't allow skipping required steps
- Don't use vague step names
- Don't hide the stepper after completion
- Don't make all steps clickable if order matters

---

## Common Mistakes

### Mistake 1: Forgetting to Set readonly={false}

**Problem:**
```typescript
<Stepper
  activeStepIndex={step}
  steps={steps}
  onChange={(index) => setStep(index)}
  {/* ❌ readonly is true by default, steps not clickable */}
/>
```

**Solution:**
```typescript
<Stepper
  activeStepIndex={step}
  steps={steps}
  onChange={(index) => setStep(index)}
  readonly={false} // ✅ Steps are clickable
/>
```

---

## Accessibility

### ARIA Requirements
- Stepper automatically provides ARIA labels for steps
- Use `completeAriaLabelText`, `scrollDownAriaLabelText`, etc. for localization
- Current step is announced to screen readers

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Navigate to stepper, then between steps |
| `Enter` / `Space` | Activate a step |
| `Arrow keys` | Navigate between steps |

---

## Related Components

- **ProgressBar**: For simple linear progress
- **Tabs**: For non-sequential navigation
- **Wizard**: For complex multi-step flows

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Stepper/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial comprehensive documentation from Confluence
- Documented Stepper and Step components
- Added usage examples for horizontal and vertical layouts
- Included multi-step form patterns
- Added accessibility guidelines

