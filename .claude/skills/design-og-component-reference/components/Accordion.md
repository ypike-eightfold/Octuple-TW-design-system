# Accordion

Accordion component for expandable/collapsible content panels.

## Import

```typescript
import { Accordion } from '@eightfold.ai/octuple';
```

## API Reference

### Accordion Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| bordered | Toggle whether Accordion shows a border | `boolean` | `false` | |
| classNames | The Accordion class names | `string` | | |
| configContextProps | Configure how contextual props are consumed | `ConfigContextProps` | `{ noDisabledContext: false, noShapeContext: false, noSizeContext: false }` | >= 2.10.0 |
| expandIconAlign | The position of expand icon | `AccordionIconAlign` | `AccordionIconAlign.End` | |
| expanded | The expanded state of the Accordion | `boolean` | `false` | |
| headerClassNames | Custom classnames of the Accordion header | `string` | | |
| iconProps | Props for the Accordion icon button | `IconProps` | | |
| id | The Accordion id | `string` | | |
| onClick | The Accordion on click event handler | `React.MouseEventHandler<HTMLButtonElement>` | | |
| onKeyDown | The Accordion on key down event handler | `React.KeyboardEventHandler<HTMLButtonElement>` | | |
| renderExpandIcon | Custom render expand icon | `(accordionProps: AccordionProps) => React.ReactNode` | | |
| shape | The Accordion shape | `<enum>AccordionShape \| <enum>Shape` | `AccordionShape.Rectangle` | |
| size | The Accordion size | `<enum>AccordionSize \| <enum>Size` | `AccordionSize.Medium` | |
| summary | Summary of Accordion contents | `React.ReactNode` | | |
| summaryClassNames | Custom classnames of the Accordion summary | `string` | | |
| badgeProps | Props for the Accordion Badge | `BadgeProps` | | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDetailsElement>` | | |
| ...rest | Accordion inherits all attributes of HTMLDetailsElement. **Only use this if absolutely necessary**. With great power comes great responsibility. | `HTMLDetailsElement` | | |

## TypeScript Enums

```typescript
enum AccordionIconAlign {
  Start = 'start',
  End = 'end'
}

enum AccordionShape {
  Rectangle = 'rectangle',
  Pill = 'pill'
}

enum AccordionSize {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

enum Shape {
  Rectangle = 'rectangle',
  Pill = 'pill',
  Round = 'round'
}

enum Size {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}
```

## Usage Examples

### Basic Accordion

```typescript
import { Accordion } from '@eightfold.ai/octuple';

function BasicAccordion() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Accordion
      summary="Click to expand"
      expanded={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      <p>This is the accordion content that can be expanded or collapsed.</p>
    </Accordion>
  );
}
```

### Multiple Accordions

```typescript
import { Accordion } from '@eightfold.ai/octuple';

function FAQ() {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const faqs = [
    {
      id: 'q1',
      question: 'What is Octuple?',
      answer: 'Octuple is a design system by Eightfold AI.'
    },
    {
      id: 'q2',
      question: 'How do I install it?',
      answer: 'Run npm install @eightfold.ai/octuple'
    },
    {
      id: 'q3',
      question: 'Is it free?',
      answer: 'Yes, it is open source.'
    }
  ];

  return (
    <div>
      {faqs.map((faq) => (
        <Accordion
          key={faq.id}
          summary={faq.question}
          expanded={expandedId === faq.id}
          onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
          bordered
        >
          <p>{faq.answer}</p>
        </Accordion>
      ))}
    </div>
  );
}
```

### Accordion with Badge

```typescript
import { Accordion } from '@eightfold.ai/octuple';

function NotificationAccordion() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Accordion
      summary="Notifications"
      expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      badgeProps={{
        value: '3',
        theme: 'red'
      }}
    >
      <ul>
        <li>Notification 1</li>
        <li>Notification 2</li>
        <li>Notification 3</li>
      </ul>
    </Accordion>
  );
}
```

### Styled Accordion

```typescript
import { Accordion, AccordionShape, AccordionSize, AccordionIconAlign } from '@eightfold.ai/octuple';

function StyledAccordion() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Accordion
      summary="Settings"
      expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      shape={AccordionShape.Pill}
      size={AccordionSize.Large}
      expandIconAlign={AccordionIconAlign.Start}
      bordered
    >
      <div style={{ padding: '16px' }}>
        <p>Configuration options go here</p>
      </div>
    </Accordion>
  );
}
```

### Accordion with Custom Icon

```typescript
import { Accordion } from '@eightfold.ai/octuple';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

function CustomIconAccordion() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Accordion
      summary="Advanced Options"
      expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      renderExpandIcon={(props) => (
        <Icon
          path={props.expanded ? mdiChevronUp : mdiChevronDown}
          size={0.8}
        />
      )}
    >
      <p>Advanced configuration options</p>
    </Accordion>
  );
}
```

### Nested Accordions

```typescript
import { Accordion } from '@eightfold.ai/octuple';

function NestedAccordions() {
  const [parent, setParent] = React.useState(false);
  const [child1, setChild1] = React.useState(false);
  const [child2, setChild2] = React.useState(false);

  return (
    <Accordion
      summary="Parent Category"
      expanded={parent}
      onClick={() => setParent(!parent)}
      bordered
    >
      <Accordion
        summary="Subcategory 1"
        expanded={child1}
        onClick={() => setChild1(!child1)}
      >
        <p>Content for subcategory 1</p>
      </Accordion>
      
      <Accordion
        summary="Subcategory 2"
        expanded={child2}
        onClick={() => setChild2(!child2)}
      >
        <p>Content for subcategory 2</p>
      </Accordion>
    </Accordion>
  );
}
```

## Accessibility

- Use semantic HTML (`<details>` element)
- Provide clear summary text
- Ensure keyboard navigation works (Tab, Space, Enter)
- Accordion state should be visible (expanded/collapsed)
- Screen readers should announce state changes

## Best Practices

1. **Clear Summary**: Write concise, descriptive summary text
2. **Single Expansion**: For FAQ-style lists, typically only one accordion should be open at a time
3. **Appropriate Content**: Use accordions for optional or secondary information
4. **Visual Indicators**: Keep default expand/collapse icons visible
5. **Keyboard Support**: Ensure Space/Enter toggles accordion

## Common Mistakes

❌ **Don't** hide critical information in accordions

```typescript
// Bad - critical form fields hidden
<Accordion summary="Required Information">
  <TextInput label="Email" required />
</Accordion>
```

✅ **Do** keep critical content visible

```typescript
// Good - critical content always visible
<TextInput label="Email" required />
<Accordion summary="Additional Information">
  <TextInput label="Middle Name" />
</Accordion>
```

❌ **Don't** nest accordions too deeply

```typescript
// Bad - 4+ levels deep
<Accordion>
  <Accordion>
    <Accordion>
      <Accordion>...</Accordion>
    </Accordion>
  </Accordion>
</Accordion>
```

✅ **Do** limit nesting to 2 levels

```typescript
// Good
<Accordion summary="Category">
  <Accordion summary="Subcategory">
    <Content />
  </Accordion>
</Accordion>
```

❌ **Don't** forget to manage state

```typescript
// Bad - uncontrolled, may cause issues
<Accordion summary="Title">Content</Accordion>
```

✅ **Do** control expanded state

```typescript
// Good
const [expanded, setExpanded] = React.useState(false);
<Accordion
  summary="Title"
  expanded={expanded}
  onClick={() => setExpanded(!expanded)}
>
  Content
</Accordion>
```

## Related Components

- [Panel](./Panel.md) - For slide-out panels
- [Tabs](./Tabs.md) - For tabbed content organization
- [Card](./Card.md) - For grouped content display

