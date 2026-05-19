# Form Validation Pattern

**Pattern Type:** Form  
**Complexity:** Medium  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2

---

## Overview

### What is this pattern?

The Form Validation Pattern demonstrates how to build robust, user-friendly forms with comprehensive validation using Octuple's Form component. It covers field-level validation, cross-field dependencies, async validation, error handling, and proper submission flow.

### When to use this pattern

- User registration or login forms
- Data collection forms with validation requirements
- Multi-field forms with dependencies
- Forms requiring server-side validation
- Any form where data integrity is critical

### When NOT to use this pattern

- Simple single-field inputs (use TextInput directly)
- Forms without validation requirements
- Read-only data display

---

## Components Used

- **Form** - Main form container with state management
- **Form.Item** - Field wrapper with validation
- **TextInput** - Text input fields
- **TextArea** - Multi-line text fields
- **Select** - Dropdown selections
- **CheckBox** - Boolean selections
- **Button** - Submit and reset actions
- **Row / Col** - Form layout

---

## Basic Pattern

### Simple Form with Required Fields

```typescript
import React from 'react';
import { Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';

const BasicValidationForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <TextInput placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <TextInput htmlType="password" placeholder="Enter password" />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" text="Submit" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

**Key Features:**
- Required field validation
- Email format validation
- Minimum length validation
- Clear error messages

---

## Pattern Variations

### Variation 1: Form with Field Dependencies

**Use Case:** Password confirmation field that depends on password field

```typescript
import { Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';

const DependentFieldsForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Submitted:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Password"
        name="password"
        rules={[
          { required: true, message: 'Password is required' },
          { min: 8, message: 'Must be at least 8 characters' }
        ]}
      >
        <TextInput htmlType="password" />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <TextInput htmlType="password" />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" text="Register" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

**Key Features:**
- Field dependencies
- Custom validator function
- Cross-field validation
- Dynamic error messages

---

### Variation 2: Form with Async Validation

**Use Case:** Username availability check with server

```typescript
import { Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';
import { useState } from 'react';

const AsyncValidationForm = () => {
  const [form] = Form.useForm();

  const checkUsernameAvailability = async (username: string) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' || username === 'test') {
          reject('Username is already taken');
        } else {
          resolve(true);
        }
      }, 1000);
    });
  };

  const handleSubmit = (values: any) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Username"
        name="username"
        hasFeedback
        rules={[
          { required: true, message: 'Username is required' },
          { min: 3, message: 'Minimum 3 characters' },
          {
            validator: async (_, value) => {
              if (!value) return Promise.resolve();
              try {
                await checkUsernameAvailability(value);
                return Promise.resolve();
              } catch (error) {
                return Promise.reject(error);
              }
            },
          },
        ]}
      >
        <TextInput placeholder="Choose a username" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email' }
        ]}
      >
        <TextInput placeholder="Enter your email" />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" text="Check & Submit" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

**Key Features:**
- Async validation with server check
- Loading state during validation
- Visual feedback (`hasFeedback`)
- Debounced validation

---

### Variation 3: Multi-Section Form with Complex Validation

**Use Case:** User profile form with multiple sections

```typescript
import { Form, TextInput, TextArea, Select, CheckBox, Button, ButtonVariant, Row, Col } from '@eightfold.ai/octuple';

const ComplexValidationForm = () => {
  const [form] = Form.useForm();

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ];

  const handleSubmit = (values: any) => {
    console.log('Form data:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      {/* Personal Information */}
      <h3>Personal Information</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: 'First name is required' },
              { pattern: /^[A-Za-z]+$/, message: 'Only letters allowed' }
            ]}
          >
            <TextInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: 'Last name is required' },
              { pattern: /^[A-Za-z]+$/, message: 'Only letters allowed' }
            ]}
          >
            <TextInput />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email format' }
        ]}
      >
        <TextInput />
      </Form.Item>

      {/* Address */}
      <h3>Address</h3>
      <Form.Item
        label="Street Address"
        name="address"
        rules={[{ required: true, message: 'Address is required' }]}
      >
        <TextArea rows={3} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'City is required' }]}
          >
            <TextInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Country is required' }]}
          >
            <Select options={countryOptions} placeholder="Select country" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Postal Code"
        name="postalCode"
        rules={[
          { required: true, message: 'Postal code is required' },
          { pattern: /^[0-9]{5}$/, message: 'Must be 5 digits' }
        ]}
      >
        <TextInput maxlength={5} />
      </Form.Item>

      {/* Agreement */}
      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject('You must agree to continue'),
          },
        ]}
      >
        <CheckBox label="I agree to the Terms and Conditions" />
      </Form.Item>

      {/* Actions */}
      <Form.Item>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            text="Reset"
            onClick={() => form.resetFields()}
          />
          <Button
            htmlType="submit"
            text="Submit Profile"
            variant={ButtonVariant.Primary}
          />
        </div>
      </Form.Item>
    </Form>
  );
};
```

**Key Features:**
- Multi-section form structure
- Two-column layout with Row/Col
- Multiple field types
- Pattern validation (regex)
- Checkbox validation
- Reset functionality

---

### Variation 4: Form with Dynamic Validation Messages

**Use Case:** Customizable validation messages using `validateMessages`

```typescript
import { Form, TextInput, TextArea, Button, ButtonVariant } from '@eightfold.ai/octuple';

const CustomMessagesForm = () => {
  const [form] = Form.useForm();

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
    string: {
      min: '${label} must be at least ${min} characters',
      max: '${label} cannot exceed ${max} characters',
    },
  };

  const handleSubmit = (values: any) => {
    console.log('Submitted:', values);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      validateMessages={validateMessages}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true },
          { min: 2 },
          { max: 50 }
        ]}
      >
        <TextInput />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true },
          { type: 'email' }
        ]}
      >
        <TextInput />
      </Form.Item>

      <Form.Item
        label="Age"
        name="age"
        rules={[
          { required: true },
          { type: 'number', min: 18, max: 120 }
        ]}
      >
        <TextInput numbersOnly={true} />
      </Form.Item>

      <Form.Item
        label="Bio"
        name="bio"
        rules={[
          { max: 500 }
        ]}
      >
        <TextArea rows={4} maxLength={500} showCount={true} />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" text="Submit" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

**Key Features:**
- Global validation messages
- Template variables in messages
- Consistent error formatting
- Min/max validation

---

## Complete Example: Registration Form

**Full implementation with all features:**

```typescript
import React, { useState } from 'react';
import {
  Form,
  TextInput,
  Select,
  CheckBox,
  Button,
  ButtonVariant,
  Row,
  Col,
  Card
} from '@eightfold.ai/octuple';

interface RegistrationFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  agreeTerms: boolean;
}

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  const checkUsernameAvailability = async (username: string) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const takenUsernames = ['admin', 'test', 'user'];
        if (takenUsernames.includes(username.toLowerCase())) {
          reject('Username is already taken');
        } else {
          resolve(true);
        }
      }, 800);
    });
  };

  const handleSubmit = async (values: RegistrationFormValues) => {
    setLoading(true);
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Registration successful:', values);
      alert('Registration successful!');
      form.resetFields();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFailed = (errorInfo: any) => {
    console.log('Validation failed:', errorInfo);
  };

  return (
    <Card title="Create Account">
      <Form
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        layout="vertical"
      >
        {/* Username */}
        <Form.Item
          label="Username"
          name="username"
          hasFeedback
          rules={[
            { required: true, message: 'Username is required' },
            { min: 3, message: 'Username must be at least 3 characters' },
            { max: 20, message: 'Username cannot exceed 20 characters' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores allowed' },
            {
              validator: async (_, value) => {
                if (!value || value.length < 3) return Promise.resolve();
                try {
                  await checkUsernameAvailability(value);
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(error);
                }
              },
            },
          ]}
        >
          <TextInput placeholder="Choose a unique username" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <TextInput placeholder="your.email@example.com" />
        </Form.Item>

        {/* Password Fields */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Password is required' },
                { min: 8, message: 'Password must be at least 8 characters' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must contain uppercase, lowercase, and number'
                }
              ]}
            >
              <TextInput htmlType="password" placeholder="Create a strong password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <TextInput htmlType="password" placeholder="Re-enter your password" />
            </Form.Item>
          </Col>
        </Row>

        {/* Country */}
        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: 'Please select your country' }]}
        >
          <Select options={countryOptions} placeholder="Select your country" />
        </Form.Item>

        {/* Terms Agreement */}
        <Form.Item
          name="agreeTerms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('You must accept the terms and conditions')),
            },
          ]}
        >
          <CheckBox label="I agree to the Terms of Service and Privacy Policy" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            htmlType="submit"
            text={loading ? 'Creating Account...' : 'Create Account'}
            variant={ButtonVariant.Primary}
            loading={loading}
            disabled={loading}
            buttonWidth="fill"
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegistrationForm;
```

**Complete Features:**
- ✅ Required field validation
- ✅ Email format validation
- ✅ Async username availability check
- ✅ Password strength validation
- ✅ Password confirmation with dependency
- ✅ Pattern matching (regex)
- ✅ Custom validators
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Form reset after submission
- ✅ Two-column layout
- ✅ Visual feedback (`hasFeedback`)

---

## Best Practices

### ✅ Do

1. **Provide Clear Error Messages**
   - Use specific, actionable error messages
   - Tell users exactly what's wrong and how to fix it

2. **Validate on Blur and Submit**
   - Use `validateTrigger` appropriately
   - Don't validate too early (avoid frustrating users)

3. **Use Field Dependencies**
   - For password confirmation
   - For conditional validation

4. **Implement Async Validation Carefully**
   - Debounce async validation
   - Show loading states
   - Handle errors gracefully

5. **Use `hasFeedback` for Visual Indicators**
   - Shows success/error icons
   - Provides immediate visual feedback

6. **Group Related Fields**
   - Use `Row`/`Col` for layout
   - Organize fields logically

7. **Provide Form Actions**
   - Always have a submit button
   - Consider reset/cancel buttons
   - Disable submit during loading

8. **Use Proper HTML Types**
   - `htmlType="email"` for email fields
   - `htmlType="password"` for passwords
   - Browser provides additional validation

### ❌ Don't

1. **Don't Validate Too Early**
   - Don't show errors before user interaction
   - Wait for blur or submit

2. **Don't Use Generic Error Messages**
   - Bad: "Invalid input"
   - Good: "Email must contain @ symbol"

3. **Don't Skip Required Field Indicators**
   - Mark required fields clearly
   - Use `required` prop on Form.Item

4. **Don't Forget Loading States**
   - Show loading during async operations
   - Disable submit to prevent double submission

5. **Don't Ignore Async Validation Errors**
   - Handle network failures
   - Provide retry mechanisms

6. **Don't Overvalidate**
   - Balance between security and UX
   - Don't make forms overly restrictive

7. **Don't Forget Accessibility**
   - Ensure error messages are announced
   - Maintain logical tab order

---

## Accessibility

### ARIA Requirements

- **Form Labels**: All Form.Item components with `label` prop automatically generate proper labels
- **Error Messages**: Errors are automatically announced via `aria-describedby`
- **Required Fields**: Use `required` prop to mark fields with `aria-required`
- **Invalid Fields**: Failed validation adds `aria-invalid="true"`

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move to next field |
| `Shift+Tab` | Move to previous field |
| `Enter` | Submit form (when focused on button) |

### Screen Reader Support

- Field labels are read on focus
- Error messages are announced when validation fails
- Required fields are announced as "required"
- Submit button state changes are announced

### Best Practices for Accessibility

1. **Always provide labels** for all fields
2. **Use descriptive error messages** that explain what went wrong
3. **Ensure proper focus management** after validation errors
4. **Test with screen readers** (NVDA, JAWS, VoiceOver)
5. **Maintain logical tab order**

---

## Common Issues

### Issue 1: Validation Not Triggering

**Problem:**
```typescript
<Form.Item name="email">
  <TextInput /> {/* ❌ No validation rules */}
</Form.Item>
```

**Solution:**
```typescript
<Form.Item 
  name="email"
  rules={[{ required: true, type: 'email' }]} // ✅ Add rules
>
  <TextInput />
</Form.Item>
```

---

### Issue 2: Password Confirmation Not Working

**Problem:**
```typescript
<Form.Item name="confirmPassword" rules={[{ required: true }]}>
  {/* ❌ Missing dependencies */}
</Form.Item>
```

**Solution:**
```typescript
<Form.Item
  name="confirmPassword"
  dependencies={['password']} // ✅ Add dependency
  rules={[
    { required: true },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('Passwords do not match');
      },
    }),
  ]}
>
  <TextInput htmlType="password" />
</Form.Item>
```

---

### Issue 3: Async Validation Running Too Often

**Problem:**
- Validation triggers on every keystroke
- Too many API calls

**Solution:**
- Use `waitInterval` prop on TextInput for debouncing
- Add minimum length check before async validation

```typescript
<Form.Item
  name="username"
  rules={[
    {
      validator: async (_, value) => {
        if (!value || value.length < 3) return Promise.resolve(); // ✅ Skip short values
        await checkAvailability(value);
      },
    },
  ]}
>
  <TextInput waitInterval={500} /> {/* ✅ Debounce 500ms */}
</Form.Item>
```

---

### Issue 4: Form Not Resetting After Submission

**Problem:**
```typescript
const handleSubmit = (values: any) => {
  submitData(values);
  // ❌ Form still shows old values
};
```

**Solution:**
```typescript
const handleSubmit = (values: any) => {
  submitData(values);
  form.resetFields(); // ✅ Reset form
};
```

---

## Related Patterns

- **Stepper Workflow Pattern** - For multi-step forms
- **Two-Column Layout Pattern** - For form layout
- **Data Table Pattern** - For inline editing forms

---

## Related Components

- **Form** - Main form component
- **Form.Item** - Field wrapper
- **TextInput** - Text input field
- **TextArea** - Multi-line input
- **Select** - Dropdown selection
- **CheckBox** - Boolean input
- **Button** - Form actions
- **Row / Col** - Layout components

---

## Resources

- [Form Component Guide](../components/Form.md)
- [TextInput Component Guide](../components/TextInput.md)
- [Button Component Guide](../components/Button.md)
- [Octuple Form Documentation](https://eightfold.atlassian.net/)

---

## Changelog

### November 20, 2024
- Initial pattern documentation
- Added 4 variations with complete examples
- Documented validation strategies
- Included accessibility guidelines
- Added common issues and solutions

