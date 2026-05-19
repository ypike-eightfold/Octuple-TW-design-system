# Form

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Form component provides a complete form solution with field management, validation, submission handling, and state management. It's built on top of React's controlled component pattern and provides a powerful API for complex form scenarios.

### When to Use
- Data collection and submission
- User input validation
- Multi-step forms or wizards
- Dynamic form fields
- Form state management
- Complex field dependencies

### When NOT to Use
- Simple single-field inputs (use standalone TextInput)
- Read-only data display
- When you need completely custom form logic

---

## API Reference

### Import
```typescript
import { Form } from '@eightfold.ai/octuple';

// Access Form.Item, Form.List, Form.useForm, etc.
const [form] = Form.useForm();
```

### Form Component Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `form` | `FormInstance<Values>` | - | - | Form control instance created by `form.useForm()`. Automatically created when not provided. |
| `children` | `OcRenderProps \| React.ReactNode` | - | - | The Form children. |
| `initialValues` | `OcStore` | - | - | Set value by Form initialization or reset. |
| `name` | `string` | - | - | The Form name. |
| `fields` | `OcFieldData[]` | - | - | Control of Form fields through state management. |
| `component` | `false \| string \| React.FC<any> \| React.ComponentClass<any>` | - | - | Set the Form rendering element. Do not create a DOM node if `false`. |
| `layout` | `"horizontal" \| "inline" \| "vertical">FormLayout` | `"horizontal"` | - | The Form layout. |
| `labelAlign` | `<"left" \| "right">FormLabelAlign` | `"left"` | - | The text align of label of all items. |
| `labelCol` | `<interface>ColProps` | - | - | The Column layout for field labels. |
| `labelWrap` | `boolean` | `false` | - | Determines if Form labels can wrap. |
| `colon` | `boolean` | `true` | - | Configure the default value of colon for `Form.Item`. Colon after the label is displayed if true (prop `layout` must be `horizontal`). |
| `disabled` | `boolean` | `false` | - | Disables Form Octuple components. |
| `onFieldsChange` | `OcCallbacks<Values>['onFieldsChange']` | - | - | Trigger when field updated. |
| `onFinish` | `OcCallbacks<Values>['onFinish']` | - | - | Trigger after submitting the form and verifying data successfully. |
| `onFinishFailed` | `OcCallbacks<Values>['onFinishFailed']` | - | - | Trigger after submitting the form and verifying data failed. |
| `onValuesChange` | `OcCallbacks<Values>['onValuesChange']` | - | - | Trigger when value updated. |
| `preserve` | `boolean` | - | - | Keep field value even when field is removed. |
| `requiredMark` | `boolean \| 'optional'>RequiredMark` | - | - | Required mark enabled and/or style. |
| `scrollToFirstError` | `Options \| boolean` | - | - | Auto scroll to the first failed field when Form submit action is attempted. |
| `shape` | `<enum>Shape` | `Shape.Rectangle` | - | Set field Octuple components shape. |
| `size` | `<enum>Size` | `Size.Medium` | - | Set field Octuple components size. |
| `validateMessages` | `ValidateMessages` | - | - | Validation message prompts. |
| `validateTrigger` | `string \| string[] \| false` | - | - | Determine when to validate the value of children node. |
| `wrapperCol` | `ColProps` | - | - | The Column layout for input controls, same as `<Col>`. You can set `span` offset to something like `{span: 3, offset: 7}` or `sm: {span: 3, offset: 7}` same as with `<Col>`. You can set `labelCol` on Form which will not affect nest item. If both exist, use item first. |
| `classNames` | `string` | - | - | Custom classnames of the Form. |
| `style` | `React.CSSProperties` | - | - | The Form style. |

---

## Form.Item

The field wrapper component that connects your input components to the form state.

### Form.Item Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `name` | `<string \| number \| (string \| number)[]>InternalOcNamePath` | - | - | The Field name. Supports array. |
| `label` | `React.ReactNode` | - | - | Label text. |
| `children` | `ChildrenType<Values> = React.ReactElement<Values> \| RenderChildren<Values>` | - | - | The Form.Item children |
| `colon` | `boolean` | `true` | - | Configure the default value of colon for `Form.Item`. Colon after the label is displayed if true (prop `layout` must be `horizontal`). |
| `dependencies` | `<string \| number \| InternalOcNamePath>OcNamePath[]` | - | - | Set up dependencies field. When dependencies field update and current field is touched it will trigger validate rules and render. |
| `extra` | `React.ReactNode` | - | - | The extra prompt message, similar to help. Usage example: to display error message and prompt message at the same time. |
| `getValueFromEvent` | `(...args: OcEventArgs) => OcStoreValue` | - | - | Specify how to get value from event or other onChange arguments. |
| `getValueProps` | `(value: OcStoreValue) => Record<string, unknown>` | - | - | Additional props with sub component. |
| `hasFeedback` | `boolean` | - | - | Used with `validateStatus`, this option specifies the validation status Icon. Recommended to be used only with TextInput. |
| `help` | `React.ReactNode` | - | - | The prompt message. If not provided, the prompt message will be generated by the validation rule. |
| `hidden` | `boolean` | `false` | - | hide Form.Item. |
| `htmlFor` | `string` | - | - | Set sub label htmlFor. |
| `initialValue` | `any` | - | - | Form.Item default value. Form initialValues prop gets a higher priority. |
| `labelAlign` | `<"left" \| "right">FormLabelAlign` | `"left"` | - | The text align of label. |
| `labelCol` | `<interface>ColProps` | - | - | The 12 column Grid layout of label. You can set span offset to something like `{span: 3, offset: 7}` same as with `<Col>`. You can set `labelCol` on Form which will not affect nest item. If both exist, use item first. |
| `messageVariables` | `Record<string, string>` | - | - | The default validate field info. |
| `noStyle` | `boolean` | `false` | - | Form.Item field should ignore Form validation styles |
| `normalize` | `(value: OcStoreValue, prevValue: OcStoreValue, allValues: OcStore) => OcStoreValue` | - | - | Normalize value from component value before passing to Form instance. Does not support async. |
| `onMetaChange` | `(meta: OcMeta & { destroy?: boolean }) => void` | - | - | The onMeta change event. Called when fields are dynamically added/removed. |
| `onReset` | `() => void` | - | - | The onReset Callback. |
| `preserve` | `boolean` | - | - | Keep field value even when field is removed. |
| `required` | `boolean` | `false` | - | Display required style. Will be generated by the validation rule. |
| `requiredMark` | `boolean \| 'optional'>RequiredMark` | `true` | - | Required mark style. May use required mark or optional mark. You may not configure to single Form.Item since this is a Form level configuration. |
| `rules` | `OcRule[]` | - | - | Rules for field validation. |
| `shouldUpdate` | `ShouldUpdate<Values>` | - | - | Custom field update logic. |
| `status` | `ValidateStatus` | - | - | The input validation status. |
| `style` | `React.CSSProperties` | - | - | The Form.Item style. |
| `tooltip` | `<React.ReactNode \| WrapperTooltipProps>LabelTooltipType` | - | - | Configure Tooltip content. |
| `trigger` | `string` | - | - | When to collect the value of children node. |
| `validateFirst` | `boolean \| 'parallel'` | - | - | Whether stop validate on first rule of error for this field. Will parallel validate when `parallel` configured. |
| `validateStatus` | `ValidateStatus` | - | - | The validation status. If not provided, will be generated by validation rule. options: `success`, `warning`, `error`, and `validating>InputStatus` |
| `validateTrigger` | `string \| string[] \| false` | - | - | When to validate the value of children node. |
| `valuePropName` | `string` | - | - | Props of children node, i.e. the prop of Switch is `checked`. This prop is an encapsulation of `getValueProps`, which will be invalid after customizing `getValueProps`. |
| `wrapperCol` | `<interface>ColProps` | - | - | The layout for input controls, same as `labelCol`. You can set `wrapperCol` on Form which will not affect nest item. If both exist, use item first. |

---

## Form.useForm Hook

**Type:** `type Form.useForm = (): [FormInstance]`

Create Form instance to maintain data store.

```typescript
const [form] = Form.useForm();
```

---

## FormInstance Methods

The `FormInstance` provides methods to interact with the form programmatically:

| Method | Description | Type |
|--------|-------------|------|
| `getFieldError` | Gets the error messages by a field name. | `(name: OcNamePath) => string[]` |
| `getFieldListErrors` | Get the error messages by multiple fields' name. | `(nameList?: OcNamePath[]) => OcFieldError[]` |
| `getFieldListValues` | Gets values by a set of field names. Return according to the corresponding structure. Use `getFieldListValues(true)` to get all values. | `(() => Values) & ((nameList: OcNamePath[] \| true, filterFunc?: (meta: OcMeta) => boolean) => any)` |
| `getFieldValue` | Gets the value by a field name. | `(name: OcNamePath) => OcStoreValue` |
| `getFieldWarning` | Gets the warn messages by a field name. | `(name: OcNamePath) => string[]` |
| `isListTouched` | Check if fields have been operated. Check if all fields is touched when `allFieldsTouched` is `true`. | `((nameList: OcNamePath[], allFieldsTouched?: boolean) => boolean) & ((allFieldsTouched?: boolean) => boolean)` |
| `isTouched` | Check if a field has been operated. | `(name: OcNamePath) => boolean` |
| `isValidating` | Check if a field is validating. | `(name: OcNamePath) => boolean` |
| `resetFields` | Reset fields to `initialValues`. | `(fields?: OcNamePath[]) => void` |
| `setFields` | Set multiple fields status. | `(fields: OcFieldData[]) => void` |
| `setFieldListValues` | Set multiple fields' value. Will directly pass to form store. If you do not want to modify passed object, clone first. Use `setFieldValue` instead if you want to only config single value in Form.List. | `(values: RecursivePartial<Values>) => void` |
| `setFieldValue` | Set a single field value. Will directly pass to form store. If you do not want to modify passed object, clone first. | `(name: OcNamePath, value: any) => void` |
| `submit` | Submit the form. Equivalent to submit button click. | `() => void` |
| `validateFields` | Validate fields. | `ValidateFields<Values>` |

---

## Form.List

Provides array fields management.

### Form.List Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string \| number \| (string \| number)[]` | - | Field name, supports array. |
| `initialValue` | - | - | Configure sub default value. Form `initialValues` get higher priority |
| `children` | `(fields: FormListFieldData[], operation: FormListOperation, meta: { errors: React.ReactNode[]; warnings: React.ReactNode[] }) => React.ReactNode` | - | The render function. |
| `rules` | `OcValidatorRule[]` | - | Validate rules, only supports customized validator |

### Form.List Operations

| Operation | Description | Type |
|-----------|-------------|------|
| `add` | Add a Form.Item. | `(defaultValue?: OcStoreValue, insertIndex?: number) => void` |
| `move` | Move a Form.Item. | `(from: number, to: number) => void` |
| `remove` | Remove a Form.Item. | `(index: number \| number[]) => void` |

---

## Form.Provider

Provide linkage between forms. If a sub form with `name` prop update, it will auto trigger Provider related events.

### Form.Provider Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | The child node. |
| `onFormChange` | `(name: string, info: OcFormChangeInfo) => void` | Triggered when a sub form field updates. |
| `onFormFinish` | `(name: string, info: OcFormFinishInfo) => void` | Triggered when a sub form submits. |
| `validateMessages` | `ValidateMessages` | Validation prompt template. |

---

## Validation Rules

Form supports powerful validation through the `rules` prop on `Form.Item`:

### Rule Object

| Property | Type | Description |
|----------|------|-------------|
| `defaultField` | `rule` | Validation rule for all array elements, valid when `type` is `array` |
| `enum` | `OcStoreValue[]` | Match enum value. Set `type` to `enum` to enable. |
| `len` | `number` | The length requirement of a field `string`, `number`, or `array`. |
| `message` | `string \| ReactElement` | Custom validation message. Will be autogenerated if not provided. |
| `min` | `number` | `type` required. min length of `string`, `number`, or `array`. |
| `pattern` | `RegExp` | Regex pattern. |
| `required` | `boolean` | Required field. |
| `transform` | `(value: OcStoreValue) => OcStoreValue` | Transform value to the rule before validation. |
| `type` | `OcRuleType` | Normally string |number |boolean |url | email. See https://github.com/yiminghe/async-validator#type |
| `validateTrigger` | `string \| string[]` | Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger`. |
| `warningOnly` | `boolean` | Set required to `warningOnly`. Will not block Form submit. |
| `whitespace` | `boolean` | Fail if only has whitespace only works with `type: 'string'` rule |

### Common Validation Examples

```typescript
// Required field
rules={[{ required: true, message: 'This field is required' }]}

// Email validation
rules={[
  { required: true, message: 'Please input your email' },
  { type: 'email', message: 'Please enter a valid email' }
]}

// Min/Max length
rules={[
  { min: 6, message: 'Password must be at least 6 characters' },
  { max: 20, message: 'Password cannot exceed 20 characters' }
]}

// Pattern (regex)
rules={[
  { pattern: /^[0-9]+$/, message: 'Please enter numbers only' }
]}

// Custom validator
rules={[
  {
    validator: (_, value) => {
      if (value && value < 18) {
        return Promise.reject('Must be 18 or older');
      }
      return Promise.resolve();
    }
  }
]}
```

---

## Usage Examples

### Basic Form

```typescript
import React from 'react';
import { Form, TextInput, Button, ButtonVariant } from '@eightfold.ai/octuple';

const BasicForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item 
        label="Username" 
        name="username"
        rules={[{ required: true, message: 'Please input your username' }]}
      >
        <TextInput placeholder="Enter username" />
      </Form.Item>

      <Form.Item 
        label="Email" 
        name="email"
        rules={[
          { required: true, message: 'Please input your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <TextInput placeholder="Enter email" />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" text="Submit" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

### Form with Initial Values

```typescript
const FormWithInitialValues = () => {
  const [form] = Form.useForm();

  const initialValues = {
    username: 'john_doe',
    email: 'john@example.com',
    remember: true
  };

  return (
    <Form 
      form={form} 
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      {/* form fields */}
    </Form>
  );
};
```

### Form with Dependencies

```typescript
// Password confirmation example
<Form.Item
  name="password"
  label="Password"
  rules={[{ required: true, message: 'Please input your password' }]}
>
  <TextInput type="password" />
</Form.Item>

<Form.Item
  name="confirm"
  label="Confirm Password"
  dependencies={['password']}
  rules={[
    { required: true, message: 'Please confirm your password' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('Passwords do not match');
      },
    }),
  ]}
>
  <TextInput type="password" />
</Form.Item>
```

### Dynamic Form Fields (Form.List)

```typescript
import { Form, TextInput, Button } from '@eightfold.ai/octuple';
import { mdiPlus, mdiClose } from '@mdi/js';
import { IconName } from '@mdi/react';

const DynamicForm = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div key={field.key} style={{ display: 'flex', gap: '8px' }}>
                <Form.Item
                  {...field}
                  name={[field.name, 'name']}
                  rules={[{ required: true, message: 'Name is required' }]}
                >
                  <TextInput placeholder="Name" />
                </Form.Item>
                
                <Form.Item
                  {...field}
                  name={[field.name, 'email']}
                  rules={[{ required: true, type: 'email' }]}
                >
                  <TextInput placeholder="Email" />
                </Form.Item>

                <Button
                  iconProps={{ path: mdiClose as IconName }}
                  onClick={() => remove(field.name)}
                  ariaLabel="Remove"
                />
              </div>
            ))}
            
            <Button
              text="Add User"
              iconProps={{ path: mdiPlus as IconName }}
              onClick={() => add()}
            />
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button htmlType="submit" text="Submit" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

### Custom Validation Messages

```typescript
const validateMessages = {
  required: '${name} is required!',
  types: {
    email: '${name} is not a valid email!',
    number: '${name} is not a valid number!',
  },
  number: {
    range: '${name} must be between ${min} and ${max}',
  },
};

<Form validateMessages={validateMessages}>
  {/* form fields */}
</Form>
```

### Programmatic Form Control

```typescript
const FormWithProgrammaticControl = () => {
  const [form] = Form.useForm();

  const fillForm = () => {
    form.setFieldListValues({
      username: 'admin',
      email: 'admin@example.com'
    });
  };

  const resetForm = () => {
    form.resetFields();
  };

  const getValues = () => {
    const values = form.getFieldListValues();
    console.log('Current values:', values);
  };

  return (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <Button text="Fill Form" onClick={fillForm} />
        <Button text="Reset Form" onClick={resetForm} />
        <Button text="Get Values" onClick={getValues} />
      </div>

      <Form form={form} onFinish={handleSubmit}>
        {/* form fields */}
      </Form>
    </>
  );
};
```

---

## Best Practices

### ✅ Do
- Always use `Form.useForm()` to create form instances
- Use `Form.Item` wrapper for all form fields
- Provide clear, descriptive `label` props
- Use meaningful `name` props (matches your data structure)
- Implement proper validation with `rules`
- Use `layout="vertical"` for better mobile UX
- Provide helpful error messages
- Use `dependencies` for field relationships
- Reset form after successful submission

### ❌ Don't
- Don't use bare input components without `Form.Item`
- Don't use generic validation messages ("Field is required")
- Don't forget to handle `onFinish` for form submission
- Don't use `onChange` on individual fields (Form manages this)
- Don't call `setState` manually; use `form.setFieldValue`
- Don't nest forms (use Form.Provider for multi-form scenarios)
- Don't skip validation - always validate user input

---

## Common Mistakes

### Mistake 1: Not Using Form.Item

**Problem:**
```typescript
<Form>
  <TextInput name="username" /> {/* ❌ Not connected to form */}
</Form>
```

**Solution:**
```typescript
<Form>
  <Form.Item name="username" label="Username">
    <TextInput /> {/* ✅ Properly connected */}
  </Form.Item>
</Form>
```

---

### Mistake 2: Collecting Form Data with onChange

**Problem:**
```typescript
const [username, setUsername] = useState('');

<Form.Item name="username">
  <TextInput onChange={(e) => setUsername(e.target.value)} /> {/* ❌ Redundant */}
</Form.Item>
```

**Solution:**
```typescript
// Form manages the state
<Form form={form} onFinish={(values) => {
  console.log(values.username); // ✅ Get value from form
}}>
  <Form.Item name="username">
    <TextInput />
  </Form.Item>
</Form>
```

---

### Mistake 3: Not Handling initialValues Correctly

**Problem:**
```typescript
// Changing initialValues after form is mounted doesn't update the form
const [initialValues, setInitialValues] = useState({});

useEffect(() => {
  fetchData().then(data => setInitialValues(data)); // ❌ Won't update form
}, []);

<Form initialValues={initialValues}>
```

**Solution:**
```typescript
// Use form.setFieldListValues or remount the form
useEffect(() => {
  fetchData().then(data => {
    form.setFieldListValues(data); // ✅ Updates form values
  });
}, []);
```

---

## Accessibility

### ARIA Requirements
- Form labels automatically generate proper `<label>` elements
- Error messages are announced to screen readers via `aria-describedby`
- Required fields are marked with `aria-required`
- Invalid fields are marked with `aria-invalid`

### Keyboard Navigation
- `Tab`: Navigate between form fields
- `Enter`: Submit form (when focused on submit button or in text input)
- `Space`: Activate checkboxes/toggle elements

### Screen Reader Support
- Field labels are properly associated with inputs
- Validation errors are announced when they appear
- Required fields are announced as "required"
- Form submission feedback should be announced

---

## Related Components

- **TextInput**: Primary text input field
- **TextArea**: Multi-line text input
- **Select**: Dropdown selection
- **CheckBox**: Boolean or multi-select input
- **Button**: Form submission and actions
- **Row/Col**: Form layout with grid system

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Form/`)
- [Async Validator Library](https://github.com/yiminghe/async-validator)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial comprehensive documentation from Confluence
- Documented Form, Form.Item, Form.List, Form.Provider
- Added FormInstance methods reference
- Included validation rules and examples
- Added accessibility guidelines
- Documented common patterns and mistakes

