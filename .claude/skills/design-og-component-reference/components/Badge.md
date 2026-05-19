# Badge

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Badge component displays a small status indicator, count, or label. It's commonly used to show notifications, status, or to highlight important information.

### When to Use
- Notification counts
- Status indicators
- Labels or tags
- Highlighting new features
- Counter display on buttons

### When NOT to Use
- Long text labels (use Pill or Tag instead)
- Primary content (Badge is supplementary)
- Interactive elements (use Button instead)

---

## API Reference

### Import
```typescript
import { Badge } from '@eightfold.ai/octuple';
```

### Props

Based on Confluence documentation, Badge accepts standard props. Specific API details need verification from TypeScript definitions.

**Common Usage:**
```typescript
<Badge count={5} />
<Badge dot />
```

---

## Usage Examples

### Badge with Count

```typescript
import React from 'react';
import { Badge, Button } from '@eightfold.ai/octuple';

const BadgeWithCount = () => {
  return (
    <Badge count={5}>
      <Button text="Notifications" />
    </Badge>
  );
};
```

### Dot Badge

```typescript
import { Badge, Avatar } from '@eightfold.ai/octuple';

const DotBadge = () => {
  return (
    <Badge dot>
      <Avatar size="40px" />
    </Badge>
  );
};
```

### Standalone Badge

```typescript
import { Badge } from '@eightfold.ai/octuple';

const StandaloneBadge = () => {
  return (
    <div>
      <Badge count={10} />
      <Badge count={99} />
      <Badge count={100} />
    </div>
  );
};
```

---

## Common Patterns

### Pattern 1: Notification Badge

**When to use:** Display notification counts

```typescript
import { Badge, Button } from '@eightfold.ai/octuple';
import { mdiBell } from '@mdi/js';
import { IconName } from '@mdi/react';

const NotificationBadge = ({ count }: { count: number }) => {
  return (
    <Badge count={count}>
      <Button 
        ariaLabel="Notifications"
        iconProps={{ path: mdiBell as IconName }}
      />
    </Badge>
  );
};
```

### Pattern 2: Status Indicator

**When to use:** Show online/offline status

```typescript
import { Badge, Avatar } from '@eightfold.ai/octuple';

const StatusBadge = ({ online }: { online: boolean }) => {
  return (
    <Badge dot status={online ? 'success' : 'default'}>
      <Avatar size="40px" />
    </Badge>
  );
};
```

---

## Best Practices

### ✅ Do
- Keep counts concise (use 99+ for large numbers)
- Use dot badges for simple indicators
- Position badges consistently
- Use appropriate colors for status

### ❌ Don't
- Don't use for long text
- Don't make badges interactive
- Don't overuse (visual clutter)
- Don't use without clear meaning

---

## Accessibility

- Badge is a visual indicator
- Provide ARIA labels on wrapped elements
- Ensure color is not the only indicator
- Announce count changes to screen readers

---

## Related Components

- **Button**: Common Badge wrapper
- **Avatar**: For status indicators
- **Pill**: For longer labels
- **Icon**: For visual elements

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Badge/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Added common usage patterns
- Included notification and status examples

