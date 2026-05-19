# Icon

Icon component for displaying SVG icons in the Octuple design system.

## Import

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
```

## API Reference

### Icon Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| ariaHidden | If the Icon is aria hidden | `boolean` | `true` | |
| classNames | The Icon class names | `string` | | |
| color | The Icon fill color | `string` | | |
| description | The Icon description for accessibility | `string` | | |
| horizontal | Flip the Icon on the horizontal axis | `boolean` | `false` | |
| icomoonIconName | The Icomoon Icon name | `string` | | |
| id | The Icon id | `string` | | |
| path | The Icon svg path | `string` | | |
| role | The Icon role | `string` | `'presentation'` | |
| rotate | Degrees to rotate the Icon | `number` | `0` | |
| size | The Icon size | `IconSize \| number` | `IconSize.Medium` | |
| spin | Animate the Icon with a spin animation | `boolean` | `false` | |
| style | The Icon custom styles | `React.CSSProperties` | | |
| title | The Icon title for accessibility | `string` | | |
| vertical | Flip the Icon on the vertical axis | `boolean` | `false` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<SVGSVGElement>` | | |

## TypeScript Enums

```typescript
enum IconSize {
  Large = 24,
  Medium = 20,
  Small = 16,
  XSmall = 14
}
```

## Usage with MDI Icons

The recommended way to use icons in Octuple is with Material Design Icons (MDI).

```bash
npm install @mdi/js @mdi/react
```

### Basic Icon

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiAccount, mdiHome, mdiEmail } from '@mdi/js';

function BasicIcons() {
  return (
    <>
      <Icon path={mdiAccount} size={IconSize.Medium} />
      <Icon path={mdiHome} size={IconSize.Medium} />
      <Icon path={mdiEmail} size={IconSize.Medium} />
    </>
  );
}
```

### Icon Sizes

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiStar } from '@mdi/js';

function IconSizes() {
  return (
    <>
      <Icon path={mdiStar} size={IconSize.XSmall} />
      <Icon path={mdiStar} size={IconSize.Small} />
      <Icon path={mdiStar} size={IconSize.Medium} />
      <Icon path={mdiStar} size={IconSize.Large} />
      {/* Custom size */}
      <Icon path={mdiStar} size={32} />
    </>
  );
}
```

### Colored Icons

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiHeart, mdiStar, mdiAlert } from '@mdi/js';

function ColoredIcons() {
  return (
    <>
      <Icon path={mdiHeart} size={IconSize.Large} color="#ff4d4f" />
      <Icon path={mdiStar} size={IconSize.Large} color="#faad14" />
      <Icon path={mdiAlert} size={IconSize.Large} color="#52c41a" />
    </>
  );
}
```

### Rotating Icons

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiArrowRight } from '@mdi/js';

function RotatingIcons() {
  return (
    <>
      <Icon path={mdiArrowRight} size={IconSize.Medium} rotate={0} />
      <Icon path={mdiArrowRight} size={IconSize.Medium} rotate={90} />
      <Icon path={mdiArrowRight} size={IconSize.Medium} rotate={180} />
      <Icon path={mdiArrowRight} size={IconSize.Medium} rotate={270} />
    </>
  );
}
```

### Spinning Icon

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiLoading } from '@mdi/js';

function SpinningIcon() {
  return (
    <Icon
      path={mdiLoading}
      size={IconSize.Large}
      spin={true}
    />
  );
}
```

### Icon in Button

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';
import { mdiPlus, mdiDelete, mdiPencil } from '@mdi/js';

function IconButtons() {
  return (
    <>
      <Button
        text="Add"
        variant={ButtonVariant.Primary}
        iconProps={{ path: mdiPlus }}
      />
      <Button
        text="Edit"
        variant={ButtonVariant.Secondary}
        iconProps={{ path: mdiPencil }}
      />
      <Button
        text="Delete"
        variant={ButtonVariant.Disruptive}
        iconProps={{ path: mdiDelete }}
      />
    </>
  );
}
```

### Icon with Accessibility

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiInformation } from '@mdi/js';

function AccessibleIcon() {
  return (
    <Icon
      path={mdiInformation}
      size={IconSize.Medium}
      ariaHidden={false}
      title="Information"
      description="Click for more details"
      role="img"
    />
  );
}
```

### Flipped Icons

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiArrowRight } from '@mdi/js';

function FlippedIcons() {
  return (
    <>
      <Icon path={mdiArrowRight} size={IconSize.Medium} />
      <Icon path={mdiArrowRight} size={IconSize.Medium} horizontal={true} />
      <Icon path={mdiArrowRight} size={IconSize.Medium} vertical={true} />
    </>
  );
}
```

## Finding Icons

Browse and search for icons at:
- **Material Design Icons**: https://pictogrammers.com/library/mdi/

## Common Icon Patterns

### Status Icons

```typescript
import { Icon, IconSize } from '@eightfold.ai/octuple';
import { mdiCheckCircle, mdiAlertCircle, mdiInformationOutline, mdiCloseCircle } from '@mdi/js';

function StatusIcons() {
  return (
    <>
      <Icon path={mdiCheckCircle} size={IconSize.Medium} color="#52c41a" />
      <Icon path={mdiAlertCircle} size={IconSize.Medium} color="#faad14" />
      <Icon path={mdiInformationOutline} size={IconSize.Medium} color="#1890ff" />
      <Icon path={mdiCloseCircle} size={IconSize.Medium} color="#ff4d4f" />
    </>
  );
}
```

### Action Icons

```typescript
import { mdiPlus, mdiDelete, mdiPencil, mdiContentCopy, mdiDownload, mdiUpload } from '@mdi/js';
```

### Navigation Icons

```typescript
import { mdiHome, mdiAccount, mdiCog, mdiMenu, mdiChevronLeft, mdiChevronRight } from '@mdi/js';
```

## Accessibility

- Use `ariaHidden={false}` for decorative icons
- Provide `title` and `description` for meaningful icons
- Set appropriate `role` (typically "img" for meaningful icons)
- Use color combinations with sufficient contrast
- Don't rely solely on icon color to convey meaning

## Best Practices

1. **Consistent Sizing**: Use IconSize enum for consistency
2. **Semantic Meaning**: Choose icons that clearly represent their action
3. **Color Usage**: Use color to reinforce meaning, not as sole indicator
4. **Accessibility**: Always consider screen reader users
5. **Loading States**: Use spin animation for loading indicators

## Common Mistakes

❌ **Don't** use icon alone for critical actions

```typescript
// Bad - unclear what this does
<Icon path={mdiDelete} />
```

✅ **Do** pair with text or use in button with text

```typescript
// Good
<Button
  text="Delete"
  iconProps={{ path: mdiDelete }}
/>
```

❌ **Don't** use custom sizes haphazardly

```typescript
// Bad - inconsistent sizing
<Icon path={mdiHome} size={13} />
<Icon path={mdiAccount} size={22} />
```

✅ **Do** use IconSize enum

```typescript
// Good
<Icon path={mdiHome} size={IconSize.Medium} />
<Icon path={mdiAccount} size={IconSize.Medium} />
```

❌ **Don't** forget accessibility for meaningful icons

```typescript
// Bad - screen readers can't understand
<button>
  <Icon path={mdiDelete} />
</button>
```

✅ **Do** provide proper labels

```typescript
// Good
<button aria-label="Delete item">
  <Icon path={mdiDelete} />
</button>
// Or better:
<Button text="Delete" iconProps={{ path: mdiDelete }} />
```

## Related Components

- [Button](./Button.md) - Uses icons via iconProps
- [Badge](./Badge.md) - Can display icons
- [Avatar](./Avatar.md) - Can use icon as content

