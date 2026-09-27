---
name: expo-loading-dialog
description: Instructions for state-guarded modal loading dialog implementation using @codexporer.io/expo-loading-dialog in React Native & Expo apps.
---

# `@codexporer.io/expo-loading-dialog` Skill

## Overview
`@codexporer.io/expo-loading-dialog` provides an imperative, state-guarded loading modal overlay component and `react-sweet-state` hook for Expo and React Native applications. Built on top of `@codexporer.io/expo-dialog` and integrated with `@codexporer.io/expo-app-theme` and `@codexporer.io/expo-button`.

---

## Required Setup

### 1. Mount `<LoadingDialog />` in the Root Tree
Render `<LoadingDialog />` near the top level of your component tree inside `ThemeProvider` (from `@codexporer.io/expo-app-theme` or the app's theme provider):

> **NOTE:** Do **not** use `LoadingDialogProvider` (it does not exist). Simply mount `<LoadingDialog />` as a component inside `ThemeProvider`.

```tsx
import React from 'react';
import { ThemeProvider } from '../providers/ThemeProvider';
import { LoadingDialog } from '@codexporer.io/expo-loading-dialog';

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* App Navigators and Screens */}
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
  const [, loadingDialogActions] = useLoadingDialogActions();

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
  const [, { show, setMessage, hide }] = useLoadingDialogActions();

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
Returns a tuple `[, actions]` where `actions` provides:
- `show({ message, actions }: ShowLoadingDialogOptions)`: Displays the dialog with optional message and action buttons.
- `setMessage(message: string)`: Updates the displayed message without re-triggering animations or opening/closing transitions.
- `hide()`: Smoothly closes the dialog overlay.

### Options
| Property | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | Text displayed below the loading spinner |
| `actions` | `LoadingDialogActionOption[] \| null` | Optional action buttons rendered beneath the message |

### `LoadingDialogActionOption`
| Property | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Button text label |
| `onPress` | `() => void` | Callback invoked when the button is tapped |

---

## Mandatory Rules & Guidelines

1. **Mounting**: Always mount `<LoadingDialog />` inside `ThemeProvider`. Never look for or create a `LoadingDialogProvider`.
2. **Destructured Actions Pattern**: ALWAYS destructure:
   ```tsx
   const [, { show, setMessage, hide }] = useLoadingDialogActions();
   ```
   Do NOT use optional chaining (`?.`) on `show` or `hide`.
3. **Unmount Cleanup**: In `useEffect` hooks controlling loading dialog state during component lifecycle, ALWAYS return an unmount cleanup function:
   ```tsx
   return () => hide();
   ```
4. **No Redundant Re-renders**: The store internally state-guards `show`, `hide`, and `setMessage` calls to prevent infinite re-render loops.
