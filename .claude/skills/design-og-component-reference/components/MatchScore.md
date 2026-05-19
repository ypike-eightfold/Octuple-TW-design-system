# MatchScore

MatchScore component for displaying compatibility or match percentage with visual indicators.

## Import

```typescript
import { MatchScore } from '@eightfold.ai/octuple';
```

## API Reference

### MatchScore Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| classNames | The MatchScore class names | `string` | | |
| formatLabel | Format match score label | `(score: number) => string` | `(score) => '${score}% match'` | |
| matchScoreClassNames | The match score class names | `string` | | |
| matchScoreLabel | The match score label | `string` | `'Match'` | |
| matchScoreLabelClassNames | The match score label class names | `string` | | |
| score | The match score value (0-100) | `number` | | |
| showMatchLabel | Show the match label | `boolean` | `true` | |
| showScore | Show the score value | `boolean` | `true` | |
| size | The MatchScore size | `<enum>MatchScoreSize` | `MatchScoreSize.Medium` | |
| style | The MatchScore custom styles | `React.CSSProperties` | | |
| variant | The MatchScore variant | `<enum>MatchScoreVariant` | `MatchScoreVariant.Default` | |
| data-test-id | Unique id used to target element for testing | `string` | | |
| ref | The component ref | `Ref<HTMLDivElement>` | | |

## TypeScript Enums

```typescript
enum MatchScoreSize {
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

enum MatchScoreVariant {
  Default = 'default',
  Pill = 'pill'
}
```

## Usage Examples

### Basic MatchScore

```typescript
import { MatchScore } from '@eightfold.ai/octuple';

function CandidateMatch() {
  return (
    <MatchScore score={85} />
  );
}
```

### MatchScore Sizes

```typescript
import { MatchScore, MatchScoreSize } from '@eightfold.ai/octuple';

function MatchScoreSizes() {
  return (
    <>
      <MatchScore score={75} size={MatchScoreSize.Small} />
      <MatchScore score={75} size={MatchScoreSize.Medium} />
      <MatchScore score={75} size={MatchScoreSize.Large} />
    </>
  );
}
```

### Pill Variant

```typescript
import { MatchScore, MatchScoreVariant } from '@eightfold.ai/octuple';

function PillMatch() {
  return (
    <MatchScore
      score={92}
      variant={MatchScoreVariant.Pill}
    />
  );
}
```

### Custom Label

```typescript
import { MatchScore } from '@eightfold.ai/octuple';

function CustomLabelMatch() {
  return (
    <MatchScore
      score={78}
      matchScoreLabel="Compatibility"
      formatLabel={(score) => `${score}% compatible`}
    />
  );
}
```

### Without Label

```typescript
import { MatchScore } from '@eightfold.ai/octuple';

function ScoreOnly() {
  return (
    <MatchScore
      score={88}
      showMatchLabel={false}
    />
  );
}
```

### Match Scores in List

```typescript
import { MatchScore, Card } from '@eightfold.ai/octuple';

interface Candidate {
  id: string;
  name: string;
  matchScore: number;
}

function CandidateList() {
  const candidates: Candidate[] = [
    { id: '1', name: 'John Doe', matchScore: 95 },
    { id: '2', name: 'Jane Smith', matchScore: 87 },
    { id: '3', name: 'Bob Johnson', matchScore: 72 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {candidates.map((candidate) => (
        <Card key={candidate.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>{candidate.name}</h4>
            <MatchScore score={candidate.matchScore} />
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### Conditional Styling Based on Score

```typescript
import { MatchScore } from '@eightfold.ai/octuple';

function ConditionalMatch() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a'; // Green
    if (score >= 60) return '#faad14'; // Yellow
    return '#ff4d4f'; // Red
  };

  const score = 68;

  return (
    <MatchScore
      score={score}
      style={{ color: getScoreColor(score) }}
    />
  );
}
```

## Accessibility

- Ensure sufficient color contrast for score display
- Provide context for what the match score represents
- Consider adding `aria-label` for screen readers
- Make sure the score is readable at all sizes

## Best Practices

1. **Clear Context**: Make it obvious what the match percentage represents
2. **Consistent Thresholds**: Use consistent color coding (e.g., >80% = good, <60% = poor)
3. **Appropriate Size**: Use size that matches the context (small for lists, large for featured)
4. **Show Label**: Keep `showMatchLabel` true for clarity unless space is very limited
5. **Update Dynamically**: Recalculate match scores when relevant data changes

## Common Mistakes

❌ **Don't** display match scores without context

```typescript
// Bad - user doesn't know what this matches
<MatchScore score={85} />
```

✅ **Do** provide context

```typescript
// Good
<div>
  <h4>Job Requirements Match</h4>
  <MatchScore score={85} matchScoreLabel="Skills Match" />
</div>
```

❌ **Don't** use match scores for absolute values

```typescript
// Bad - percentage doesn't represent a match
<MatchScore score={15} matchScoreLabel="Items in Cart" />
```

✅ **Do** use for compatibility/match percentages

```typescript
// Good
<MatchScore score={85} matchScoreLabel="Profile Match" />
```

❌ **Don't** forget to handle edge cases

```typescript
// Bad - what if score is undefined or > 100?
<MatchScore score={score} />
```

✅ **Do** validate score values

```typescript
// Good
<MatchScore score={Math.min(Math.max(score || 0, 0), 100)} />
```

## Related Components

- [Progress](./Progress.md) - For showing completion progress
- [Badge](./Badge.md) - For simple numeric indicators
- [Card](./Card.md) - Often contains match scores

