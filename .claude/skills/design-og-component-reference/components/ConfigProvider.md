# ConfigProvider

ConfigProvider component for global configuration of Octuple components.

## Import

```typescript
import { ConfigProvider } from '@eightfold.ai/octuple';
```

## API Reference

### ConfigProvider Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| children | Child components | `React.ReactNode` | | |
| disabled | Globally disable components | `boolean` | | |
| shape | Global shape for components | `<enum>Shape` | | |
| size | Global size for components | `<enum>Size` | | |
| theme | Theme configuration | `ThemeOptions` | | |

## Usage Examples

### Basic ConfigProvider

```typescript
import { ConfigProvider } from '@eightfold.ai/octuple';

function App() {
  return (
    <ConfigProvider>
      <YourApp />
    </ConfigProvider>
  );
}
```

### Global Size Configuration

```typescript
import { ConfigProvider, Size } from '@eightfold.ai/octuple';

function App() {
  return (
    <ConfigProvider size={Size.Large}>
      {/* All components will default to Large size */}
      <YourApp />
    </ConfigProvider>
  );
}
```

### Global Shape Configuration

```typescript
import { ConfigProvider, Shape } from '@eightfold.ai/octuple';

function App() {
  return (
    <ConfigProvider shape={Shape.Pill}>
      {/* All components will default to Pill shape */}
      <YourApp />
    </ConfigProvider>
  );
}
```

### Disabled State

```typescript
import { ConfigProvider } from '@eightfold.ai/octuple';

function MaintenanceMode() {
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  return (
    <ConfigProvider disabled={maintenanceMode}>
      {/* All components will be disabled during maintenance */}
      <YourApp />
    </ConfigProvider>
  );
}
```

### Nested ConfigProviders

```typescript
import { ConfigProvider, Size } from '@eightfold.ai/octuple';

function App() {
  return (
    <ConfigProvider size={Size.Medium}>
      {/* Medium size components */}
      <MainContent />
      
      <ConfigProvider size={Size.Small}>
        {/* Small size components in sidebar */}
        <Sidebar />
      </ConfigProvider>
    </ConfigProvider>
  );
}
```

### Theme Configuration

```typescript
import { ConfigProvider } from '@eightfold.ai/octuple';

function ThemedApp() {
  const theme = {
    primaryColor: '#1890ff',
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
    successColor: '#52c41a'
  };

  return (
    <ConfigProvider theme={theme}>
      <YourApp />
    </ConfigProvider>
  );
}
```

### User Preference Configuration

```typescript
import { ConfigProvider, Size } from '@eightfold.ai/octuple';

function UserPreferenceApp() {
  const [userPreferences, setUserPreferences] = React.useState({
    size: Size.Medium,
    highContrast: false
  });

  return (
    <ConfigProvider size={userPreferences.size}>
      <YourApp />
    </ConfigProvider>
  );
}
```

## Accessibility

- ConfigProvider doesn't directly affect accessibility
- Global disabled state should be used sparingly
- Ensure theme configurations maintain sufficient color contrast
- Consider user preferences for sizing

## Best Practices

1. **Root Level**: Place ConfigProvider at application root
2. **Consistent Configuration**: Use for app-wide defaults
3. **Avoid Deep Nesting**: Limit nested ConfigProviders
4. **User Preferences**: Respect user accessibility preferences
5. **Theme Consistency**: Maintain consistent theming throughout app

## Common Mistakes

❌ **Don't** disable entire app unnecessarily

```typescript
// Bad - disables everything
<ConfigProvider disabled={true}>
  <App />
</ConfigProvider>
```

✅ **Do** disable specific sections when needed

```typescript
// Good
<ConfigProvider disabled={isLoading}>
  <FormSection />
</ConfigProvider>
```

❌ **Don't** nest ConfigProviders excessively

```typescript
// Bad - too many levels
<ConfigProvider size="large">
  <ConfigProvider size="medium">
    <ConfigProvider size="small">
      <Content />
    </ConfigProvider>
  </ConfigProvider>
</ConfigProvider>
```

✅ **Do** use ConfigProvider strategically

```typescript
// Good
<ConfigProvider size="medium">
  <App />
  <ConfigProvider size="small">
    <Toolbar />
  </ConfigProvider>
</ConfigProvider>
```

## Related Components

All Octuple components can be configured through ConfigProvider.

## Notes

- ConfigProvider uses React Context under the hood
- Components can override ConfigProvider settings with their own props
- Configuration is inherited by all descendant components
- Use ConfigProvider to maintain consistency across your application

