# ToggleButton

Toggle Button is part of Button and may use any of its properties. The props below are related to or specific to Toggle Button.

## Import

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';
```

## API Reference

### ToggleButton Props

ToggleButton uses the same Button component with additional toggle-specific props.

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| alignIcon | The button icon alignment | `<enum>ButtonIconAlign` | `ButtonIconAlign.Left` | |
| checked | The button checked value | `boolean` | `false` | |
| iconProps | The button icon props (uses Icon) | `<interface>IconProps` | | |
| toggle | The button is a Toggle Button with distinct on and off states | `boolean` | `false` | |

For complete Button props, see [Button](./Button.md).

## TypeScript Enums

```typescript
enum ButtonIconAlign {
  Left = 'left',
  Right = 'right'
}
```

## Usage Examples

### Basic Toggle Button

```typescript
import { Button } from '@eightfold.ai/octuple';

function BasicToggle() {
  const [checked, setChecked] = React.useState(false);

  return (
    <Button
      toggle
      checked={checked}
      text={checked ? 'On' : 'Off'}
      onClick={() => setChecked(!checked)}
    />
  );
}
```

### Toggle Button with Icon

```typescript
import { Button, ButtonIconAlign } from '@eightfold.ai/octuple';
import { mdiLightbulb, mdiLightbulbOutline } from '@mdi/js';

function IconToggle() {
  const [checked, setChecked] = React.useState(false);

  return (
    <Button
      toggle
      checked={checked}
      text={checked ? 'Light On' : 'Light Off'}
      iconProps={{
        path: checked ? mdiLightbulb : mdiLightbulbOutline
      }}
      onClick={() => setChecked(!checked)}
    />
  );
}
```

### Toggle Button Variants

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';

function VariantToggles() {
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(false);

  return (
    <>
      <Button
        toggle
        checked={checked1}
        text="Primary"
        variant={ButtonVariant.Primary}
        onClick={() => setChecked1(!checked1)}
      />
      
      <Button
        toggle
        checked={checked2}
        text="Secondary"
        variant={ButtonVariant.Secondary}
        onClick={() => setChecked2(!checked2)}
      />
      
      <Button
        toggle
        checked={checked3}
        text="Default"
        variant={ButtonVariant.Default}
        onClick={() => setChecked3(!checked3)}
      />
    </>
  );
}
```

### Icon Position Toggle

```typescript
import { Button, ButtonIconAlign } from '@eightfold.ai/octuple';
import { mdiHeart, mdiHeartOutline } from '@mdi/js';

function IconAlignToggle() {
  const [liked, setLiked] = React.useState(false);

  return (
    <>
      <Button
        toggle
        checked={liked}
        text="Like"
        iconProps={{
          path: liked ? mdiHeart : mdiHeartOutline
        }}
        alignIcon={ButtonIconAlign.Left}
        onClick={() => setLiked(!liked)}
      />
      
      <Button
        toggle
        checked={liked}
        text="Like"
        iconProps={{
          path: liked ? mdiHeart : mdiHeartOutline
        }}
        alignIcon={ButtonIconAlign.Right}
        onClick={() => setLiked(!liked)}
      />
    </>
  );
}
```

### Favorite Toggle

```typescript
import { Button } from '@eightfold.ai/octuple';
import { mdiStar, mdiStarOutline } from '@mdi/js';

function FavoriteToggle() {
  const [favorite, setFavorite] = React.useState(false);

  return (
    <Button
      toggle
      checked={favorite}
      text={favorite ? 'Favorited' : 'Favorite'}
      iconProps={{
        path: favorite ? mdiStar : mdiStarOutline
      }}
      onClick={() => setFavorite(!favorite)}
    />
  );
}
```

### Follow/Unfollow Toggle

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';
import { mdiAccountPlus, mdiAccountCheck } from '@mdi/js';

function FollowToggle() {
  const [following, setFollowing] = React.useState(false);

  return (
    <Button
      toggle
      checked={following}
      text={following ? 'Following' : 'Follow'}
      variant={following ? ButtonVariant.Secondary : ButtonVariant.Primary}
      iconProps={{
        path: following ? mdiAccountCheck : mdiAccountPlus
      }}
      onClick={() => setFollowing(!following)}
    />
  );
}
```

### Mute/Unmute Toggle

```typescript
import { Button } from '@eightfold.ai/octuple';
import { mdiVolumeHigh, mdiVolumeOff } from '@mdi/js';

function MuteToggle() {
  const [muted, setMuted] = React.useState(false);

  return (
    <Button
      toggle
      checked={muted}
      text={muted ? 'Unmute' : 'Mute'}
      iconProps={{
        path: muted ? mdiVolumeOff : mdiVolumeHigh
      }}
      onClick={() => setMuted(!muted)}
    />
  );
}
```

### Bookmark Toggle

```typescript
import { Button } from '@eightfold.ai/octuple';
import { mdiBookmark, mdiBookmarkOutline } from '@mdi/js';

function BookmarkToggle() {
  const [bookmarked, setBookmarked] = React.useState(false);

  return (
    <Button
      toggle
      checked={bookmarked}
      text={bookmarked ? 'Bookmarked' : 'Bookmark'}
      iconProps={{
        path: bookmarked ? mdiBookmark : mdiBookmarkOutline
      }}
      onClick={() => setBookmarked(!bookmarked)}
    />
  );
}
```

### Group of Toggle Buttons

```typescript
import { Button } from '@eightfold.ai/octuple';

function ToggleGroup() {
  const [toggles, setToggles] = React.useState({
    bold: false,
    italic: false,
    underline: false
  });

  const handleToggle = (key: string) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        toggle
        checked={toggles.bold}
        text="Bold"
        onClick={() => handleToggle('bold')}
      />
      <Button
        toggle
        checked={toggles.italic}
        text="Italic"
        onClick={() => handleToggle('italic')}
      />
      <Button
        toggle
        checked={toggles.underline}
        text="Underline"
        onClick={() => handleToggle('underline')}
      />
    </div>
  );
}
```

## Accessibility

- Provide clear button text for both states
- Use appropriate icons for visual feedback
- Ensure keyboard navigation works (Tab, Space, Enter)
- Use aria-pressed attribute (handled automatically)
- Provide sufficient color contrast in both states

## Best Practices

1. **Clear States**: Use distinct icons/text for checked/unchecked states
2. **Consistent Behavior**: Maintain predictable toggle behavior
3. **Visual Feedback**: Provide clear visual indication of state
4. **Appropriate Icons**: Use icons that clearly represent the action
5. **State Management**: Properly manage checked state in parent component
6. **Variants**: Choose appropriate variant for context

## Common Mistakes

❌ **Don't** forget to set toggle prop

```typescript
// Bad - not a toggle button
<Button checked={checked} text="Toggle" />
```

✅ **Do** set toggle prop

```typescript
// Good
<Button toggle checked={checked} text="Toggle" onClick={handleClick} />
```

❌ **Don't** use same icon for both states

```typescript
// Bad - confusing visual feedback
<Button
  toggle
  checked={checked}
  iconProps={{ path: mdiCheck }}
/>
```

✅ **Do** use different icons

```typescript
// Good
<Button
  toggle
  checked={checked}
  iconProps={{
    path: checked ? mdiCheck : mdiCheckOutline
  }}
/>
```

❌ **Don't** forget to handle state

```typescript
// Bad - no state management
<Button toggle checked={false} text="Toggle" />
```

✅ **Do** manage state properly

```typescript
// Good
const [checked, setChecked] = React.useState(false);
<Button
  toggle
  checked={checked}
  text="Toggle"
  onClick={() => setChecked(!checked)}
/>
```

## Related Components

- [Button](./Button.md) - Base button component
- [Switch](./Switch.md) - For simple on/off toggles
- [Checkbox](./Checkbox.md) - For form selections
- [RadioButton](./RadioButton.md) - For exclusive selections

