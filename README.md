# `@codexporer.io/expo-loading-dialog`

Global modal loading dialog state management and component for React Native and Expo applications. Built on top of `@codexporer.io/expo-dialog` and `react-sweet-state` with non-blocking, state-guarded imperative controls and dynamic theme integration.

---

## Peer Dependencies

All peer dependencies are required and must be installed in consuming projects (none are optional):
- `react`: `*`
- `react-native`: `*`
- `react-sweet-state`: `*`
- `@codexporer.io/expo-dialog`: `*`
- `@codexporer.io/expo-link-stores`: `*`
- `@codexporer.io/expo-app-theme`: `*`
- `@codexporer.io/expo-button`: `*`

---

## Installation

```bash
yarn add @codexporer.io/expo-loading-dialog
```

---

## Theme Requirement

`LoadingDialog` calls `useAppTheme()` from `@codexporer.io/expo-app-theme` to retrieve theme tokens (`theme.primary` for the spinner and `theme.text` for the message). Consuming applications **must** mount `<ThemeProvider>` above `<LoadingDialog />` in the component hierarchy.

---

## Quick Start

### 1. Mount `<LoadingDialog />` near App Root

Render `<LoadingDialog />` near the top level of your component tree inside `<ThemeProvider>`:

```tsx
import React from 'react';
import { ThemeProvider, defaultThemeConfig } from '@codexporer.io/expo-app-theme';
import { LoadingDialog } from '@codexporer.io/expo-loading-dialog';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themeConfig={defaultThemeConfig}>
      {children}
      <LoadingDialog />
    </ThemeProvider>
  );
}
```

> **Note:** There is no `LoadingDialogProvider`. The component connects directly to the singleton store.

### 2. Control Dialog Imperatively

Use `useLoadingDialogActions()` anywhere in your component tree:

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

export function SyncScreen() {
  const { show, setMessage, hide } = useLoadingDialogActions();

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

Action buttons are rendered using `<Button variant={ButtonVariant.Secondary} size={ButtonSize.Small} />` from `@codexporer.io/expo-button`:

```tsx
const { show, hide } = useLoadingDialogActions();

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

---

## API Reference

### `useLoadingDialogActions()`

Returns the store actions object providing:
- `show({ message, actions }?: ShowLoadingDialogOptions)`: Displays the dialog. State-guarded: only commits if `message` or `actions` have changed.
- `setMessage(message: string)`: Updates the displayed message without re-triggering modal opening transitions. State-guarded: only commits if `message` has changed.
- `hide()`: Closes the dialog. State-guarded: only commits if `isVisible`, `message`, or `actions` are currently set.

### Types & Options

#### `ShowLoadingDialogOptions`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | `''` | Text displayed below the loading spinner |
| `actions` | `LoadingDialogActionOption[] \| null` | `null` | Optional action buttons rendered beneath the message |

#### `LoadingDialogActionOption`

| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Button text label |
| `onPress` | `() => void` | Callback invoked when the button is pressed |

---

## Modal Behavior

The underlying `<Dialog>` is configured with strict modal traps:
- `dismissOnBackdropPress={false}`: Tapping the backdrop will not dismiss the dialog.
- `dismissOnHardwareBackPress={false}`: Hardware back button presses do not dismiss the dialog.
- `trapHardwareBackPress={true}`: Intercepts Android hardware back button events while the dialog is active.

---

## License

MIT

