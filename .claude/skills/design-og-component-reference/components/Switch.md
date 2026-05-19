# Switch

Toggle Switch component for binary on/off states.

## Import

```typescript
import { CheckBox } from '@eightfold.ai/octuple';
```

## API Reference

### Switch Props

Toggle Switch is part of CheckBox Props, and may use any of its properties. The `toggle` prop enables Switch UI.

See [CheckBox](./CheckBox.md) for complete API reference.

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| toggle | The CheckBox UI is toggle | `boolean` | `false` |

### Key CheckBox Props for Switch

| Property | Description | Type | Default |
|----------|-------------|------|---------|
| checked | The checkbox checked state | `boolean` | `false` |
| disabled | Whether the checkbox is disabled | `boolean` | `false` |
| label | The checkbox label | `React.ReactNode` | |
| onChange | Callback when checked state changes | `(e: React.ChangeEvent<HTMLInputElement>) => void` | |

## Usage Examples

### Basic Switch

```typescript
import { CheckBox } from '@eightfold.ai/octuple';

function FeatureToggle() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <CheckBox
      toggle
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
      label="Enable notifications"
    />
  );
}
```

### Disabled Switch

```typescript
import { CheckBox } from '@eightfold.ai/octuple';

function Settings() {
  return (
    <>
      <CheckBox
        toggle
        checked={true}
        disabled
        label="Premium feature (enabled)"
      />
      <CheckBox
        toggle
        checked={false}
        disabled
        label="Unavailable feature"
      />
    </>
  );
}
```

### Switch in Form

```typescript
import { Form, CheckBox } from '@eightfold.ai/octuple';

function PreferencesForm() {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="Email Notifications"
        name="emailNotifications"
        valuePropName="checked"
      >
        <CheckBox
          toggle
          label="Receive email updates"
        />
      </Form.Item>
      
      <Form.Item
        label="Dark Mode"
        name="darkMode"
        valuePropName="checked"
      >
        <CheckBox
          toggle
          label="Use dark theme"
        />
      </Form.Item>
    </Form>
  );
}
```

### Multiple Switches

```typescript
import { CheckBox } from '@eightfold.ai/octuple';

function PrivacySettings() {
  const [settings, setSettings] = React.useState({
    public: false,
    searchable: true,
    shareable: false
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <CheckBox
        toggle
        checked={settings.public}
        onChange={(e) => updateSetting('public', e.target.checked)}
        label="Public profile"
      />
      <CheckBox
        toggle
        checked={settings.searchable}
        onChange={(e) => updateSetting('searchable', e.target.checked)}
        label="Appear in search results"
      />
      <CheckBox
        toggle
        checked={settings.shareable}
        onChange={(e) => updateSetting('shareable', e.target.checked)}
        label="Allow profile sharing"
      />
    </div>
  );
}
```

## Accessibility

- Always provide a `label` for the switch
- Ensure keyboard navigation works (Tab to focus, Space to toggle)
- Use `ariaLabel` for additional context when needed
- The switch should clearly indicate its on/off state visually
- Use `disabled` prop when the switch cannot be toggled

## Best Practices

1. **Use for Binary Choices**: Switches are perfect for on/off, enable/disable states
2. **Immediate Effect**: Switches should take effect immediately without requiring a "Save" button
3. **Clear Labels**: Labels should clearly describe what the switch controls
4. **Default State**: Consider the most appropriate default state
5. **Group Related Switches**: Keep related settings together

## Common Mistakes

❌ **Don't** use switch for multiple options

```typescript
// Bad - multiple switches for single choice
<CheckBox toggle label="Small" />
<CheckBox toggle label="Medium" />
<CheckBox toggle label="Large" />
```

✅ **Do** use RadioGroup for single selection

```typescript
// Good
<RadioGroup items={[
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
]} />
```

❌ **Don't** forget valuePropName in forms

```typescript
// Bad - won't sync with form state
<Form.Item name="toggle">
  <CheckBox toggle />
</Form.Item>
```

✅ **Do** use valuePropName="checked"

```typescript
// Good
<Form.Item name="toggle" valuePropName="checked">
  <CheckBox toggle />
</Form.Item>
```

❌ **Don't** use switch for actions that require confirmation

```typescript
// Bad - deleting data with switch
<CheckBox toggle label="Delete all data" />
```

✅ **Do** use Button with confirmation for destructive actions

```typescript
// Good
<Button
  text="Delete all data"
  variant={ButtonVariant.Disruptive}
  onClick={showConfirmDialog}
/>
```

## Related Components

- [CheckBox](./CheckBox.md) - For multiple selections
- [RadioButton](./RadioButton.md) - For single selection from multiple options
- [Form](./Form.md) - For form integration

