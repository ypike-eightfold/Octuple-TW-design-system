# Pill

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Pill component displays a label or tag with optional close functionality. It's commonly used for tags, filters, or removable items.

### When to Use
- Tags or labels
- Selected filters (removable)
- Skill badges
- Categories
- Chips or tokens

### When NOT to Use
- Simple status indicators (use Badge instead)
- Buttons (use Button instead)
- Short counters (use Badge instead)

---

## API Reference

### Import
```typescript
import { Pill, PillSize, PillType } from '@eightfold.ai/octuple';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label of the Pill. |
| `type` | `<enum>PillType` | `PillType.default` | Type of the Pill. |
| `size` | `<enum>PillSize` | - | Size of the Pill. |
| `closable` | `boolean` | `false` | Whether the Pill is closable (shows close button). |
| `onClose` | `React.MouseEventHandler<HTMLButtonElement>` | - | Callback called on click of the close button. |
| `onClick` | `React.MouseEventHandler<HTMLButtonElement>` | - | Callback called on click of the button right of the Pill. |
| `iconProps` | `IconProps` | - | Icon shown before the label. |
| `alignIcon` | `<enum>PillIconAlign` | `PillIconAlign.Left` | The Pill icon alignment. |
| `color` | `string` | - | Custom color for the Pill. |
| `theme` | `OcThemeNames` | `blue` | Theme of the Pill. |
| `closeButtonProps` | `closeButtonProps` | - | Props for the close button, if type is set to `PillType.closable`. `icon`, `onClick`, `size`, `classNames`, are omitted. |
| `pillButtonProps` | `pillButtonProps` | - | Props for the button on the right side of the pill if type is set to `PillType.withButton`. `onClick`, `size`, `classNames`, are omitted. |
| `lineClamp` | `number` | - | Maximum number of lines the Pill label may have. **(v2.23.0+)** |

### TypeScript Enums

```typescript
enum PillType {
  default = 'default',
  closable = 'closable',
  withButton = 'withButton',
}

enum PillIconAlign {
  Left = 'left',
}
```

---

## Usage Examples

### Basic Pill

```typescript
import React from 'react';
import { Pill } from '@eightfold.ai/octuple';

const BasicPill = () => {
  return (
    <Pill label="React" />
  );
};
```

### Closable Pills

```typescript
import { Pill, PillType } from '@eightfold.ai/octuple';
import { useState } from 'react';

const ClosablePills = () => {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js']);

  const handleClose = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {tags.map(tag => (
        <Pill
          key={tag}
          label={tag}
          type={PillType.closable}
          onClose={() => handleClose(tag)}
        />
      ))}
    </div>
  );
};
```

### Pills with Icons

```typescript
import { Pill } from '@eightfold.ai/octuple';
import { mdiReact, mdiLanguageTypescript, mdiNodejs } from '@mdi/js';
import { IconName } from '@mdi/react';

const IconPills = () => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Pill 
        label="React"
        iconProps={{ path: mdiReact as IconName }}
      />
      <Pill 
        label="TypeScript"
        iconProps={{ path: mdiLanguageTypescript as IconName }}
      />
      <Pill 
        label="Node.js"
        iconProps={{ path: mdiNodejs as IconName }}
      />
    </div>
  );
};
```

### Themed Pills

```typescript
import { Pill } from '@eightfold.ai/octuple';

const ThemedPills = () => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Pill label="Blue" theme="blue" />
      <Pill label="Green" theme="green" />
      <Pill label="Red" theme="red" />
      <Pill label="Yellow" theme="yellow" />
      <Pill label="Purple" theme="purple" />
    </div>
  );
};
```

### Color Semantics

Use the following color themes to convey meaning:

| Theme | Color | Semantic Meaning | Use For |
|-------|-------|------------------|---------|
| `green` | Green | Ongoing / In Progress | Active tasks, current status, in-progress items |
| `orange` or `yellow` | Orange/Yellow | Warning | Attention needed, pending items, caution states |
| `red` | Red | Error | Failed items, errors, critical issues |
| `blue` | Blue | Success | Completed items, success states, positive outcomes |

```typescript
import { Pill } from '@eightfold.ai/octuple';

const StatusPills = () => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Pill label="In Progress" theme="green" />    {/* Ongoing */}
      <Pill label="Needs Review" theme="orange" />  {/* Warning */}
      <Pill label="Failed" theme="red" />           {/* Error */}
      <Pill label="Completed" theme="blue" />       {/* Success */}
    </div>
  );
};
```

---

## Common Patterns

### Pattern 1: Skill Tags

**When to use:** Display user skills or tags

```typescript
import { Pill, PillType } from '@eightfold.ai/octuple';

const SkillTags = ({ skills }: { skills: string[] }) => {
  return (
    <div>
      <h4>Skills</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {skills.map(skill => (
          <Pill key={skill} label={skill} theme="blue" />
        ))}
      </div>
    </div>
  );
};
```

### Pattern 2: Filter Tags

**When to use:** Display active filters with remove option

```typescript
import { Pill, PillType } from '@eightfold.ai/octuple';

const FilterTags = ({ filters, onRemove }: { 
  filters: string[], 
  onRemove: (filter: string) => void 
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {filters.map(filter => (
        <Pill
          key={filter}
          label={filter}
          type={PillType.closable}
          onClose={() => onRemove(filter)}
        />
      ))}
    </div>
  );
};
```

---

## Best Practices

### ✅ Do
- Use for tags and labels
- Keep text concise
- Use closable type for removable items
- Group related pills together
- Use appropriate themes/colors

### ❌ Don't
- Don't use for counters (use Badge)
- Don't use for buttons (use Button)
- Don't use extremely long text
- Don't overuse colors

---

## Accessibility

### ARIA Requirements
- Pill label is announced
- Close button has proper aria-label
- Clickable pills are keyboard accessible

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus pill (if clickable) |
| `Enter` | Activate close or click action |

---

## Related Components

- **Badge**: For counters and status
- **Button**: For interactive actions
- **Tag**: Similar component (if available)

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Pill/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented closable and withButton types
- Added icon integration examples
- Included filter and tag patterns

