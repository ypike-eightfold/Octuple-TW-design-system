# SearchBox

**Status:** ✅ Documented from Confluence  
**Last Updated:** December 11, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The SearchBox component is a specialized search input that extends TextInput. It's wrapped within its own `<form>` element with a search role type used on submit. **Use SearchBox for search functionality instead of TextInput with icon workarounds.**

### When to Use
- Search bars and search inputs
- Filtered/autocomplete search fields
- Any input where users search for content

### When NOT to Use
- General text input (use TextInput instead)
- Non-search form fields
- When you don't need form submission behavior

---

## API Reference

### Import
```typescript
import { SearchBox, TextInputIconAlign, TextInputShape, TextInputSize, TextInputWidth } from '@eightfold.ai/octuple';
```

### Props

SearchBox extends TextInput and inherits all TextInput props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `FormEventHandler<HTMLFormElement>` | - | The SearchBox form submit event handler. |
| `alignIcon` | `TextInputIconAlign` | - | The SearchBox icon alignment. |
| `iconProps` | `InputIconProps` | - | The SearchBox icon props (for search icon). |
| `iconButtonProps` | `InputIconButtonProps` | - | The SearchBox icon button props. |
| `value` | `string` | - | The value of the SearchBox. |
| `placeholder` | `string` | - | Placeholder text of the SearchBox. |
| `onChange` | `ChangeEventHandler` | - | The SearchBox onChange event handler. |
| `clearable` | `boolean` | `true` | Option to show the clear SearchBox button. |
| `waitInterval` | `number` | `10` | Debounce rate (in milliseconds). |
| `size` | `TextInputSize` | `TextInputSize.Medium` | Size of the SearchBox. |
| `shape` | `TextInputShape` | `TextInputShape.Pill` | Shape of the SearchBox. |
| `inputWidth` | `TextInputWidth` | `TextInputWidth.fitContent` | Width of the SearchBox. |
| `disabled` | `boolean` | `false` | The SearchBox disabled state. |
| `readonly` | `boolean` | `false` | The SearchBox is readonly. |
| `ariaLabel` | `string` | - | The SearchBox aria label text. |

---

## Usage Examples

### Basic Search Box

```typescript
import React, { useState } from 'react';
import { SearchBox } from '@eightfold.ai/octuple';

const BasicSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SearchBox
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      ariaLabel="Search"
    />
  );
};
```

### Search with Submit Handler

```typescript
import { SearchBox, TextInputWidth } from '@eightfold.ai/octuple';
import { useState } from 'react';

const SearchWithSubmit = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Perform search API call
  };

  return (
    <SearchBox
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onSubmit={handleSubmit}
      inputWidth={TextInputWidth.fill}
      clearable={true}
      ariaLabel="Search"
    />
  );
};
```

### Search with Debounce

```typescript
import { SearchBox } from '@eightfold.ai/octuple';
import { useState } from 'react';

const DebouncedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // This will be debounced by waitInterval
  };

  return (
    <SearchBox
      placeholder="Search..."
      value={searchTerm}
      onChange={handleChange}
      waitInterval={300} // 300ms debounce
      ariaLabel="Search"
    />
  );
};
```

---

## Common Patterns

### Pattern 1: Header Search Bar

**When to use:** Global search in application header

```typescript
import { SearchBox, TextInputWidth, TextInputShape } from '@eightfold.ai/octuple';

const HeaderSearch = () => {
  return (
    <SearchBox
      placeholder="Search..."
      inputWidth={TextInputWidth.fill}
      shape={TextInputShape.Pill}
      clearable={true}
      waitInterval={300}
      ariaLabel="Global search"
      style={{ maxWidth: '400px' }}
    />
  );
};
```

### Pattern 2: Filter Search

**When to use:** Filtering a list of items

```typescript
import { SearchBox } from '@eightfold.ai/octuple';
import { useState } from 'react';

const FilterSearch = ({ onFilter }: { onFilter: (term: string) => void }) => {
  const [filterTerm, setFilterTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterTerm(value);
    onFilter(value);
  };

  return (
    <SearchBox
      placeholder="Filter results..."
      value={filterTerm}
      onChange={handleChange}
      waitInterval={200}
      clearable={true}
      ariaLabel="Filter"
    />
  );
};
```

---

## Best Practices

### ✅ Do
- Use SearchBox for all search functionality (not TextInput with icon workarounds)
- Set appropriate `waitInterval` for debouncing API calls
- Provide `ariaLabel` for accessibility
- Use `clearable={true}` so users can clear the search
- Use `onSubmit` for form-based search behavior

### ❌ Don't
- Don't use TextInput with manual icon positioning for search
- Don't forget to handle the onChange event
- Don't set waitInterval too low for API-heavy searches

---

## SearchBox vs TextInput

| Use Case | Component |
|----------|-----------|
| Search functionality | **SearchBox** ✅ |
| General text input | TextInput |
| Password input | TextInput with `htmlType="password"` |
| Email/phone input | TextInput with appropriate `htmlType` |

**Key Difference:** SearchBox is wrapped in a `<form>` element with search role, making it semantically correct for search functionality and providing built-in form submission behavior.

---

## Accessibility

### ARIA Requirements
- **aria-label**: Always provide when there's no visible label
- SearchBox automatically includes `role="search"` on the form wrapper
- Clear button has proper aria-label

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus the SearchBox |
| `Enter` | Submit the search (triggers onSubmit) |
| `Escape` | Clear the input (if clearable) |

---

## Related Components

- **TextInput**: For general text input (non-search)
- **Select**: For selection from predefined options
- **Form**: For complex form layouts

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/SearchBox/`)

---

## Changelog

### December 11, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Added usage examples and patterns
- Clarified when to use SearchBox vs TextInput

