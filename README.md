# `@codexporer.io/expo-loading-dialog`

Global modal loading dialog state management and component for React Native applications. Built on top of `@codexporer.io/expo-dialog` and `react-sweet-state` with non-blocking imperative controls and dynamic theme integration.

## Installation & Peer Dependencies

```bash
yarn add @codexporer.io/expo-loading-dialog
```

Ensure peer dependencies are installed in your workspace:
```bash
yarn add react-sweet-state @codexporer.io/expo-dialog @codexporer.io/expo-link-stores @codexporer.io/expo-app-theme @codexporer.io/expo-button
```

## Quick Start

### 1. Mount `<LoadingDialog />` near App Root

Render `<LoadingDialog />` near the top level of your component tree inside `ThemeProvider`:

```tsx
import React from 'react';
import { ThemeProvider, defaultThemeConfig } from '@codexporer.io/expo-app-theme';
import { LoadingDialog } from '@codexporer.io/expo-loading-dialog';

export function App() {
  return (
    <ThemeProvider themeConfig={defaultThemeConfig}>
      {/* App Navigator and components */}
      <LoadingDialog />
    </ThemeProvider>
  );
}
```

### 2. Control Dialog Imperatively

Use `useLoadingDialogActions()` anywhere in your component tree or asynchronous routines:

```tsx
import React from 'react';
import { Button, View } from 'react-native';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

export function SyncScreen() {
  const [, { show, setMessage, hide }] = useLoadingDialogActions();

  const handleExport = async () => {
    show({ message: 'Initializing render...' });

    setTimeout(() => {
      setMessage('Encoding audio visualizer frames...');
    }, 1500);

    setTimeout(() => {
      hide();
    }, 3000);
  };

  return (
    <View style={{ padding: 16 }}>
      <Button title="Export Video" onPress={handleExport} />
    </View>
  );
}
```

### 3. Loading Dialog with Cancellation Action

```tsx
show({
  message: 'Downloading assets...',
  actions: [
    {
      title: 'Cancel',
      onPress: () => {
        abortController.abort();
        hide();
      }
    }
  ]
});
```

## API Reference

### `useLoadingDialogActions()`
Returns a tuple `[, actions]` where `actions` provides:
- `show({ message, actions }: ShowLoadingDialogOptions)`: Displays the dialog with optional message and action buttons.
- `setMessage(message: string)`: Updates the displayed message without re-triggering animations.
- `hide()`: Smoothly closes the dialog overlay.

### Options
| Property | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | Text displayed below the loading spinner |
| `actions` | `LoadingDialogActionOption[]` | Optional action buttons rendered beneath the message |

## License

MIT
