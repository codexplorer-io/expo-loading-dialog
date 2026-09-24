# AGENTS.md - `@codexporer.io/expo-loading-dialog` Instructions

## Package Overview
Imperative and hook-driven loading dialog overlay powered by `react-sweet-state`, `@codexporer.io/expo-app-theme`, and `@codexporer.io/expo-button`.

## Core Exports
- `LoadingDialog`: Component rendering the loading overlay UI inside `AppThemeProvider`.
- `useLoadingDialogActions()`: Returns `[null, { show, setMessage, hide }]`.

## Critical Guidelines for AI Agents
- Destructure actions: `const [, { show: showLoadingDialog, hide: hideLoadingDialog }] = useLoadingDialogActions();`
- Do NOT use optional chaining (`?.`) on `showLoadingDialog` or `hideLoadingDialog`.
- In `useEffect` hooks, always supply clean-up: `return () => hideLoadingDialog();`.
- Ensure `<LoadingDialog />` is rendered inside an `AppThemeProvider` context so `useAppTheme()` can access design tokens (`surface`, `primary`, `text`).
