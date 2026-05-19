# Avatar

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Avatar component displays a user profile picture, icon, or initials in a circular or square container. It's commonly used to represent users, organizations, or entities throughout an application.

### When to Use
- User profile displays
- Comment sections
- User lists
- Contact cards
- Identity representation

### When NOT to Use
- Product images (use Image instead)
- Large profile photos (use Image with custom styling)
- Decorative icons (use Icon instead)

---

## API Reference

### Import
```typescript
import { Avatar, AvatarStatusItems } from '@eightfold.ai/octuple';
```

### Props

Based on Confluence documentation:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string` | - | The Avatar size. Examples: '24px', '32px', '40px', '80px' |
| `type` | `'round' \| 'square'` | `'round'` | The Avatar shape type. |
| `src` | `string` | - | Image source URL. |
| `alt` | `string` | - | Alt text for the image. |
| `icon` | `IconName` | - | Icon to display in Avatar. |
| `children` | `React.ReactNode` | - | Content (usually initials) to display. |

### Avatar Status Items

Sub-component for displaying status indicators on avatars (online, offline, away, etc.).

---

## Usage Examples

### Avatar with Image

```typescript
import React from 'react';
import { Avatar } from '@eightfold.ai/octuple';

const ImageAvatar = () => {
  return (
    <Avatar 
      size="40px" 
      src="https://example.com/avatar.jpg"
      alt="John Doe"
    />
  );
};
```

### Avatar with Initials

```typescript
import { Avatar } from '@eightfold.ai/octuple';

const InitialsAvatar = () => {
  return (
    <Avatar size="40px">
      JD
    </Avatar>
  );
};
```

### Avatar with Icon

```typescript
import { Avatar } from '@eightfold.ai/octuple';
import { mdiAccount } from '@mdi/js';
import { IconName } from '@mdi/react';

const IconAvatar = () => {
  return (
    <Avatar 
      size="40px"
      icon={mdiAccount as IconName}
    />
  );
};
```

### Square Avatar

```typescript
import { Avatar } from '@eightfold.ai/octuple';

const SquareAvatar = () => {
  return (
    <Avatar 
      size="80px"
      type="square"
      src="https://example.com/company-logo.jpg"
      alt="Company Logo"
    />
  );
};
```

### Different Sizes

```typescript
import { Avatar } from '@eightfold.ai/octuple';

const AvatarSizes = () => {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar size="24px">XS</Avatar>
      <Avatar size="32px">S</Avatar>
      <Avatar size="40px">M</Avatar>
      <Avatar size="56px">L</Avatar>
      <Avatar size="80px">XL</Avatar>
    </div>
  );
};
```

### Avatar with Status

```typescript
import { Avatar, AvatarStatusItems, Badge } from '@eightfold.ai/octuple';

const AvatarWithStatus = () => {
  return (
    <Badge dot status="success">
      <Avatar size="40px" src="https://example.com/avatar.jpg" />
    </Badge>
  );
};
```

---

## Common Patterns

### Pattern 1: User Profile Header

**When to use:** Display user information

```typescript
import { Avatar } from '@eightfold.ai/octuple';

const UserProfile = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Avatar size="56px" src="https://example.com/user.jpg" />
      <div>
        <h3 style={{ margin: 0 }}>John Doe</h3>
        <p style={{ margin: 0, color: '#666' }}>Software Engineer</p>
      </div>
    </div>
  );
};
```

### Pattern 2: Comment Avatar

**When to use:** Comments or messaging

```typescript
import { Avatar } from '@eightfold.ai/octuple';

const Comment = () => {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Avatar size="32px">JD</Avatar>
      <div>
        <div style={{ fontWeight: 'bold' }}>John Doe</div>
        <p>This is a comment text.</p>
      </div>
    </div>
  );
};
```

### Pattern 3: User List

**When to use:** List of users or contacts

```typescript
import { Avatar } from '@eightfold.ai/octuple';

const UserList = () => {
  const users = [
    { id: 1, name: 'John Doe', initials: 'JD' },
    { id: 2, name: 'Jane Smith', initials: 'JS' },
    { id: 3, name: 'Bob Johnson', initials: 'BJ' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {users.map(user => (
        <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar size="32px">{user.initials}</Avatar>
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## Best Practices

### ✅ Do
- Always provide `alt` text for images
- Use consistent sizes throughout the app
- Use initials when no image is available
- Use square type for organizations/brands
- Provide fallback content (icon or initials)

### ❌ Don't
- Don't use without alt text (accessibility)
- Don't use extremely large sizes (use Image instead)
- Don't forget to handle missing images
- Don't use for non-identity content

---

## Common Mistakes

### Mistake 1: Missing Alt Text

**Problem:**
```typescript
<Avatar size="40px" src="image.jpg" /> {/* ❌ No alt text */}
```

**Solution:**
```typescript
<Avatar size="40px" src="image.jpg" alt="John Doe" /> {/* ✅ Accessible */}
```

---

### Mistake 2: Using Wrong Type for Size

**Problem:**
```typescript
<Avatar size={40} /> {/* ❌ Should be string with unit */}
```

**Solution:**
```typescript
<Avatar size="40px" /> {/* ✅ Correct */}
```

---

## Accessibility

### ARIA Requirements
- Always provide `alt` text for image avatars
- Use descriptive text for screen readers
- Ensure color contrast for initials

### Screen Reader Support
- Image avatars announce alt text
- Initial avatars announce the initials
- Icon avatars should have aria-label

---

## Related Components

- **Badge**: For status indicators on avatars
- **Card**: Often contains avatars
- **Menu**: User menu with avatar
- **Icon**: Alternative to avatar for non-user entities

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Avatar/`)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial documentation from Confluence
- Documented size prop as string with units
- Added common usage patterns
- Included accessibility guidelines

