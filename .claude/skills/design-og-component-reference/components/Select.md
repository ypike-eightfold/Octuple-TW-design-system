# Select

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Select component is a dropdown selector that allows users to choose one or multiple options from a predefined list. It's more space-efficient than radio buttons or checkboxes for longer lists.

### When to Use
- Selecting from a list of options (5+ options)
- Single or multiple selections
- Searchable/filterable options
- Form field with predefined choices

### When NOT to Use
- Binary choices (use CheckBox or Switch)
- Few options (2-4, use Radio instead)
- Free-form text (use TextInput)
- Date/time selection (use DatePicker/TimePicker)

---

## API Reference

### Import
```typescript
import { Select } from '@eightfold.ai/octuple';
```

### Select Props

Based on Confluence documentation, Select has comprehensive props. Specific API details available in TypeScript definitions.

**Common Props:**
- `options`: Array of select options
- `value`: Selected value(s)
- `onChange`: Selection change handler
- `placeholder`: Placeholder text
- `disabled`: Disabled state
- `multiple`: Allow multiple selections
- `searchable`: Enable search/filter

### Select Option

The `SelectOption` component (extends Menu Item Button) is used to define individual options.

---

## Usage Examples

### Basic Select

```typescript
import React, { useState } from 'react';
import { Select } from '@eightfold.ai/octuple';

const BasicSelect = () => {
  const [value, setValue] = useState('');

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <Select
      placeholder="Select an option"
      value={value}
      onChange={(val) => setValue(val)}
      options={options}
    />
  );
};
```

### With Form.Item

```typescript
import { Form, Select } from '@eightfold.ai/octuple';

const FormSelect = () => {
  const [form] = Form.useForm();

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  return (
    <Form form={form}>
      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: 'Please select a country' }]}
      >
        <Select
          placeholder="Select country"
          options={countryOptions}
        />
      </Form.Item>
    </Form>
  );
};
```

### Multi-Select

```typescript
import { Select } from '@eightfold.ai/octuple';
import { useState } from 'react';

const MultiSelect = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const skillOptions = [
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
  ];

  return (
    <Select
      placeholder="Select skills"
      value={selected}
      onChange={(val) => setSelected(val)}
      options={skillOptions}
      multiple={true}
    />
  );
};
```

### Searchable Select

```typescript
import { Select } from '@eightfold.ai/octuple';

const SearchableSelect = () => {
  const cityOptions = [
    { value: 'ny', label: 'New York' },
    { value: 'la', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'houston', label: 'Houston' },
    // ... many more cities
  ];

  return (
    <Select
      placeholder="Search for a city"
      options={cityOptions}
      searchable={true}
    />
  );
};
```

---

## Common Patterns

### Pattern 1: Country/State Selector

**When to use:** Location selection

```typescript
import { Form, Select, Row, Col } from '@eightfold.ai/octuple';

const LocationSelector = () => {
  const [form] = Form.useForm();

  const countries = [{ value: 'us', label: 'United States' }];
  const states = [
    { value: 'ca', label: 'California' },
    { value: 'ny', label: 'New York' },
  ];

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Country" name="country">
            <Select options={countries} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="State" name="state">
            <Select options={states} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
```

### Pattern 2: Grouped Options

**When to use:** Categorized options

```typescript
import { Select } from '@eightfold.ai/octuple';

const GroupedSelect = () => {
  const options = [
    {
      label: 'Fruits',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
      ]
    },
    {
      label: 'Vegetables',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
      ]
    }
  ];

  return (
    <Select
      placeholder="Select food"
      options={options}
    />
  );
};
```

---

## Best Practices

### ✅ Do
- Use for 5+ options
- Provide clear, concise option labels
- Use searchable for long lists (10+ options)
- Set appropriate placeholder text
- Use multi-select sparingly
- Sort options logically (alphabetically, by frequency, etc.)

### ❌ Don't
- Don't use for 2-4 options (use Radio instead)
- Don't forget to handle empty state
- Don't use extremely long option labels
- Don't use for free-form input

---

## Accessibility

### ARIA Requirements
- Select is properly labeled via Form.Item or aria-label
- Selected value is announced
- Options are keyboard navigable

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus the select |
| `Enter` / `Space` | Open dropdown |
| `Arrow Up/Down` | Navigate options |
| `Enter` | Select option |
| `Esc` | Close dropdown |
| Type to search (if searchable) |

---

## Related Components

- **Radio**: For 2-4 options
- **CheckBox**: For multiple selections (visible)
- **TextInput**: For free-form entry
- **Form / Form.Item**: For form integration

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Select/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented Select and SelectOption
- Added searchable and multi-select examples
- Included form integration patterns

