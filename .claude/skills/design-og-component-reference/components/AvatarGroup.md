# AvatarGroup

AvatarGroup component for displaying multiple avatars in a group.

## Import

```typescript
import { AvatarGroup } from '@eightfold.ai/octuple';
```

## API Reference

### AvatarGroup Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| avatars | Array of avatar props | `AvatarProps[]` | | |
| classNames | AvatarGroup class names | `string` | | |
| maxCount | Maximum avatars to display | `number` | | |
| maxPopoverContent | Content for overflow popover | `React.ReactNode` | | |
| maxStyle | Style for the "+N" avatar | `React.CSSProperties` | | |
| size | Size of avatars | `<enum>AvatarSize` | `AvatarSize.Medium` | |
| style | Custom styles | `React.CSSProperties` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum AvatarSize {
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
  XSmall = 'xsmall'
}
```

## Usage Examples

### Basic AvatarGroup

```typescript
import { AvatarGroup } from '@eightfold.ai/octuple';

function BasicAvatarGroup() {
  const avatars = [
    { children: 'JD' },
    { children: 'JS' },
    { children: 'BJ' }
  ];

  return <AvatarGroup avatars={avatars} />;
}
```

### AvatarGroup with Images

```typescript
import { AvatarGroup } from '@eightfold.ai/octuple';

function ImageAvatarGroup() {
  const avatars = [
    { src: '/avatars/user1.jpg', alt: 'John Doe' },
    { src: '/avatars/user2.jpg', alt: 'Jane Smith' },
    { src: '/avatars/user3.jpg', alt: 'Bob Johnson' }
  ];

  return <AvatarGroup avatars={avatars} />;
}
```

### AvatarGroup with Max Count

```typescript
import { AvatarGroup } from '@eightfold.ai/octuple';

function LimitedAvatarGroup() {
  const avatars = [
    { children: 'JD' },
    { children: 'JS' },
    { children: 'BJ' },
    { children: 'MK' },
    { children: 'AL' },
    { children: 'TP' }
  ];

  return (
    <AvatarGroup
      avatars={avatars}
      maxCount={3}
    />
  );
}
```

### Sized AvatarGroups

```typescript
import { AvatarGroup, AvatarSize } from '@eightfold.ai/octuple';

function SizedAvatarGroups() {
  const avatars = [
    { children: 'JD' },
    { children: 'JS' },
    { children: 'BJ' }
  ];

  return (
    <>
      <AvatarGroup avatars={avatars} size={AvatarSize.Small} />
      <AvatarGroup avatars={avatars} size={AvatarSize.Medium} />
      <AvatarGroup avatars={avatars} size={AvatarSize.Large} />
    </>
  );
}
```

### AvatarGroup with Popover

```typescript
import { AvatarGroup } from '@eightfold.ai/octuple';

function PopoverAvatarGroup() {
  const avatars = [
    { children: 'JD', tooltip: 'John Doe' },
    { children: 'JS', tooltip: 'Jane Smith' },
    { children: 'BJ', tooltip: 'Bob Johnson' },
    { children: 'MK', tooltip: 'Mary Kane' },
    { children: 'AL', tooltip: 'Alice Lee' }
  ];

  const popoverContent = (
    <div>
      <h4>All Members (5)</h4>
      <ul>
        <li>John Doe</li>
        <li>Jane Smith</li>
        <li>Bob Johnson</li>
        <li>Mary Kane</li>
        <li>Alice Lee</li>
      </ul>
    </div>
  );

  return (
    <AvatarGroup
      avatars={avatars}
      maxCount={3}
      maxPopoverContent={popoverContent}
    />
  );
}
```

### Team Members Display

```typescript
import { AvatarGroup, Card } from '@eightfold.ai/octuple';

interface Member {
  name: string;
  initials: string;
  avatar?: string;
}

function TeamCard() {
  const team: Member[] = [
    { name: 'John Doe', initials: 'JD', avatar: '/avatars/john.jpg' },
    { name: 'Jane Smith', initials: 'JS' },
    { name: 'Bob Johnson', initials: 'BJ' }
  ];

  const avatars = team.map(member => ({
    src: member.avatar,
    children: member.initials,
    alt: member.name
  }));

  return (
    <Card>
      <h3>Project Team</h3>
      <AvatarGroup avatars={avatars} maxCount={5} />
    </Card>
  );
}
```

### Clickable AvatarGroup

```typescript
import { AvatarGroup } from '@eightfold.ai/octuple';

function ClickableAvatarGroup() {
  const handleAvatarClick = (index: number) => {
    console.log('Clicked avatar:', index);
  };

  const avatars = [
    {
      children: 'JD',
      onClick: () => handleAvatarClick(0)
    },
    {
      children: 'JS',
      onClick: () => handleAvatarClick(1)
    },
    {
      children: 'BJ',
      onClick: () => handleAvatarClick(2)
    }
  ];

  return <AvatarGroup avatars={avatars} />;
}
```

### Dynamic AvatarGroup

```typescript
import { AvatarGroup, Button } from '@eightfold.ai/octuple';

function DynamicAvatarGroup() {
  const [members, setMembers] = React.useState([
    { children: 'JD' },
    { children: 'JS' }
  ]);

  const addMember = () => {
    const newInitials = String.fromCharCode(65 + members.length) + String.fromCharCode(66 + members.length);
    setMembers([...members, { children: newInitials }]);
  };

  return (
    <>
      <AvatarGroup avatars={members} maxCount={4} />
      <Button text="Add Member" onClick={addMember} />
    </>
  );
}
```

## Accessibility

- Provide alt text for image avatars
- Use tooltips for avatar identification
- Ensure sufficient color contrast
- Make interactive avatars keyboard accessible
- Announce changes to screen readers

## Best Practices

1. **Limit Display**: Use maxCount for large groups
2. **Consistent Size**: Use same size for all avatars in group
3. **Tooltips**: Provide tooltips for avatar identification
4. **Overflow**: Handle overflow with popover content
5. **Initials**: Use 2-letter initials for text avatars

## Common Mistakes

❌ **Don't** show too many avatars without maxCount

```typescript
// Bad - shows all 50 avatars
<AvatarGroup avatars={fiftyAvatars} />
```

✅ **Do** limit display count

```typescript
// Good
<AvatarGroup avatars={fiftyAvatars} maxCount={5} />
```

❌ **Don't** use inconsistent sizes

```typescript
// Bad - mixing sizes
avatars = [
  { children: 'JD', size: 'small' },
  { children: 'JS', size: 'large' }
]
```

✅ **Do** use consistent sizing

```typescript
// Good
<AvatarGroup avatars={avatars} size={AvatarSize.Medium} />
```

❌ **Don't** forget accessibility

```typescript
// Bad - no identification
<AvatarGroup avatars={[{ children: 'JD' }]} />
```

✅ **Do** provide identification

```typescript
// Good
<AvatarGroup avatars={[
  { children: 'JD', tooltip: 'John Doe', alt: 'John Doe' }
]} />
```

## Related Components

- [Avatar](./Avatar.md) - For individual avatars
- [Card](./Card.md) - Often contains avatar groups
- [Tooltip](./Tooltip.md) - For avatar identification

