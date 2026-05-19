# SkillTag

SkillTag component for displaying skills as tags with assessment status.

## Import

```typescript
import { SkillTag } from '@eightfold.ai/octuple';
```

## API Reference

### SkillTag Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| allowDisabledFocus | Allows focus on the SkillTag when it's disabled | `boolean` | | |
| assessment | The SkillTag assessment status | `SkillAssessment` | | |
| background | Custom background color of the SkillTag | `string` | | |
| blockEndClassNames | Custom classnames of the SkillTag end block | `string` | | |
| blockEndStyles | Custom inline styles of the SkillTag end block element | `React.CSSProperties` | | |
| blockStartClassNames | Custom classnames of the SkillTag start block | `string` | | |
| blockStartStyles | Custom inline styles of the SkillTag start block element | `React.CSSProperties` | | |
| bordered | Whether the SkillTag is bordered or not | `boolean` | `true` | |
| classNames | Custom classnames of the SkillTag | `string` | | |
| clickable | Whether or not the SkillTag is clickable | `boolean` | `false` | |
| color | Custom color of the SkillTag | `string` | | |
| customButtonProps | Props for the custom button | `ButtonProps` | | |
| disabled | The SkillTag is in a disabled state | `boolean` | `false` | |
| dropdownProps | The Dropdown and overlay props | `DropdownProps` | `{}` | |
| endorsement | Whether the SkillTag is endorsed or not | `boolean` | `false` | |
| endorseButtonProps | Props for the endorsement button | `ButtonProps` | | |
| fullWidth | Assigns the SkillTag 100% width | `boolean` | | |
| iconProps | Icon shown before the label | `IconProps` | | |
| id | The SkillTag id | `string` | | |
| inlineSvgProps | InlineSvg shown before the label | `InlineSvgProps` | | |
| key | Unique key of the SkillTag | `Key` | | |
| label | The SkillTag label | `string` | | |
| lineClamp | Maximum number of lines the SkillTag label can have | `number` | | |
| onClick | Callback called on click of the SkillTag | `React.MouseEventHandler<HTMLDivElement>` | | |
| onKeyDown | Callback called on keydown of the SkillTag | `React.KeyboardEventHandler<HTMLDivElement>` | | |
| onRemove | Callback called on click of the remove button | `React.MouseEventHandler<HTMLButtonElement>` | | |
| popupProps | The Popup and overlay props | `PopupProps` | `{}` | |
| readonly | The SkillTag is readonly | `boolean` | | |
| removable | The SkillTag is removable | `boolean` | `false` | |
| removeButtonAriaLabel | Aria label for the remove button | `string` | | |
| removeButtonProps | Props for the remove button | `ButtonProps` | | |
| required | The SkillTag is required | `boolean` | `false` | |
| requiredMark | Required mark enabled | `boolean` | `true` | |
| role | Role of the SkillTag | `string` | `'button'` | |
| showLabelAssessmentIcon | Whether to display the assessment Icon next to the Label | `boolean` | | |
| size | The SkillTag size | `SkillSize` | `SkillSize.Medium` | |
| status | The SkillTag status | `SkillStatus` | `SkillStatus.Default` | |
| style | The custom style of the SkillTag | `React.CSSProperties` | | |
| suffixIconProps | Icon shown at the end of the component | `IconProps` | | |
| suffixInlineSvgProps | InlineSvg shown at the end of the component | `InlineSvgProps` | | |
| tabIndex | The SkillTag tab-index | `number` | `0` | |
| theme | Theme of the SkillTag | `OcThemeName \| SkillThemeName` | `white` | |
| title | Title of the SkillTag | `string` | | |
| tooltipProps | The Tooltip and overlay props | `TooltipProps` | `{}` | |

## Skill Assessment Images

SkillTag uses the same skill assessment SVG images as SkillBlock:

```typescript
import {
  BelowLargeImg,
  BelowMediumImg,
  BelowSmallImg,
  MeetLargeImg,
  MeetMediumImg,
  MeetSmallImg,
  ExceedLargeImg,
  ExceedMediumImg,
  ExceedSmallImg,
  // ... other assessment images
} from '@eightfold.ai/octuple';
```

Helper properties:

```typescript
import {
  matchingSkillAssessment,
  matchingSkillStatus
} from '@eightfold.ai/octuple';
```

## Usage Examples

### Basic SkillTag

```typescript
import { SkillTag } from '@eightfold.ai/octuple';

function BasicSkillTag() {
  return (
    <SkillTag label="JavaScript" />
  );
}
```

### SkillTag with Assessment

```typescript
import { SkillTag, SkillAssessment } from '@eightfold.ai/octuple';

function AssessedSkillTag() {
  return (
    <>
      <SkillTag
        label="React"
        assessment={SkillAssessment.Exceed}
        showLabelAssessmentIcon={true}
      />
      <SkillTag
        label="TypeScript"
        assessment={SkillAssessment.Meet}
        showLabelAssessmentIcon={true}
      />
      <SkillTag
        label="CSS"
        assessment={SkillAssessment.Below}
        showLabelAssessmentIcon={true}
      />
    </>
  );
}
```

### Removable SkillTag

```typescript
import { SkillTag } from '@eightfold.ai/octuple';

function RemovableSkillTags() {
  const [skills, setSkills] = React.useState([
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'Node.js' }
  ]);

  const handleRemove = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {skills.map((skill) => (
        <SkillTag
          key={skill.id}
          label={skill.name}
          removable
          onRemove={() => handleRemove(skill.id)}
        />
      ))}
    </div>
  );
}
```

### Clickable SkillTag

```typescript
import { SkillTag } from '@eightfold.ai/octuple';

function ClickableSkillTags() {
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);

  const skills = ['Python', 'Java', 'Go', 'Rust'];

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {skills.map((skill) => (
        <SkillTag
          key={skill}
          label={skill}
          clickable
          onClick={() => setSelectedSkill(skill)}
          style={{
            backgroundColor: selectedSkill === skill ? '#e6f7ff' : undefined
          }}
        />
      ))}
    </div>
  );
}
```

### SkillTag with Endorsement

```typescript
import { SkillTag } from '@eightfold.ai/octuple';

function EndorsedSkillTag() {
  const [endorsed, setEndorsed] = React.useState(false);

  return (
    <SkillTag
      label="Leadership"
      endorsement={endorsed}
      endorseButtonProps={{
        text: endorsed ? '✓ Endorsed' : 'Endorse',
        onClick: () => setEndorsed(!endorsed)
      }}
    />
  );
}
```

### SkillTag with Dropdown

```typescript
import { SkillTag } from '@eightfold.ai/octuple';

function DropdownSkillTag() {
  const dropdownMenu = {
    items: [
      { key: 'edit', children: 'Edit Skill' },
      { key: 'endorse', children: 'Endorse' },
      { key: 'remove', children: 'Remove' }
    ],
    onClick: (info: any) => console.log('Action:', info.key)
  };

  return (
    <SkillTag
      label="Project Management"
      dropdownProps={{
        overlay: dropdownMenu,
        trigger: 'click'
      }}
    />
  );
}
```

### SkillTag with Tooltip

```typescript
import { SkillTag } from '@eightfold.ai/octuple';

function TooltipSkillTag() {
  return (
    <SkillTag
      label="Machine Learning"
      tooltipProps={{
        content: 'Expert level proficiency in ML algorithms and frameworks'
      }}
    />
  );
}
```

### SkillTag with Icon

```typescript
import { SkillTag } from '@eightfold.ai/octuple';
import { mdiStar } from '@mdi/js';

function IconSkillTag() {
  return (
    <SkillTag
      label="Featured Skill"
      iconProps={{ path: mdiStar }}
    />
  );
}
```

### SkillTag Sizes

```typescript
import { SkillTag, SkillSize } from '@eightfold.ai/octuple';

function SizedSkillTags() {
  return (
    <>
      <SkillTag label="Small" size={SkillSize.Small} />
      <SkillTag label="Medium" size={SkillSize.Medium} />
      <SkillTag label="Large" size={SkillSize.Large} />
    </>
  );
}
```

## Accessibility

- Provide clear labels for all skill tags
- Use `removeButtonAriaLabel` for remove buttons
- Ensure keyboard navigation works (Tab, Space, Enter)
- Use appropriate `role` attribute
- Make interactive elements keyboard accessible
- Use tooltips for additional context

## Best Practices

1. **Clear Labels**: Use concise skill names
2. **Assessment Indicators**: Show skill level when relevant
3. **Removable**: Enable removal for editable skill lists
4. **Clickable**: Make clickable for filtering or selection
5. **Consistent Sizing**: Use consistent size across tags
6. **Tooltips**: Provide details via tooltips
7. **Group Logically**: Group related skills together

## Common Mistakes

❌ **Don't** use skill tags without labels

```typescript
// Bad - no label
<SkillTag />
```

✅ **Do** provide clear labels

```typescript
// Good
<SkillTag label="JavaScript" />
```

❌ **Don't** forget to handle remove action

```typescript
// Bad - removable but no handler
<SkillTag label="Skill" removable />
```

✅ **Do** handle remove events

```typescript
// Good
<SkillTag
  label="Skill"
  removable
  onRemove={handleRemove}
/>
```

❌ **Don't** make non-clickable tags look clickable

```typescript
// Bad - looks clickable but isn't
<SkillTag label="Skill" style={{ cursor: 'pointer' }} />
```

✅ **Do** use clickable prop

```typescript
// Good
<SkillTag
  label="Skill"
  clickable
  onClick={handleClick}
/>
```

## Related Components

- [SkillBlock](./SkillBlock.md) - More detailed skill component
- [Badge](./Badge.md) - For simple indicators
- [Pill](./Pill.md) - Similar tag component
- [Tooltip](./Tooltip.md) - For additional context

