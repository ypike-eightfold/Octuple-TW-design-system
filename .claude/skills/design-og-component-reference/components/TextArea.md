# TextArea

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The TextArea component is a multi-line text input field for collecting longer text input from users. It extends the TextInput component with additional features for multi-line content.

### When to Use
- Multi-line text entry (comments, descriptions, notes)
- Long-form content
- User feedback or reviews
- Addresses
- Any input requiring more than one line

### When NOT to Use
- Single-line text (use TextInput instead)
- Rich text editing (use RichTextEditor instead)
- Code editing (use CodeEditor instead)

---

## API Reference

### Import
```typescript
import { TextArea } from '@eightfold.ai/octuple';
```

### Props

**Extends TextInput:** TextArea inherits all props from TextInput component.

**Additional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `4` | Number of visible text rows. |
| `autoSize` | `boolean \| { minRows: number, maxRows: number }` | `false` | Auto-resize textarea height based on content. |
| `maxLength` | `number` | - | Maximum character count. |
| `showCount` | `boolean` | `false` | Show character count indicator. |

---

## Usage Examples

### Basic TextArea

```typescript
import React, { useState } from 'react';
import { TextArea } from '@eightfold.ai/octuple';

const BasicTextArea = () => {
  const [value, setValue] = useState('');

  return (
    <TextArea
      placeholder="Enter your comments"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rows={4}
    />
  );
};
```

### With Form.Item

```typescript
import { Form, TextArea } from '@eightfold.ai/octuple';

const FormTextArea = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: 'Please provide a description' },
          { min: 10, message: 'Description must be at least 10 characters' }
        ]}
      >
        <TextArea 
          placeholder="Enter description"
          rows={6}
        />
      </Form.Item>
    </Form>
  );
};
```

### With Character Count

```typescript
import { TextArea } from '@eightfold.ai/octuple';
import { useState } from 'react';

const CountedTextArea = () => {
  const [value, setValue] = useState('');

  return (
    <TextArea
      placeholder="Enter feedback (max 500 characters)"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      maxLength={500}
      showCount={true}
      rows={5}
    />
  );
};
```

### Auto-Sizing TextArea

```typescript
import { TextArea } from '@eightfold.ai/octuple';
import { useState } from 'react';

const AutoSizeTextArea = () => {
  const [value, setValue] = useState('');

  return (
    <TextArea
      placeholder="This textarea will grow as you type"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoSize={{ minRows: 3, maxRows: 10 }}
    />
  );
};
```

### Disabled and Readonly

```typescript
import { TextArea } from '@eightfold.ai/octuple';

const StateExamples = () => {
  return (
    <>
      <TextArea 
        placeholder="Disabled" 
        disabled={true}
        value="Cannot edit this text"
        rows={3}
      />
      
      <TextArea 
        placeholder="Readonly" 
        readonly={true}
        value="Can view but not edit"
        rows={3}
      />
    </>
  );
};
```

---

## Common Patterns

### Pattern 1: Comment Box

**When to use:** User comments or feedback

```typescript
import { Form, TextArea, Button, ButtonVariant } from '@eightfold.ai/octuple';

const CommentBox = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Comment:', values.comment);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        name="comment"
        rules={[{ required: true, message: 'Please enter a comment' }]}
      >
        <TextArea
          placeholder="Add a comment..."
          rows={4}
          maxLength={1000}
          showCount={true}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" text="Post Comment" variant={ButtonVariant.Primary} />
      </Form.Item>
    </Form>
  );
};
```

### Pattern 2: Address Input

**When to use:** Collecting addresses

```typescript
import { Form, TextArea } from '@eightfold.ai/octuple';

const AddressInput = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true }]}
      >
        <TextArea
          placeholder="Street address&#10;City, State ZIP"
          rows={3}
        />
      </Form.Item>
    </Form>
  );
};
```

---

## Best Practices

### ✅ Do
- Set appropriate `rows` for expected content length
- Use `maxLength` and `showCount` for character limits
- Use `autoSize` for dynamic content
- Provide clear placeholder text
- Use with Form.Item for validation

### ❌ Don't
- Don't use for single-line input (use TextInput)
- Don't set rows too small (minimum 3 recommended)
- Don't forget to handle character limits
- Don't use extremely large maxLength without warning

---

## Common Mistakes

### Mistake 1: Using TextInput for Multi-Line

**Problem:**
```typescript
<TextInput placeholder="Comments" /> {/* ❌ Single line only */}
```

**Solution:**
```typescript
<TextArea placeholder="Comments" rows={4} /> {/* ✅ Multi-line */}
```

---

### Mistake 2: No Character Limit

**Problem:**
```typescript
<TextArea placeholder="Description" /> {/* ❌ No limit */}
```

**Solution:**
```typescript
<TextArea 
  placeholder="Description" 
  maxLength={500} 
  showCount={true} 
/> {/* ✅ With limit */}
```

---

## Accessibility

### ARIA Requirements
- Same as TextInput (inherits all accessibility features)
- `aria-label` when no visible label
- Error messages automatically announced

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus the textarea |
| `Shift+Tab` | Focus previous element |
| All standard text editing keys work |

### Screen Reader Support
- Placeholder and label are announced
- Current value is read on focus
- Character count is announced
- Validation errors are announced

---

## Related Components

- **TextInput**: For single-line text
- **Form / Form.Item**: For form management
- **RichTextEditor**: For formatted text

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/TextArea/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented extension of TextInput
- Added multi-line usage examples
- Included character count patterns

