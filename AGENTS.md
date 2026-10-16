# AGENTS.md — `@codexporer.io/expo-loading-dialog` Instructions

## Package Overview

Imperative and hook-driven modal loading dialog overlay powered by `react-sweet-state`, `@codexporer.io/expo-dialog`, `@codexporer.io/expo-app-theme`, and `@codexporer.io/expo-button`.

---

## Peer Dependencies

All 7 peer dependencies must be installed in consuming projects (none are optional):
- `react`: `*`
- `react-native`: `*`
- `react-sweet-state`: `*`
- `@codexporer.io/expo-dialog`: `*`
- `@codexporer.io/expo-link-stores`: `*`
- `@codexporer.io/expo-app-theme`: `*`
- `@codexporer.io/expo-button`: `*`

---

## Theme Requirement

`<LoadingDialog />` calls `useAppTheme()` to derive spinner (`theme.primary`) and text (`theme.text`) colors. Consuming applications **must** mount `<ThemeProvider>` from `@codexporer.io/expo-app-theme` above `<LoadingDialog />`.

---

## Key Exports

- `LoadingDialog` (named and default export): Modal component rendering the loading spinner, text, and optional action buttons.
- `useLoadingDialogActions()`: Hook returning store actions `{ show, setMessage, hide }`.
- Types: `LoadingDialogActionOption`, `ShowLoadingDialogOptions`, `LoadingDialogState`.

---

## Critical Guidelines for AI Agents

- **Destructure Actions Directly**:
  ```tsx
  const { show: showLoadingDialog, setMessage: setLoadingMessage, hide: hideLoadingDialog } = useLoadingDialogActions();
  ```
  Do NOT use optional chaining (`?.`) on `showLoadingDialog` or `hideLoadingDialog`.
- **Component Mount**: Mount `<LoadingDialog />` near the app root inside `<ThemeProvider>`. Do not search for or create a `LoadingDialogProvider` (it does not exist).
- **Cleanup on Unmount**: In `useEffect` hooks driving async workflows with loaders, always provide cleanup:
  ```tsx
  useEffect(() => {
    return () => hideLoadingDialog();
  }, []);
  ```
- **State Guarding**: Calls to `show`, `setMessage`, and `hide` are internally guarded to avoid redundant state updates or re-renders when parameters match current state.
- **Hardware Back Behavior**: The dialog traps hardware back button events on Android (`dismissOnHardwareBackPress={false}`, `trapHardwareBackPress={true}`) and backdrop touches (`dismissOnBackdropPress={false}`).

