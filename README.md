# `@codexporer.io/expo-loading-dialog`

Global modal loading dialog state management and component for React Native applications. Automatically renders its overlay when mounted at the app root.

## Prerequisites

Ensure `react-sweet-state`, `deprecated-react-native-prop-types`, and `@codexporer.io/expo-link-stores` are installed in your workspace:

```bash
yarn add react-sweet-state deprecated-react-native-prop-types
```

## Theme & Provider Setup

Wrap your application root inside `LoadingDialogProvider` and supply a mandatory `theme` object. `LoadingDialogProvider` automatically renders the `<LoadingDialog />` overlay component internally.

### `LoadingDialogTheme` Interface

```typescript
interface LoadingDialogTheme {
  colors: {
    dialogBackground: string;   // Dialog container background color
    spinner: string;            // ActivityIndicator loading spinner color
    messageText: string;        // Loading message text color
    buttonText: string;         // Action button text color
    buttonBackground: string;   // Action button background color
    buttonBorder: string;       // Action button border color
    overlayBackground: string; // Backdrop overlay background color
  };
}
```

### Setup Example

```tsx
import React, { useMemo } from 'react';
import { LoadingDialogProvider, LoadingDialogTheme } from '@codexporer.io/expo-loading-dialog';

export function AppProviders({ children }) {
  const loadingDialogTheme = useMemo<LoadingDialogTheme>(() => ({
    colors: {
      dialogBackground: '#ffffff',
      spinner: '#6366f1',
      messageText: '#18181b',
      buttonText: '#6366f1',
      buttonBackground: '#f4f4f5',
      buttonBorder: '#e4e4e7',
      overlayBackground: 'rgba(0, 0, 0, 0.5)'
    }
  }), []);

  return (
    <LoadingDialogProvider theme={loadingDialogTheme}>
      {children}
    </LoadingDialogProvider>
  );
}
```

## Hook Usage

Use `useLoadingDialogActions()` anywhere in your component tree or store actions to trigger or hide the dialog overlay.

```tsx
import React from 'react';
import { Button } from 'react-native';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

export function SyncButton() {
  const [, { show, setMessage, hide }] = useLoadingDialogActions();

  const handleSync = async () => {
    show({ message: 'Syncing baby logs...' });
    try {
      await performSync();
    } finally {
      hide();
    }
  };

  return <Button title="Sync Data" onPress={handleSync} />;
}
```
