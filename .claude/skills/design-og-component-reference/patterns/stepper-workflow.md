# Stepper Workflow Pattern

**Pattern Type:** Form  
**Complexity:** Medium  
**Last Updated:** November 20, 2024

---

## Overview

Multi-step form wizard using Stepper component for sequential data collection.

---

## Basic Pattern

```typescript
import { Stepper, Form, TextInput, Button, ButtonVariant, Card } from '@eightfold.ai/octuple';
import { useState } from 'react';

const StepperWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const steps = [
    { index: 0, content: 'Personal Info' },
    { index: 1, content: 'Contact Details' },
    { index: 2, content: 'Review' },
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

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
  };

  return (
    <Card>
      <Stepper
        activeStepIndex={currentStep}
        steps={steps}
        onChange={(index) => setCurrentStep(index)}
        readonly={false}
      />

      <Form form={form} onFinish={handleSubmit} style={{ marginTop: '32px' }}>
        {currentStep === 0 && (
          <>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <TextInput />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <TextInput />
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <TextInput />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <TextInput />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <div>
            <h3>Review Your Information</h3>
            <p>Please review and submit</p>
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
          {currentStep > 0 && (
            <Button text="Previous" onClick={handlePrev} />
          )}
          {currentStep < steps.length - 1 ? (
            <Button text="Next" onClick={handleNext} variant={ButtonVariant.Primary} />
          ) : (
            <Button htmlType="submit" text="Submit" variant={ButtonVariant.Primary} />
          )}
        </div>
      </Form>
    </Card>
  );
};
```

---

## Resources

- [Stepper Component Guide](../components/Stepper.md)
- [Form Component Guide](../components/Form.md)

