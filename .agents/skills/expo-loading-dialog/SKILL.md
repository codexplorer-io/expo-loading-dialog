---
name: expo-loading-dialog
description: Instructions for state-guarded modal loading dialog implementation using @codexporer.io/expo-loading-dialog in React Native & Expo apps.
---

# `@codexporer.io/expo-loading-dialog` Skill

## Overview
`@codexporer.io/expo-loading-dialog` provides an imperative, state-guarded loading modal component and `react-sweet-state` hook for React Native applications.

## Required Setup
Wrap the app root in `LoadingDialogProvider` with a valid `theme` object (`LoadingDialogTheme`).

### Static Theme (Declared Outside Render Scope)
```tsx
import { LoadingDialogProvider, LoadingDialogTheme } from '@codexporer.io/expo-loading-dialog';

const theme: LoadingDialogTheme = {
  colors: {
    dialogBackground: '#ffffff',
    spinner: '#6366f1',
    messageText: '#18181b',
    buttonText: '#6366f1',
    buttonBackground: '#f4f4f5',
    buttonBorder: '#e4e4e7',
    overlayBackground: 'rgba(0, 0, 0, 0.5)'
  }
};

export function RootLayout({ children }) {
  return (
    <LoadingDialogProvider theme={theme}>
      {children}
    </LoadingDialogProvider>
  );
}
```

### Dynamic Theme (Memoized Inside Component Render)
```tsx
import React, { useMemo } from 'react';
import { LoadingDialogProvider, LoadingDialogTheme } from '@codexporer.io/expo-loading-dialog';

export function AppProviders({ children }) {
  const theme = useMemo<LoadingDialogTheme>(() => ({
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
    <LoadingDialogProvider theme={theme}>
      {children}
    </LoadingDialogProvider>
  );
}
```

## Hook Usage Pattern

Always destructure `{ show: showLoadingDialog, hide: hideLoadingDialog }` directly from `useLoadingDialogActions()`:

```tsx
import React, { useEffect } from 'react';
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';

export function MyScreen({ isLoading, loadingMessage }: { isLoading: boolean; loadingMessage?: string }) {
  const [, { show: showLoadingDialog, hide: hideLoadingDialog }] = useLoadingDialogActions();

  useEffect(() => {
    if (isLoading) {
      showLoadingDialog({ message: loadingMessage || 'Loading...' });
    } else {
      hideLoadingDialog();
    }

    // ALWAYS clean up on unmount:
    return () => hideLoadingDialog();
  }, [isLoading, loadingMessage, showLoadingDialog, hideLoadingDialog]);

  return <MyContent />;
}
```

## Mandatory Rules & Guidelines
1. **Destructured Actions Pattern**: ALWAYS use:
   `const [, { show: showLoadingDialog, hide: hideLoadingDialog }] = useLoadingDialogActions();`
   Do NOT use optional chaining (`?.`) on `showLoadingDialog` or `hideLoadingDialog`.
2. **Unmount Cleanup**: In `useEffect` hooks controlling loading dialog state, ALWAYS return an unmount cleanup function:
   `return () => hideLoadingDialog();`
3. **No Redundant Re-renders**: The store internally state-guards `show`, `hide`, and `setMessage` calls to prevent React Native infinite re-render loops.
4. **Memoize Theme Objects**: When initializing the `theme` prop inside a React component render, ALWAYS memoize it using `useMemo` (or declare statically outside component scope) to maintain object reference stability and avoid unnecessary re-renders.
