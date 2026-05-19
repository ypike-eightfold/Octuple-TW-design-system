# CheckBox

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The CheckBox component allows users to select one or more options from a set. It's used for boolean values or multiple selections.

### When to Use
- Boolean (yes/no) choices
- Multiple selections from a list
- Agree to terms and conditions
- Enable/disable features
- Filter options

### When NOT to Use
- Single selection from a list (use Radio instead)
- Toggle switches (use Switch instead)
- Dropdown selections (use Select instead)

---

## API Reference

### Import
```typescript
import { CheckBox, CheckBoxGroup } from '@eightfold.ai/octuple';
```

### CheckBox Props

Based on Confluence documentation (2 pages), CheckBox has comprehensive props.

**Common Props:**
- `checked`: Checked state
- `onChange`: Change handler
- `label`: Label text
- `disabled`: Disabled state
- `indeterminate`: Indeterminate state (for "select all")
- `value`: Value for CheckBoxGroup

### CheckBoxGroup Props

Group component for managing multiple checkboxes.

**Common Props:**
- `value`: Array of checked values
- `onChange`: Change handler
- `options`: Array of checkbox options
- `disabled`: Disable all checkboxes

---

## Usage Examples

### Basic CheckBox

```typescript
import React, { useState } from 'react';
import { CheckBox } from '@eightfold.ai/octuple';

const BasicCheckBox = () => {
  const [checked, setChecked] = useState(false);

  return (
    <CheckBox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      label="I agree to the terms and conditions"
    />
  );
};
```

### With Form.Item

```typescript
import { Form, CheckBox } from '@eightfold.ai/octuple';

const FormCheckBox = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
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
        <CheckBox label="I agree to the terms and conditions" />
      </Form.Item>
    </Form>
  );
};
```

### CheckBox Group

```typescript
import { CheckBoxGroup } from '@eightfold.ai/octuple';
import { useState } from 'react';

const CheckBoxGroupExample = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return (
    <CheckBoxGroup
      value={selected}
      onChange={(values) => setSelected(values)}
      options={options}
    />
  );
};
```

### Indeterminate CheckBox (Select All)

```typescript
import { CheckBox } from '@eightfold.ai/octuple';
import { useState } from 'react';

const SelectAllExample = () => {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const allOptions = ['option1', 'option2', 'option3'];

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? allOptions : []);
  };

  const checkAll = checkedList.length === allOptions.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < allOptions.length;

  return (
    <div>
      <CheckBox
        checked={checkAll}
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        label="Select All"
      />
      <CheckBoxGroup
        value={checkedList}
        onChange={(values) => setCheckedList(values)}
        options={allOptions.map(opt => ({ label: opt, value: opt }))}
      />
    </div>
  );
};
```

---

## Common Patterns

### Pattern 1: Terms Agreement

**When to use:** Terms and conditions acceptance

```typescript
import { Form, CheckBox, Button, ButtonVariant } from '@eightfold.ai/octuple';

const TermsAgreement = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Form.Item
        name="terms"
        valuePropName="checked"
        rules={[{ required: true, message: 'You must agree to the terms' }]}
      >
        <CheckBox label="I agree to the Terms of Service and Privacy Policy" />
      </Form.Item>
      <Button htmlType="submit" text="Continue" variant={ButtonVariant.Primary} />
    </Form>
  );
};
```

### Pattern 2: Filter Options

**When to use:** Multiple filter selections

```typescript
import { CheckBoxGroup } from '@eightfold.ai/octuple';

const FilterOptions = () => {
  const [filters, setFilters] = useState<string[]>([]);

  const filterOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Archived', value: 'archived' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <div>
      <h4>Filter by Status</h4>
      <CheckBoxGroup
        value={filters}
        onChange={(values) => setFilters(values)}
        options={filterOptions}
      />
    </div>
  );
};
```

---

## Best Practices

### ✅ Do
- Use clear, concise labels
- Group related checkboxes
- Use indeterminate state for "select all"
- Provide immediate visual feedback
- Use CheckBoxGroup for multiple related options

### ❌ Don't
- Don't use for single selection (use Radio)
- Don't use for toggle switches (use Switch)
- Don't use ambiguous labels
- Don't nest checkboxes deeply

---

## Accessibility

### ARIA Requirements
- CheckBox is properly labeled
- Checked state is announced
- Indeterminate state is announced
- Disabled state is announced

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus the checkbox |
| `Space` | Toggle checked state |

---

## Related Components

- **Radio**: For single selection
- **Switch**: For toggle actions
- **Select**: For dropdown multi-select
- **Form / Form.Item**: For form integration

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/CheckBox/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented CheckBox and CheckBoxGroup
- Added indeterminate state examples
- Included form integration patterns

