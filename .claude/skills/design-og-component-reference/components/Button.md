# Button

**Status:** ✅ Documented from Confluence  
**Last Updated:** November 20, 2024  
**Octuple Version:** 2.54.2  
**Confluence Source:** Eightfold AI Internal Documentation

---

## Overview

### Purpose
The Button component is a clickable element that triggers actions, submits forms, or navigates users through an application. It's one of the most fundamental interactive components in the Octuple Design System.

### When to Use
- Triggering actions (save, delete, submit, cancel)
- Form submissions
- Opening modals or dialogs
- Navigation (when styled as a link-like button)
- Toggle states (with `toggle` prop)
- Split actions (with `split` prop for dropdown menus)

### When NOT to Use
- For navigation between pages (consider using a Link component or Button styled as neutral)
- When a simpler text link would suffice
- For non-interactive decorative elements

---

## API Reference

### Import
```typescript
import { Button, ButtonVariant, ButtonSize, ButtonShape, ButtonIconAlign, ButtonTextAlign, ButtonWidth } from '@eightfold.ai/octuple';
```

###

 Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `text` | `string` | - | - | The button text. Buttons do not have wildcard children props because of A11y concerns. |
| `variant` | `<enum>ButtonVariant` | `ButtonVariant.Default` | - | Determines the Button variant. |
| `size` | `<enum>ButtonSize \| <enum>Size` | `ButtonSize.Medium` | - | Size of the button. Four options: `Flex`, `Large`, `Medium`, `Small`. Flex automatically resizes the button to a large, medium or small size with the browser at Octuple Breakpoints. |
| `shape` | `<enum>ButtonShape \| <enum>Shape` | `ButtonShape.Pill` | - | Shape of the button. Three options: `Rectangle`, `Pill`, `Round`. Round may only be used with buttons that only contain an Icon. |
| `iconProps` | `<interface>IconProps` | - | - | The button icon props (uses `Icon` component). |
| `prefixIconProps` | `<interface>IconProps` | - | - | The button icon props. **(v2.20.5+)** |
| `alignIcon` | `<enum>ButtonIconAlign` | `ButtonIconAlign.Left` | - | The button icon alignment. |
| `alignText` | `<enum>ButtonTextAlign` | `ButtonTextAlign.Center` | - | The button text alignment. |
| `buttonWidth` | `<enum>ButtonWidth` | `ButtonWidth.fitContent` | - | The button width. There are two available options `fitContent` and `fill`. |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | - | - | The button html type. |
| `onClick` | `React.MouseEventHandler<HTMLButtonElement>` | - | - | The button onClick event handler. |
| `disabled` | `boolean` | `false` | - | The button disabled state. |
| `loading` | `boolean` | `false` | - | Determine if the button is in loading state. |
| `checked` | `boolean` | `false` | - | The button checked value. |
| `toggle` | `boolean` | `false` | - | The button is a Toggle Button with distinct on and off states. |
| `split` | `boolean` | `false` | - | Determines whether this button is a Split Button. |
| `splitButtonChecked` | `<interface>SplitButtonProps` | `false` | - | The Split Button checked value. |
| `splitButtonProps` | `SplitButtonProps` | - | - | The Split Button props. The split button props are used to configure the smaller of the two in the split. |
| `onContextMenu` | `React.MouseEventHandler<HTMLButtonElement>` | - | - | The Split Button click event handler. |
| `counter` | `string` | - | - | The button counter string (uses `Badge`). |
| `disruptive` | `boolean` | `false` | - | The button disruptive state. |
| `dropShadow` | `boolean` | `false` | - | The button drop shadow state. |
| `transparent` | `boolean` | `false` | - | The button will remain transparent (Only works with `ButtonVariant.SystemUI`). |
| `floatingButtonProps` | `<interface>FloatingButtonProps` | `{ enabled: false }` | - | The button is always floating on bottom right corner. |
| `allowDisabledFocus` | `boolean` | `false` | - | Allows focus on the button when it's disabled. |
| `ariaLabel` | `string` | - | - | The button aria-label text. |
| `classNames` | `string` | - | - | The button class names. |
| `id` | `string` | - | - | The button id. |
| `style` | `React.CSSProperties` | - | - | The button style. |
| `configContextProps` | `<interface>ConfigContextProps` | `{ noDisabledContext: false, noSizeContext: false }` | - | Configure how contextual props are consumed by enabling or disabling contextually set properties. **(v2.10.0+)** |
| `data-test-id` | `string` | - | - | Unique id used to target element for testing. |
| `ref` | `Ref<HTMLButtonElement>` | - | - | The component ref. |
| `...rest` | `HTMLButtonElement` | - | - | Buttons inherit all attributes of `HTMLButtonElement`. **Only use this if absolutely necessary**. With great power comes great responsibility. |

### TypeScript Enums

```typescript
enum ButtonVariant {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
  SystemUI = 'systemui',
  Neutral = 'neutral',
}

enum ButtonSize {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
}

enum ButtonShape {
  Rectangle = 'rectangle',
  Pill = 'pill',
  Round = 'round',
}

enum ButtonIconAlign {
  Left = 'left',
  Right = 'right',
}

enum ButtonTextAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

enum ButtonWidth {
  fitContent = 'fitContent',
  fill = 'fill',
}
```

---

## Visual States

### Variants
- **Default**: Themed button which is a variant of the tertiary actions
- **Primary**: Emphasized button for primary actions (one per screen recommended)
- **Secondary**: Second level emphasized button for secondary actions
- **SystemUI**: White background button over white background to give the least emphasized actions
- **Neutral**: Light gray background button that is subtle enough to place anywhere. This is our tertiary button.

### Sizes
- **Flex**: Automatically resizes based on browser breakpoints (Large >= 1200, Medium >= 900, Small >= 600, XSmall >= 0)
- **Large**: Large size button
- **Medium**: Default size (recommended for most use cases)
- **Small**: Compact button for tight spaces

### Shapes
- **Pill**: Default rounded corners (most common)
- **Rectangle**: Square corners
- **Round**: Circular (only for icon-only buttons)

### States
- **Default**: Normal interactive state
- **Hover**: Visual feedback on hover
- **Focus**: Keyboard navigation state (visible focus ring)
- **Active**: Pressed state
- **Disabled**: Non-interactive state (`disabled={true}`)
- **Loading**: Processing state (`loading={true}`) with spinner
- **Checked**: Selected state for toggle buttons (`checked={true}`)

---

## Usage Examples

### Basic Usage

```typescript
import React from 'react';
import { Button, ButtonVariant } from '@eightfold.ai/octuple';

const BasicExample = () => {
  return (
    <Button 
      text="Click Me" 
      variant={ButtonVariant.Primary}
      onClick={() => console.log('Button clicked')}
    />
  );
};
```

**Result:** A primary button with the text "Click Me".

### With Icons (MDI)

```typescript
import { Button, ButtonVariant, ButtonIconAlign } from '@eightfold.ai/octuple';
import { mdiPlus, mdiDownload } from '@mdi/js';
import { IconName } from '@mdi/react';

const WithIconExample = () => {
  return (
    <>
      {/* Icon on left (default) */}
      <Button
        text="Add Item"
        variant={ButtonVariant.Primary}
        iconProps={{ path: mdiPlus as IconName }}
        alignIcon={ButtonIconAlign.Left}
      />
      
      {/* Icon on right */}
      <Button
        text="Download"
        variant={ButtonVariant.Default}
        iconProps={{ path: mdiDownload as IconName }}
        alignIcon={ButtonIconAlign.Right}
      />
      
      {/* Icon only (use Round shape) */}
      <Button
        ariaLabel="Add"
        variant={ButtonVariant.Primary}
        shape={ButtonShape.Round}
        iconProps={{ path: mdiPlus as IconName }}
      />
    </>
  );
};
```

### Button Sizes

```typescript
import { Button, ButtonSize } from '@eightfold.ai/octuple';

const SizeExample = () => {
  return (
    <>
      <Button text="Large" size={ButtonSize.Large} />
      <Button text="Medium" size={ButtonSize.Medium} />
      <Button text="Small" size={ButtonSize.Small} />
      <Button text="Flex (Responsive)" size={ButtonSize.Flex} />
    </>
  );
};
```

### Loading State

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';
import { useState } from 'react';

const LoadingExample = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await someAsyncOperation();
    setLoading(false);
  };

  return (
    <Button
      text="Save"
      variant={ButtonVariant.Primary}
      loading={loading}
      onClick={handleClick}
    />
  );
};
```

### Toggle Button

```typescript
import { Button } from '@eightfold.ai/octuple';
import { useState } from 'react';

const ToggleExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Button
      text={checked ? 'Active' : 'Inactive'}
      toggle={true}
      checked={checked}
      onClick={() => setChecked(!checked)}
    />
  );
};
```

### Split Button

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';
import { mdiChevronDown } from '@mdi/js';
import { IconName } from '@mdi/react';

const SplitButtonExample = () => {
  return (
    <Button
      text="Save"
      variant={ButtonVariant.Primary}
      split={true}
      onClick={() => console.log('Main action')}
      onContextMenu={() => console.log('Split action')}
      splitButtonProps={{
        iconProps: { path: mdiChevronDown as IconName }
      }}
    />
  );
};
```

### Form Submit Button

```typescript
import { Button, ButtonVariant, Form, TextInput } from '@eightfold.ai/octuple';

const FormExample = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="email" label="Email">
        <TextInput />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          text="Submit"
          variant={ButtonVariant.Primary}
        />
      </Form.Item>
    </Form>
  );
};
```

### Button with Counter Badge

```typescript
import { Button } from '@eightfold.ai/octuple';

const CounterExample = () => {
  return (
    <Button
      text="Notifications"
      counter="5"
    />
  );
};
```

---

## Common Patterns

### Pattern 1: Action Button Group

**When to use:** Multiple related actions

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';

const ActionGroup = () => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        text="Cancel"
        variant={ButtonVariant.Default}
        onClick={handleCancel}
      />
      <Button
        text="Save"
        variant={ButtonVariant.Primary}
        onClick={handleSave}
      />
    </div>
  );
};
```

**Accessibility:** Ensure logical tab order (Cancel before Save).

### Pattern 2: Destructive Action

**When to use:** Delete, remove, or other destructive actions

```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';
import { mdiDelete } from '@mdi/js';
import { IconName } from '@mdi/react';

const DestructiveAction = () => {
  return (
    <Button
      text="Delete"
      variant={ButtonVariant.SystemUI}
      disruptive={true}
      iconProps={{ path: mdiDelete as IconName }}
      onClick={handleDelete}
    />
  );
};
```

### Pattern 3: Full-Width Button

**When to use:** Mobile layouts, forms, call-to-action sections

```typescript
import { Button, ButtonVariant, ButtonWidth } from '@eightfold.ai/octuple';

const FullWidthButton = () => {
  return (
    <Button
      text="Get Started"
      variant={ButtonVariant.Primary}
      buttonWidth={ButtonWidth.fill}
    />
  );
};
```

---

## Composition

### Works Well With
- **Form**: For form submissions (`htmlType="submit"`)
- **Modal/Dialog**: For modal actions (confirm, cancel)
- **Card**: For card actions
- **Badge**: For counter display (`counter` prop)
- **Icon**: For visual enhancements (`iconProps`)

### Example Composition

```typescript
import { Button, ButtonVariant, Modal, Card } from '@eightfold.ai/octuple';
import { useState } from 'react';

const ModalWithButton = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        text="Open Modal"
        variant={ButtonVariant.Primary}
        onClick={() => setVisible(true)}
      />
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        footer={[
          <Button
            key="cancel"
            text="Cancel"
            onClick={() => setVisible(false)}
          />,
          <Button
            key="ok"
            text="OK"
            variant={ButtonVariant.Primary}
            onClick={() => setVisible(false)}
          />
        ]}
      >
        <p>Modal content</p>
      </Modal>
    </>
  );
};
```

---

## Accessibility

### ARIA Requirements
- **aria-label**: Required for icon-only buttons
  ```typescript
  <Button ariaLabel="Add item" iconProps={{ path: mdiPlus as IconName }} />
  ```
- **Disabled state**: Automatically announced by screen readers
- **Loading state**: Announces "loading" to screen readers
- **Toggle state**: Announces checked/unchecked state

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `Tab` | Focus the button |
| `Shift+Tab` | Focus previous element |
| `Enter` | Activate the button |
| `Space` | Activate the button |

### Screen Reader Support
- Button text is announced as "Button, [text]"
- Icon-only buttons require `ariaLabel`
- Disabled buttons announce "dimmed" or "unavailable"
- Loading buttons announce "loading"
- Toggle buttons announce checked state

### Focus Management
- Visible focus ring on keyboard navigation
- Focus can be allowed on disabled buttons with `allowDisabledFocus` prop
- Focus order should be logical (left-to-right, top-to-bottom)

---

## Best Practices

### ✅ Do
- Use `ButtonVariant.Primary` for the main action on a page (limit to one per screen)
- Provide `ariaLabel` for icon-only buttons
- Use `loading` state for async operations
- Use `disruptive` prop for destructive actions (delete, remove)
- Use meaningful button text that describes the action
- Keep button text concise (2-3 words maximum)
- Use `ButtonWidth.fill` for mobile or full-width layouts

### ❌ Don't
- Use multiple primary buttons on the same screen (causes confusion)
- Create icon-only buttons without `ariaLabel` (fails accessibility)
- Use generic text like "Click here" or "Submit" (be specific: "Save Changes", "Delete User")
- Use buttons for navigation (use link-style buttons or actual links)
- Nest buttons inside other interactive elements
- Use `...rest` props unless absolutely necessary
- Mix button shapes on the same page (maintain consistency)

---

## Common Mistakes

### Mistake 1: Using String Literals for Variant

**Problem:**
```typescript
<Button text="Click" variant="primary" /> // ❌ TypeScript error
```

**Solution:**
```typescript
import { Button, ButtonVariant } from '@eightfold.ai/octuple';

<Button text="Click" variant={ButtonVariant.Primary} /> // ✅ Correct
```

**Why:** Octuple uses TypeScript enums for type safety.

---

### Mistake 2: Icon-Only Button Without Aria Label

**Problem:**
```typescript
<Button iconProps={{ path: mdiPlus as IconName }} /> // ❌ No accessible name
```

**Solution:**
```typescript
<Button 
  ariaLabel="Add item" 
  iconProps={{ path: mdiPlus as IconName }} 
/> // ✅ Accessible
```

**Why:** Screen readers cannot announce icon-only buttons without text or aria-label.

---

### Mistake 3: Forgetting to Cast Icon Path

**Problem:**
```typescript
<Button iconProps={{ path: mdiHome }} /> // ❌ Type error
```

**Solution:**
```typescript
import { IconName } from '@mdi/react';

<Button iconProps={{ path: mdiHome as IconName }} /> // ✅ Correct
```

**Why:** Octuple's `iconProps` expects `IconName` type.

---

### Mistake 4: Multiple Primary Buttons

**Problem:**
```typescript
<Button text="Save" variant={ButtonVariant.Primary} />
<Button text="Delete" variant={ButtonVariant.Primary} />
// ❌ Two primary actions confuse users
```

**Solution:**
```typescript
<Button text="Delete" variant={ButtonVariant.Default} disruptive={true} />
<Button text="Save" variant={ButtonVariant.Primary} />
// ✅ Clear primary action
```

**Why:** Only one primary action should be emphasized per screen.

---

## Design Guidelines

### Spacing
- Margin between buttons: `8px` (small gap) or `16px` (standard gap)
- Padding inside button: Handled automatically by size prop
- Minimum click target: `44px × 44px` (automatically handled by Medium size)

### Typography
- Font: Poppins (default)
- Size: Determined by button size
  - Large: `16px`
  - Medium: `14px`
  - Small: `12px`
- Weight: `500` (Medium)

### Colors
Button colors are handled by the `variant` prop:
- **Primary**: Brand color (highest emphasis)
- **Secondary**: Second level emphasis
- **Default**: Themed button for tertiary actions
- **Neutral**: Light gray background (tertiary, subtle)
- **SystemUI**: White background (least emphasized)
- **Disruptive**: Red/warning color (with `disruptive={true}`)

---

## Responsive Behavior

### Desktop (> 1024px)
- Use `ButtonSize.Medium` or `ButtonSize.Large`
- Buttons can be inline with spacing

### Tablet (768px - 1024px)
- Use `ButtonSize.Medium`
- Consider stacking buttons in narrow containers

### Mobile (< 768px)
- Use `ButtonSize.Flex` for automatic responsive sizing
- Or explicitly use `ButtonSize.Small`
- Consider `ButtonWidth.fill` for full-width buttons
- Stack buttons vertically for better touch targets

```typescript
// Responsive button example
<Button
  text="Submit"
  variant={ButtonVariant.Primary}
  size={ButtonSize.Flex} // Automatically adjusts
  buttonWidth={ButtonWidth.fill} // Full width on mobile
/>
```

---

## Performance Considerations

- Buttons are lightweight and performant
- Avoid creating buttons in loops without proper `key` props
- For lists with many buttons, consider virtualization
- Memoize click handlers to prevent unnecessary re-renders:
  ```typescript
  const handleClick = useCallback(() => {
    // action
  }, [dependencies]);
  ```

---

## Related Components

- **Link**: For navigation between pages
- **IconButton**: For icon-only actions (similar to Button with Round shape)
- **FloatingActionButton**: For persistent floating actions (uses `floatingButtonProps`)
- **Badge**: Used internally for counter display
- **Icon**: Used internally for icon display

---

## Resources

- [Confluence Documentation](https://eightfold.atlassian.net/)
- [TypeScript Definitions](`node_modules/@eightfold.ai/octuple/lib/components/Button/`)
- [MDI Icons](https://pictogrammers.com/library/mdi/)

---

## Changelog

### November 20, 2024 (Octuple v2.54.2)
- Initial comprehensive documentation from Confluence
- Verified all props and types from TypeScript definitions
- Added MDI icon integration examples
- Documented all variants, sizes, and states
- Added accessibility guidelines and keyboard navigation
- Included common patterns and mistakes

