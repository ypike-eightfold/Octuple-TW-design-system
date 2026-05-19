# TextInput

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The TextInput component is a single-line text input field for collecting user data. It's one of the most fundamental form components with support for various input types, validation states, icons, and interactive features.

### When to Use
- Single-line text entry (name, email, password, search, etc.)
- Form fields requiring user input
- Search bars
- Filtered/autocomplete inputs
- Number entry (with `numbersOnly` prop)

### When NOT to Use
- Multi-line text (use TextArea instead)
- Selection from predefined options (use Select)
- Boolean values (use CheckBox or Switch)
- Dates (use DatePicker)

---

## API Reference

### Import
```typescript
import { TextInput, TextInputIconAlign, TextInputShape, TextInputSize, TextInputWidth } from '@eightfold.ai/octuple';
```

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `string \| number` | - | - | The value of the TextInput. |
| `placeholder` | `string` | - | - | Placeholder text of the TextInput. |
| `onChange` | `React.ChangeEventHandler<HTMLTextAreaElement \| HTMLInputElement>` | - | - | The TextInput onChange event handler. |
| `onClear` | - | - | - | The TextInput onClear event handler. |
| `onFocus` | `React.FocusEventHandler<HTMLTextAreaElement \| HTMLInputElement>` | - | - | The TextInput onFocus event handler. |
| `onBlur` | `React.FocusEventHandler<HTMLTextAreaElement \| HTMLInputElement>` | - | - | The TextInput onBlur event handler. |
| `onKeyDown` | `React.KeyboardEventHandler<HTMLTextAreaElement \| HTMLInputElement>` | - | - | The TextInput onKeyDown event handler. |
| `htmlType` | `string` | `'text'` | - | The TextInput html type. |
| `disabled` | `boolean` | `false` | - | The TextInput disabled state. |
| `readonly` | `boolean` | `false` | - | The TextInput is readonly. |
| `required` | `boolean` | `false` | - | The TextInput required attribute. |
| `autoFocus` | `boolean` | `false` | - | The TextInput autoFocus attribute. |
| `allowDisabledFocus` | `boolean` | `false` | - | Allows focus on the TextInput when it's disabled. |
| `clearable` | `boolean` | `true` | - | Option to show the clear TextInput button. Default is `true` for backward compatibility. |
| `clearButtonAriaLabel` | `string` | - | - | The TextInput clear button aria label text. |
| `alignIcon` | `<enum>TextInputIconAlign` | - | - | The TextInput icon alignment. |
| `iconProps` | `InputIconProps` | - | - | The TextInput icon props. |
| `iconButtonProps` | `InputIconButtonProps` | - | - | The TextInput icon button props. |
| `labelProps` | `<interface>LabelProps` | - | - | The TextInput Label props. |
| `id` | `string` | - | - | The TextInput id. |
| `name` | `string` | - | - | The TextInput name. |
| `ariaLabel` | `string` | - | - | The TextInput aria label text. |
| `classNames` | `string` | - | - | The TextInput class names. |
| `inputWidth` | `<enum>TextInputWidth` | `TextInputWidth.fitContent` | - | Width of the TextInput. |
| `maxlength` | `number` | - | - | The TextInput maxlength. |
| `minlength` | `number` | - | - | The TextInput minlength. |
| `numbersOnly` | `boolean` | `false` | - | The TextInput accepts only numbers. |
| `autocomplete` | `string` | `undefined` | - | The TextInput autocomplete value. **(v2.20.3+)** |
| `size` | `<enum>TextInputSize \| <enum>Size` | `TextInputSize.Medium` | - | Size of the TextInput. |
| `shape` | `<enum>TextInputShape \| <enum>Shape` | `TextInputShape.Pill` | - | Shape of the TextInput. |
| `status` | `<'' \| 'success' \| 'warning' \| 'error' \| 'validating'>InputStatus` | - | - | The validation status. |
| `waitInterval` | `number` | `10` | - | Debounce rate of the TextInput (in milliseconds). |
| `inline` | `boolean` | `false` | - | The TextInput Label is inline. |
| `formItemInput` | `boolean` | `false` | - | The TextInput is a Octuple Form item. |
| `configContextProps` | `<interface>ConfigContextProps` | `{ noDisabledContext: false, noShapeContext: false, noSizeContext: false }` | - | Configure how contextual props are consumed by enabling or disabling contextually set properties. **(v2.10.0+)** |
| `style` | `React.CSSProperties` | - | - | The TextInput style. |
| `data-test-id` | `string` | - | - | Unique id used to target element for testing. |
| `ref` | `Ref<HTMLInputElement>` | - | - | The component ref. |
| `...rest` | `HTMLInputElement` | - | - | TextInput inherits all attributes of `HTMLInputElement`. **Only use this if absolutely necessary**. With great power comes great responsibility. |

### TypeScript Enums

```typescript
enum TextInputIconAlign {
  Left = 'left',
  Right = 'right',
}

enum TextInputShape {
  Rectangle = 'rectangle',
  Pill = 'pill',
  Underline = 'underline',
}

enum TextInputSize {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
}

enum TextInputWidth {
  fitContent = 'fitContent',
  fill = 'fill',
}
```

---

## Visual States

### Sizes
- **Flex**: Automatically resizes based on browser breakpoints
- **Large**: Large input field
- **Medium**: Default size (recommended)
- **Small**: Compact input for tight spaces

### Shapes
- **Pill**: Rounded corners (default, most common)
- **Rectangle**: Square corners
- **Underline**: Bottom border only (material design style)

### States
- **Default**: Normal editable state
- **Hover**: Visual feedback on hover
- **Focus**: Active input state with focus ring
- **Disabled**: Non-editable state (`disabled={true}`)
- **Readonly**: Visible but not editable (`readonly={true}`)
- **Error**: Validation error state (`status="error"`)
- **Success**: Validation success state (`status="success"`)
- **Warning**: Validation warning state (`status="warning"`)
- **Validating**: Currently validating (`status="validating"`)

---

## Usage Examples

### Basic Usage

```typescript
import React, { useState } from 'react';
import { TextInput } from '@eightfold.ai/octuple';

const BasicExample = () => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      placeholder="Enter text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
```

### With Form.Item

```typescript
import { Form, TextInput } from '@eightfold.ai/octuple';

const FormExample = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <TextInput placeholder="Enter email" htmlType="email" />
      </Form.Item>
    </Form>
  );
};
```

### With Icons (MDI)

```typescript
import { TextInput, TextInputIconAlign } from '@eightfold.ai/octuple';
import { mdiMagnify, mdiAccount } from '@mdi/js';
import { IconName } from '@mdi/react';

const WithIconExample = () => {
  return (
    <>
      {/* Icon on left */}
      <TextInput
        placeholder="Search"
        iconProps={{ path: mdiMagnify as IconName }}
        alignIcon={TextInputIconAlign.Left}
      />

      {/* Icon on right */}
      <TextInput
        placeholder="Username"
        iconProps={{ path: mdiAccount as IconName }}
        alignIcon={TextInputIconAlign.Right}
      />
    </>
  );
};
```

### With Icon Button

```typescript
import { TextInput } from '@eightfold.ai/octuple';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { IconName } from '@mdi/react';
import { useState } from 'react';

const PasswordExample = () => {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      placeholder="Password"
      htmlType={visible ? 'text' : 'password'}
      iconButtonProps={{
        iconProps: { path: (visible ? mdiEyeOff : mdiEye) as IconName },
        onClick: () => setVisible(!visible),
        ariaLabel: visible ? 'Hide password' : 'Show password'
      }}
    />
  );
};
```

### Validation States

```typescript
import { TextInput } from '@eightfold.ai/octuple';

const ValidationExample = () => {
  return (
    <>
      <TextInput 
        placeholder="Success" 
        status="success"
        value="valid@email.com"
      />
      
      <TextInput 
        placeholder="Error" 
        status="error"
        value="invalid-email"
      />
      
      <TextInput 
        placeholder="Warning" 
        status="warning"
        value="test@temp-mail.com"
      />
      
      <TextInput 
        placeholder="Validating" 
        status="validating"
        value="checking..."
      />
    </>
  );
};
```

### Numbers Only

```typescript
import { TextInput } from '@eightfold.ai/octuple';

const NumbersOnlyExample = () => {
  const [age, setAge] = useState('');

  return (
    <TextInput
      placeholder="Enter age"
      value={age}
      onChange={(e) => setAge(e.target.value)}
      numbersOnly={true}
      maxlength={3}
    />
  );
};
```

### Clearable Input

```typescript
import { TextInput } from '@eightfold.ai/octuple';

const ClearableExample = () => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      placeholder="Type something..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      clearable={true}
      clearButtonAriaLabel="Clear input"
    />
  );
};
```

### Disabled and Readonly

```typescript
import { TextInput } from '@eightfold.ai/octuple';

const StateExample = () => {
  return (
    <>
      <TextInput 
        placeholder="Disabled" 
        disabled={true}
        value="Cannot edit"
      />
      
      <TextInput 
        placeholder="Readonly" 
        readonly={true}
        value="Can view but not edit"
      />
    </>
  );
};
```

### Search Input with Debounce

```typescript
import { TextInput, TextInputIconAlign } from '@eightfold.ai/octuple';
import { mdiMagnify } from '@mdi/js';
import { IconName } from '@mdi/react';
import { useState } from 'react';

const SearchExample = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Search API call will be debounced by waitInterval
  };

  return (
    <TextInput
      placeholder="Search..."
      value={searchTerm}
      onChange={handleSearch}
      waitInterval={300} // Debounce 300ms
      iconProps={{ path: mdiMagnify as IconName }}
      alignIcon={TextInputIconAlign.Left}
    />
  );
};
```

---

## Common Patterns

### Pattern 1: Form Field with Validation

**When to use:** Data collection with validation

```typescript
import { Form, TextInput } from '@eightfold.ai/octuple';

const ValidatedField = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Username"
        name="username"
        rules={[
          { required: true, message: 'Username is required' },
          { min: 3, message: 'Username must be at least 3 characters' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores' }
        ]}
      >
        <TextInput placeholder="Enter username" />
      </Form.Item>
    </Form>
  );
};
```

**Accessibility:** Error messages are automatically announced to screen readers.

### Pattern 2: Search Bar

**When to use:** Filter or search functionality

```typescript
import { TextInput, TextInputWidth, TextInputIconAlign } from '@eightfold.ai/octuple';
import { mdiMagnify } from '@mdi/js';
import { IconName } from '@mdi/react';

const SearchBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  return (
    <TextInput
      placeholder="Search..."
      onChange={(e) => onSearch(e.target.value)}
      waitInterval={300}
      inputWidth={TextInputWidth.fill}
      iconProps={{ path: mdiMagnify as IconName }}
      alignIcon={TextInputIconAlign.Left}
      clearable={true}
      ariaLabel="Search"
    />
  );
};
```

### Pattern 3: Password Input with Toggle

**When to use:** Password fields

```typescript
import { TextInput } from '@eightfold.ai/octuple';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { IconName } from '@mdi/react';
import { useState } from 'react';

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      placeholder="Enter password"
      htmlType={showPassword ? 'text' : 'password'}
      iconButtonProps={{
        iconProps: { path: (showPassword ? mdiEyeOff : mdiEye) as IconName },
        onClick: () => setShowPassword(!showPassword),
        ariaLabel: showPassword ? 'Hide password' : 'Show password'
      }}
    />
  );
};
```

---

## Composition

### Works Well With
- **Form / Form.Item**: For form field management
- **Label**: For field labels (via `labelProps`)
- **Icon**: For visual enhancements (via `iconProps`)
- **Button**: For input actions (via `iconButtonProps`)

---

## Accessibility

### ARIA Requirements
- **aria-label**: Provide when there's no visible label
  ```typescript
  <TextInput ariaLabel="Search" placeholder="Search..." />
  ```
- **Form.Item**: Automatically provides proper labels and ARIA attributes
- **Error states**: Automatically announced via `aria-describedby`

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus the input |
| `Shift+Tab` | Focus previous element |
| `Escape` | Clear the input (if clearable) |
| All standard text editing keys work |

### Screen Reader Support
- Input type and placeholder are announced
- Current value is read on focus
- Required state is announced
- Error messages are announced when validation fails
- Disabled/readonly states are announced

---

## Best Practices

### ✅ Do
- Always provide a `placeholder` or label
- Use `htmlType` prop for semantic input types (email, password, tel, url)
- Use `numbersOnly` for numeric inputs
- Provide meaningful validation error messages
- Use `clearable={true}` for search and filter inputs
- Use `waitInterval` for search/autocomplete to avoid excessive API calls
- Keep input widths appropriate for expected content length

### ❌ Don't
- Don't use placeholder as the only label (accessibility issue)
- Don't forget to handle `onChange` event
- Don't use TextInput for multi-line text (use TextArea)
- Don't use TextInput for selections (use Select)
- Don't set extremely short `waitInterval` (causes performance issues)
- Don't make inputs too narrow (minimum 120px width recommended)

---

## Common Mistakes

### Mistake 1: Using Placeholder as Label

**Problem:**
```typescript
<TextInput placeholder="Email" /> {/* ❌ No proper label */}
```

**Solution:**
```typescript
<Form.Item label="Email" name="email">
  <TextInput placeholder="Enter your email" /> {/* ✅ Proper label + placeholder */}
</Form.Item>
```

**Why:** Placeholders disappear when typing, and screen readers may not announce them as labels.

---

### Mistake 2: Not Handling Controlled Component Properly

**Problem:**
```typescript
<TextInput value="fixed" /> {/* ❌ No onChange, input is stuck */}
```

**Solution:**
```typescript
const [value, setValue] = useState('');
<TextInput 
  value={value} 
  onChange={(e) => setValue(e.target.value)} 
/> {/* ✅ Properly controlled */}
```

---

### Mistake 3: Wrong Input Type

**Problem:**
```typescript
<TextInput placeholder="Email" /> {/* ❌ Default type='text', no validation */}
```

**Solution:**
```typescript
<TextInput 
  placeholder="Email" 
  htmlType="email" 
/> {/* ✅ Browser provides email validation */}
```

---

## Design Guidelines

### Spacing
- Minimum width: `120px` (for short inputs like age)
- Standard width: `280px` (for most inputs)
- Full width: Use `inputWidth={TextInputWidth.fill}`
- Vertical spacing between inputs: `16px` (standard form gap)

### Typography
- Font: Poppins
- Size varies by input size:
  - Large: `16px`
  - Medium: `14px`
  - Small: `12px`

### Colors
- Border: Handled by theme
- Focus: Blue focus ring
- Error: Red border (`status="error"`)
- Success: Green border (`status="success"`)
- Disabled: Gray with reduced opacity

---

## Related Components

- **TextArea**: For multi-line text input
- **Select**: For selecting from predefined options
- **DatePicker**: For date input
- **Form / Form.Item**: For form field management
- **Label**: For input labels

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/TextInput/`)
- [MDI Icons](https://pictogrammers.com/library/mdi/)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial comprehensive documentation from Confluence
- Verified all props and TypeScript types
- Added MDI icon integration examples
- Documented all validation states
- Added accessibility guidelines
- Included common patterns and mistakes

