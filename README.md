# `@codexporer.io/expo-loading-dialog`

Global modal loading dialog state management and component for React Native applications. Automatically renders its overlay when `<LoadingDialog />` is placed in your application hierarchy (inside `AppThemeProvider`).

## Prerequisites

Ensure `react-sweet-state`, `@codexporer.io/expo-link-stores`, `@codexporer.io/expo-app-theme`, and `@codexporer.io/expo-button` are installed in your workspace:

```bash
yarn add react-sweet-state @codexporer.io/expo-link-stores @codexporer.io/expo-app-theme @codexporer.io/expo-button
```

## Setup & Theming

Simply render `<LoadingDialog />` near the root of your application inside `AppThemeProvider`. Theme colors (`surface`, `primary`, `text`) are automatically retrieved via `@codexporer.io/expo-app-theme`.

### Setup Example

```tsx
import React from 'react';
import { AppThemeProvider } from '@codexporer.io/expo-app-theme';
import { LoadingDialog } from '@codexporer.io/expo-loading-dialog';

export function App() {
  return (
    <AppThemeProvider>
      {/* App Navigator and components */}
      <LoadingDialog />
    </AppThemeProvider>
  );
}
```

## Hook Usage

Use `useLoadingDialogActions()` anywhere in your component tree or store actions to trigger or hide the dialog overlay.

```tsx
import React, { useEffect } from 'react';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
import { Button } from '@codexporer.io/expo-button';

export function SyncScreen({ isSyncing }: { isSyncing: boolean }) {
  const [, { show: showLoadingDialog, hide: hideLoadingDialog }] = useLoadingDialogActions();

  useEffect(() => {
    if (isSyncing) {
      showLoadingDialog({ message: 'Syncing track...' });
    } else {
      hideLoadingDialog();
    }

    return () => hideLoadingDialog();
  }, [isSyncing, showLoadingDialog, hideLoadingDialog]);

  return <Button title="Sync Data" onPress={() => console.log('Syncing...')} />;
}
```
