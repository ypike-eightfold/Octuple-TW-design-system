# SkillBlock

SkillBlock component for displaying skills with assessment, endorsement, and expandable content.

## Import

```typescript
import { SkillBlock } from '@eightfold.ai/octuple';
import {
  BelowLargeImg,
  BelowMediumImg,
  BelowSmallImg,
  // ... other skill assessment images
} from '@eightfold.ai/octuple';
```

## API Reference

### SkillBlock Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| allowDisabledFocus | Allows focus on the SkillBlock when it's disabled | `boolean` | | |
| animate | The SkillBlock animates expand and collapse | `boolean` | `true` | |
| assessment | The SkillBlock assessment status | `SkillAssessment` | | |
| background | Custom background color of the SkillBlock | `string` | | |
| blockEndClassNames | Custom classnames of the SkillBlock end block | `string` | | |
| blockEndStyles | Custom inline styles of the SkillBlock end block element | `React.CSSProperties` | | |
| blockStartClassNames | Custom classnames of the SkillBlock start block | `string` | | |
| blockStartStyles | Custom inline styles of the SkillBlock start block element | `React.CSSProperties` | | |
| bordered | Whether the SkillBlock is bordered or not | `boolean` | `true` | |
| classNames | Custom classnames of the SkillBlock | `string` | | |
| clickable | Whether or not the SkillBlock is clickable | `boolean` | `false` | |
| color | Custom color of the SkillBlock | `string` | | |
| content | The content of the SkillBlock | `React.ReactNode` | | |
| contentClassNames | Custom classes for the content | `string` | | |
| customButtonProps | Props for the custom button | `ButtonProps` | | |
| disabled | The SkillBlock is in a disabled state | `boolean` | `false` | |
| endorsement | Whether the SkillBlock is endorsed or not | `boolean` | `false` | |
| endorseButtonProps | Props for the endorsement button | `ButtonProps` | | |
| expandable | Whether or not the SkillBlock is expandable | `boolean` | `false` | |
| expanded | Whether the SkillBlock is expanded | `boolean` | `false` | |
| expandedContent | The expanded content of the SkillBlock | `React.ReactNode` | | |
| expandedContentClassNames | Custom classes for the expanded content | `string` | | |
| extraContent | The extra content of the SkillBlock | `React.ReactNode` | | |
| extraContentClassNames | Custom classes for the extra content | `string` | | |
| footer | The footer content of the SkillBlock | `React.ReactNode` | | |
| footerClassNames | Custom classes for the footer | `string` | | |
| highlightButtonProps | Props for the highlight button | `ButtonProps` | | |
| hoverable | Whether or not the SkillBlock is hoverable | `boolean` | `false` | |
| iconProps | Icon shown before the label | `IconProps` | | |
| id | The SkillBlock id | `string` | | |
| inlineSvgProps | InlineSvg shown before the label | `InlineSvgProps` | | |
| itemMenuAriaLabel | Aria label for the overflow button | `string` | | |
| itemMenuButtonProps | Props for the item menu button | `ButtonProps` | | |
| itemMenuDropdownProps | The item menu Dropdown and overlay props | `DropdownProps` | `{}` | |
| itemMenuOnly | Whether or not the item menu button is the only one visible | `boolean` | | |
| key | Unique key of the SkillBlock | `Key` | | |
| label | The SkillBlock label | `string` | | |
| labelWidth | Custom label width | `number` | | |
| lineClamp | Maximum number of lines the SkillBlock label can have | `number` | | |
| maxWidth | Custom max-width of the SkillBlock | `number \| string` | | |
| menuItems | Items to display in the overflow menu | `Array<MenuItemTypes>` | | |
| minWidth | Custom min-width of the SkillBlock | `number \| string` | `'fit-content'` | |
| onBlur | Callback called on blur of the SkillBlock | `React.FocusEventHandler<HTMLDivElement>` | | |
| onClick | Callback called on click of the SkillBlock | `React.MouseEventHandler<HTMLDivElement>` | | |
| onFocus | Callback called on focus of the SkillBlock | `React.FocusEventHandler<HTMLDivElement>` | | |
| onKeyDown | Callback called on keydown of the SkillBlock | `React.KeyboardEventHandler<HTMLDivElement>` | | |
| onMouseEnter | Callback called on mouse enter of the SkillBlock | `React.MouseEventHandler<HTMLDivElement>` | | |
| onMouseLeave | Callback called on mouse leave of the SkillBlock | `React.MouseEventHandler<HTMLDivElement>` | | |
| readonly | The SkillBlock is readonly | `boolean` | | |
| reflow | Whether or not to manually reflow the content after the button list | `boolean` | | |
| required | The SkillBlock is required | `boolean` | `false` | |
| requiredMark | Required mark enabled | `boolean` | `true` | |
| role | Role of the SkillBlock | `string` | `'button'` | |
| showLabelAssessmentIcon | Whether to display the assessment Icon next to the Label | `boolean` | | |
| status | The SkillBlock status | `SkillStatus` | `SkillStatus.Default` | |
| style | The custom style of the SkillBlock | `React.CSSProperties` | | |
| tabIndex | The SkillBlock tab-index | `number` | `0` | |
| theme | Theme of the SkillBlock | `OcThemeName \| SkillThemeName` | `white` | |
| title | Title of the SkillBlock | `string` | | |
| updateDimension | Callback when the SkillBlock dimensions have changed | `(async?: boolean, delay?: number) => void` | | |
| width | Custom width of the SkillBlock | `number \| string` | | |

## Skill Assessment Images

Octuple exports Skill Assessment Images as SVGs. Available in three sizes: Large, Medium, and Small:

```typescript
import {
  BelowLargeImg,
  BelowMediumImg,
  BelowSmallImg,
  BelowUpskillingLargeImg,
  BelowUpskillingMediumImg,
  BelowUpskillingSmallImg,
  ExceedLargeImg,
  ExceedMediumImg,
  ExceedSmallImg,
  ExceedUpskillingLargeImg,
  ExceedUpskillingMediumImg,
  ExceedUpskillingSmallImg,
  MeetLargeImg,
  MeetMediumImg,
  MeetSmallImg,
  MeetUpskillingLargeImg,
  MeetUpskillingMediumImg,
  MeetUpskillingSmallImg,
  UpskillingLargeImg,
  UpskillingMediumImg,
  UpskillingSmallImg
} from '@eightfold.ai/octuple';
```

Helper properties for mapping:

```typescript
import {
  matchingSkillAssessment,
  matchingSkillStatus
} from '@eightfold.ai/octuple';
```

## Usage Examples

### Basic SkillBlock

```typescript
import { SkillBlock } from '@eightfold.ai/octuple';

function BasicSkillBlock() {
  return (
    <SkillBlock
      label="JavaScript"
      content="Programming language"
    />
  );
}
```

### SkillBlock with Assessment

```typescript
import { SkillBlock, SkillAssessment } from '@eightfold.ai/octuple';

function AssessedSkillBlock() {
  return (
    <SkillBlock
      label="React Development"
      assessment={SkillAssessment.Exceed}
      showLabelAssessmentIcon={true}
      content="Expert level proficiency"
    />
  );
}
```

### Expandable SkillBlock

```typescript
import { SkillBlock } from '@eightfold.ai/octuple';

function ExpandableSkillBlock() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <SkillBlock
      label="Python"
      content="Programming language for data science"
      expandable={true}
      expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      expandedContent={
        <div>
          <h4>Skills Details</h4>
          <ul>
            <li>Data Analysis</li>
            <li>Machine Learning</li>
            <li>Web Development</li>
          </ul>
        </div>
      }
    />
  );
}
```

### SkillBlock with Endorsement

```typescript
import { SkillBlock } from '@eightfold.ai/octuple';

function EndorsedSkillBlock() {
  const [endorsed, setEndorsed] = React.useState(false);

  return (
    <SkillBlock
      label="Leadership"
      content="Team management and mentoring"
      endorsement={endorsed}
      endorseButtonProps={{
        text: endorsed ? 'Endorsed' : 'Endorse',
        onClick: () => setEndorsed(!endorsed)
      }}
    />
  );
}
```

### SkillBlock with Menu

```typescript
import { SkillBlock } from '@eightfold.ai/octuple';

function MenuSkillBlock() {
  const menuItems = [
    { key: 'edit', children: 'Edit', onClick: () => console.log('Edit') },
    { key: 'delete', children: 'Delete', onClick: () => console.log('Delete') },
    { key: 'share', children: 'Share', onClick: () => console.log('Share') }
  ];

  return (
    <SkillBlock
      label="Project Management"
      content="Agile methodologies"
      menuItems={menuItems}
      itemMenuAriaLabel="Skill actions"
    />
  );
}
```

### Clickable SkillBlock

```typescript
import { SkillBlock } from '@eightfold.ai/octuple';

function ClickableSkillBlock() {
  const handleClick = () => {
    console.log('Skill block clicked');
  };

  return (
    <SkillBlock
      label="Communication"
      content="Written and verbal"
      clickable={true}
      onClick={handleClick}
      hoverable={true}
    />
  );
}
```

### SkillBlock with Custom Button

```typescript
import { SkillBlock, ButtonVariant } from '@eightfold.ai/octuple';

function CustomButtonSkillBlock() {
  return (
    <SkillBlock
      label="Design Thinking"
      content="User-centered design approach"
      customButtonProps={{
        text: 'Learn More',
        variant: ButtonVariant.Primary,
        onClick: () => console.log('Learn more clicked')
      }}
    />
  );
}
```

### SkillBlock with Icon

```typescript
import { SkillBlock } from '@eightfold.ai/octuple';
import { mdiCodeBraces } from '@mdi/js';

function IconSkillBlock() {
  return (
    <SkillBlock
      label="Software Development"
      content="Full-stack development"
      iconProps={{ path: mdiCodeBraces }}
    />
  );
}
```

## Accessibility

- Provide clear labels for all skills
- Use `itemMenuAriaLabel` for overflow menu
- Ensure keyboard navigation works (Tab, Space, Enter)
- Use appropriate `role` attribute
- Make interactive elements keyboard accessible
- Provide meaningful assessment indicators

## Best Practices

1. **Clear Labels**: Use descriptive skill names
2. **Assessment Indicators**: Show skill level visually
3. **Expandable Content**: Use for additional skill details
4. **Endorsement**: Enable social validation of skills
5. **Menu Actions**: Provide edit, delete, share options
6. **Consistent Sizing**: Use consistent width across skill blocks
7. **Theme Consistency**: Match app theme

## Common Mistakes

❌ **Don't** use skill blocks without labels

```typescript
// Bad - no label
<SkillBlock content="Some skill" />
```

✅ **Do** provide clear labels

```typescript
// Good
<SkillBlock label="JavaScript" content="Programming language" />
```

❌ **Don't** make non-clickable blocks look clickable

```typescript
// Bad - hoverable but not clickable
<SkillBlock label="Skill" hoverable={true} />
```

✅ **Do** make clickable blocks functional

```typescript
// Good
<SkillBlock
  label="Skill"
  clickable={true}
  hoverable={true}
  onClick={handleClick}
/>
```

❌ **Don't** forget to handle expanded state

```typescript
// Bad - expandable but no state management
<SkillBlock label="Skill" expandable={true} />
```

✅ **Do** manage expanded state

```typescript
// Good
const [expanded, setExpanded] = React.useState(false);
<SkillBlock
  label="Skill"
  expandable={true}
  expanded={expanded}
  onClick={() => setExpanded(!expanded)}
/>
```

## Related Components

- [SkillTag](./SkillTag.md) - Simpler skill tag component
- [Badge](./Badge.md) - For simple indicators
- [Card](./Card.md) - Can contain skill blocks
- [Accordion](./Accordion.md) - Similar expandable pattern

