# Dropdown

Dropdown component for displaying a menu overlay when triggered.

## Import

```typescript
import { Dropdown } from '@eightfold.ai/octuple';
```

## API Reference

### Dropdown Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| ariaRef | The external element the Dropdown describes | `React.RefObject<HTMLElement>` | | |
| classNames | The Dropdown class names | `string` | | |
| closeOnDropdownClick | Whether the Dropdown closes when clicked | `boolean` | `false` | |
| closeOnOutsideClick | Whether the Dropdown closes when clicked outside | `boolean` | `true` | |
| closeOnReferenceClick | Whether the Dropdown closes when reference is clicked | `boolean` | `false` | |
| disabled | Whether the Dropdown is disabled | `boolean` | `false` | |
| dropdownClassNames | Custom class names for the dropdown content | `string` | | |
| dropdownStyle | Custom styles for the dropdown content | `React.CSSProperties` | | |
| dropdownWidth | Width of the dropdown | `number` | | |
| offset | Pixels to offset the Dropdown from the trigger | `number` | `4` | |
| onVisibleChange | Callback when dropdown visibility changes | `(visible: boolean) => void` | | |
| overlay | The dropdown menu content | `React.ReactNode` | | |
| placement | Placement of the dropdown menu | `<Side \| Placement>` | `'bottom-start'` | |
| portal | Whether to render in a portal | `boolean` | `true` | |
| positionStrategy | Position strategy for the dropdown | `'absolute' \| 'fixed'` | `'absolute'` | |
| referenceClassName | Class name for the reference element | `string` | | |
| referenceElement | Custom reference element | `React.ReactNode` | | |
| referenceOnClick | Whether clicking reference toggles dropdown | `boolean` | `true` | |
| stretch | Whether dropdown stretches to reference width | `boolean` | `false` | |
| trigger | How to trigger the dropdown | `'click' \| 'hover' \| 'contextmenu'` | `'click'` | |
| visible | Controlled visibility state | `boolean` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Types

```typescript
type Side = 'top' | 'right' | 'bottom' | 'left';

type Placement =
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';
```

## Usage Examples

### Basic Dropdown

```typescript
import { Dropdown, Button, Menu } from '@eightfold.ai/octuple';

function BasicDropdown() {
  const menu = {
    items: [
      { key: '1', children: 'Option 1' },
      { key: '2', children: 'Option 2' },
      { key: '3', children: 'Option 3' }
    ],
    onClick: (info: any) => console.log('Clicked:', info.key)
  };

  return (
    <Dropdown overlay={<Menu {...menu} />}>
      <Button text="Click me" />
    </Dropdown>
  );
}
```

### Dropdown with Placement

```typescript
import { Dropdown, Button, Menu } from '@eightfold.ai/octuple';

function PlacementDropdown() {
  const menu = {
    items: [
      { key: '1', children: 'Action 1' },
      { key: '2', children: 'Action 2' }
    ]
  };

  return (
    <>
      <Dropdown overlay={<Menu {...menu} />} placement="top-start">
        <Button text="Top" />
      </Dropdown>
      
      <Dropdown overlay={<Menu {...menu} />} placement="bottom-start">
        <Button text="Bottom" />
      </Dropdown>
      
      <Dropdown overlay={<Menu {...menu} />} placement="left-start">
        <Button text="Left" />
      </Dropdown>
      
      <Dropdown overlay={<Menu {...menu} />} placement="right-start">
        <Button text="Right" />
      </Dropdown>
    </>
  );
}
```

### Hover Trigger

```typescript
import { Dropdown, Button, Menu } from '@eightfold.ai/octuple';

function HoverDropdown() {
  const menu = {
    items: [
      { key: '1', children: 'Quick Action 1' },
      { key: '2', children: 'Quick Action 2' }
    ]
  };

  return (
    <Dropdown overlay={<Menu {...menu} />} trigger="hover">
      <Button text="Hover me" />
    </Dropdown>
  );
}
```

### Controlled Dropdown

```typescript
import { Dropdown, Button, Menu } from '@eightfold.ai/octuple';

function ControlledDropdown() {
  const [visible, setVisible] = React.useState(false);

  const menu = {
    items: [
      { key: '1', children: 'Action 1', onClick: () => console.log('Action 1') },
      { key: '2', children: 'Action 2', onClick: () => console.log('Action 2') }
    ]
  };

  return (
    <>
      <Dropdown
        overlay={<Menu {...menu} />}
        visible={visible}
        onVisibleChange={setVisible}
      >
        <Button text="Controlled Dropdown" />
      </Dropdown>
      
      <Button
        text={visible ? 'Close' : 'Open'}
        onClick={() => setVisible(!visible)}
      />
    </>
  );
}
```

### Dropdown with Custom Content

```typescript
import { Dropdown, Button, Card } from '@eightfold.ai/octuple';

function CustomDropdown() {
  const customContent = (
    <Card style={{ width: 300, padding: '16px' }}>
      <h4>Custom Content</h4>
      <p>You can put any React content here</p>
      <Button text="Action" onClick={() => console.log('Action')} />
    </Card>
  );

  return (
    <Dropdown overlay={customContent}>
      <Button text="Show Custom Content" />
    </Dropdown>
  );
}
```

### Context Menu Dropdown

```typescript
import { Dropdown, Menu } from '@eightfold.ai/octuple';

function ContextMenuDropdown() {
  const menu = {
    items: [
      { key: '1', children: 'Copy' },
      { key: '2', children: 'Paste' },
      { key: '3', children: 'Delete' }
    ],
    onClick: (info: any) => console.log('Context action:', info.key)
  };

  return (
    <Dropdown overlay={<Menu {...menu} />} trigger="contextmenu">
      <div
        style={{
          width: 300,
          height: 200,
          border: '1px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        Right-click me
      </div>
    </Dropdown>
  );
}
```

### Dropdown with Icon Button

```typescript
import { Dropdown, Button, Menu } from '@eightfold.ai/octuple';
import { mdiDotsVertical } from '@mdi/js';

function IconButtonDropdown() {
  const menu = {
    items: [
      { key: '1', children: 'Edit' },
      { key: '2', children: 'Delete' },
      { key: '3', children: 'Share' }
    ]
  };

  return (
    <Dropdown overlay={<Menu {...menu} />}>
      <Button
        iconProps={{ path: mdiDotsVertical }}
        ariaLabel="More actions"
      />
    </Dropdown>
  );
}
```

### Nested Dropdown Menus

```typescript
import { Dropdown, Button, Menu } from '@eightfold.ai/octuple';

function NestedDropdown() {
  const submenu = {
    items: [
      { key: 'sub1', children: 'Sub Option 1' },
      { key: 'sub2', children: 'Sub Option 2' }
    ]
  };

  const menu = {
    items: [
      { key: '1', children: 'Option 1' },
      {
        key: '2',
        children: 'More Options',
        submenu: submenu
      },
      { key: '3', children: 'Option 3' }
    ]
  };

  return (
    <Dropdown overlay={<Menu {...menu} />}>
      <Button text="Nested Menu" />
    </Dropdown>
  );
}
```

## Accessibility

- Ensure dropdown can be opened/closed via keyboard
- Use appropriate ARIA attributes
- Provide clear visual focus indicators
- Ensure menu items are keyboard navigable
- Use semantic menu markup

## Best Practices

1. **Clear Trigger**: Make it obvious the element triggers a dropdown
2. **Appropriate Trigger**: Use click for actions, hover for navigation
3. **Placement**: Choose placement that doesn't obscure content
4. **Menu Structure**: Keep menu hierarchies shallow (max 2 levels)
5. **Action Feedback**: Close dropdown after action selection
6. **Loading States**: Show loading state for async actions

## Common Mistakes

❌ **Don't** use hover trigger for critical actions

```typescript
// Bad - easy to accidentally trigger
<Dropdown trigger="hover" overlay={deleteMenu}>
  <Button text="Delete" />
</Dropdown>
```

✅ **Do** use click trigger for important actions

```typescript
// Good
<Dropdown trigger="click" overlay={deleteMenu}>
  <Button text="Delete" />
</Dropdown>
```

❌ **Don't** nest dropdowns too deeply

```typescript
// Bad - 3+ levels is confusing
<Dropdown overlay={menu1}>
  <Dropdown overlay={menu2}>
    <Dropdown overlay={menu3}>
      <Button />
    </Dropdown>
  </Dropdown>
</Dropdown>
```

✅ **Do** keep menu hierarchies shallow

```typescript
// Good - max 2 levels
<Dropdown overlay={menuWithOneSubmenu}>
  <Button text="Actions" />
</Dropdown>
```

❌ **Don't** forget to close dropdown after action

```typescript
// Bad - dropdown stays open
const menu = {
  items: [
    {
      key: '1',
      children: 'Action',
      onClick: performAction // dropdown stays open
    }
  ]
};
```

✅ **Do** close dropdown explicitly if needed

```typescript
// Good
const [visible, setVisible] = React.useState(false);

const menu = {
  items: [
    {
      key: '1',
      children: 'Action',
      onClick: () => {
        performAction();
        setVisible(false); // close dropdown
      }
    }
  ]
};
```

## Related Components

- [Menu](./Menu.md) - Often used as dropdown content
- [Button](./Button.md) - Common dropdown trigger
- [Select](./Select.md) - For form selection (different from action dropdown)

