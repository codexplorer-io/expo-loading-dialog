---
name: expo-loading-dialog
description: Instructions for state-guarded modal loading dialog implementation using @codexporer.io/expo-loading-dialog in React Native & Expo apps.
---

# `@codexporer.io/expo-loading-dialog` Skill

## Overview
`@codexporer.io/expo-loading-dialog` provides an imperative, state-guarded loading modal overlay component and `react-sweet-state` hook for Expo and React Native applications. Built on top of `@codexporer.io/expo-dialog` and integrated with `@codexporer.io/expo-app-theme` and `@codexporer.io/expo-button`.

---

## Peer Dependencies

All 7 peer dependencies are required and must be installed in consuming projects (none are optional):
- `react`: `*`
- `react-native`: `*`
- `react-sweet-state`: `*`
- `@codexporer.io/expo-dialog`: `*`
- `@codexporer.io/expo-link-stores`: `*`
- `@codexporer.io/expo-app-theme`: `*`
- `@codexporer.io/expo-button`: `*`

---

## Theme Requirement

`<LoadingDialog />` calls `useAppTheme()` from `@codexporer.io/expo-app-theme` to retrieve theme tokens (`theme.primary` for the spinner and `theme.text` for the message). Consuming applications **must** mount `<ThemeProvider>` above `<LoadingDialog />`.

---

## When to Use
- Displaying an imperative modal spinner with status text during long-running async operations (e.g. video rendering, image flattening, asset syncing).
- Updating progress status messages dynamically with `setMessage` during multi-step background tasks.
- Providing cancel buttons on modal loaders to abort pending asynchronous workflows.

---

## Required Setup

### 1. Mount `<LoadingDialog />` in the Root Tree

Render `<LoadingDialog />` near the top level of your component tree inside `<ThemeProvider>` from `@codexporer.io/expo-app-theme`:

> **NOTE:** Do **not** use `LoadingDialogProvider` (it does not exist). Simply mount `<LoadingDialog />` as a component inside `<ThemeProvider>`.

```tsx
import React from 'react';
import { ThemeProvider, defaultThemeConfig } from '@codexporer.io/expo-app-theme';
import { LoadingDialog } from '@codexporer.io/expo-loading-dialog';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider themeConfig={defaultThemeConfig}>
      {children}
      <LoadingDialog />
    </ThemeProvider>
  );
}
```

### 2. (Optional) Cross-Package Store Linking

To allow decoupled packages (e.g. `@codexporer.io/expo-image-picker`) to trigger loading dialogs without direct dependencies, link the store at app initialization:

```tsx
import { useEffect } from 'react';
import { linkStores } from '@codexporer.io/expo-link-stores';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

export function RootStoreLinker() {
  const loadingDialogActions = useLoadingDialogActions();

  useEffect(() => {
    if (loadingDialogActions) {
      linkStores({ loadingDialog: loadingDialogActions });
    }
  }, [loadingDialogActions]);

  return null;
}
```

---

## Hook Usage Pattern

Always destructure `{ show, setMessage, hide }` directly from `useLoadingDialogActions()`:

```tsx
import React from 'react';
import { View } from 'react-native';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { Button } from '@codexporer.io/expo-button';

export function DemoScreen() {
  const { show, setMessage, hide } = useLoadingDialogActions();

  const handlePerformTask = async () => {
    show({ message: 'Initializing sync...' });

    try {
      await stepOne();
      setMessage('Uploading items...');
      await stepTwo();
    } catch (error) {
      console.error(error);
    } finally {
      hide();
    }
  };

  return (
    <View>
      <Button title="Start Task" onPress={handlePerformTask} />
    </View>
  );
}
```

### Loading Dialog with Action Buttons (e.g. Cancel)

Action buttons are rendered using `<Button variant={ButtonVariant.Secondary} size={ButtonSize.Small} />` from `@codexporer.io/expo-button`:

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

---

## API Reference

### `useLoadingDialogActions()`

Returns the store actions object providing:
- `show({ message, actions }: ShowLoadingDialogOptions)`: Displays the dialog. State-guarded: only updates if `message` or `actions` changed.
- `setMessage(message: string)`: Updates the displayed message without re-triggering opening animations. State-guarded: only updates if `message` changed.
- `hide()`: Closes the dialog overlay. State-guarded: only updates if `isVisible`, `message`, or `actions` are currently set.

### Options

#### `ShowLoadingDialogOptions`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string` | `''` | Text displayed below the loading spinner |
| `actions` | `LoadingDialogActionOption[] \| null` | `null` | Optional action buttons rendered beneath the message |

#### `LoadingDialogActionOption`

| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Button text label |
| `onPress` | `() => void` | Callback invoked when the button is tapped |

---

## Critical Rules & Guidelines

1. **Mounting**: Always mount `<LoadingDialog />` inside `ThemeProvider`. Never look for or create a `LoadingDialogProvider`.
2. **Destructured Actions Pattern**: ALWAYS destructure:
   ```tsx
   const { show, setMessage, hide } = useLoadingDialogActions();
   ```
   Do NOT use optional chaining (`?.`) on `show` or `hide`.
3. **Unmount Cleanup**: In `useEffect` hooks controlling loading dialog state during component lifecycle, ALWAYS return an unmount cleanup function:
   ```tsx
   return () => hide();
   ```
4. **State-Guarding**: The store internally state-guards `show`, `hide`, and `setMessage` calls to prevent unnecessary re-render cycles.
5. **Modal Behavior**: The underlying dialog is configured with `dismissOnBackdropPress={false}`, `dismissOnHardwareBackPress={false}`, and `trapHardwareBackPress={true}`.
6. **All 7 Peer Dependencies Required**: Consuming applications must install all 7 peer dependencies without marking any as optional.

