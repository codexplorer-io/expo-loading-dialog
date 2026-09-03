# AGENTS.md - `@codexporer.io/expo-loading-dialog` Instructions

## Package Overview
Imperative and hook-driven loading dialog overlay powered by `react-sweet-state`.

## Core Exports
- `LoadingDialogProvider`: Application root provider rendering loading dialog overlay.
- `useLoadingDialogActions()`: Returns `[state, { show, setMessage, hide }]`.
- `useLoadingDialog()`: Returns `[state, actions]`.

## Critical Guidelines for AI Agents
- Destructure actions: `const [, { show: showLoadingDialog, hide: hideLoadingDialog }] = useLoadingDialogActions();`
- Do NOT use optional chaining (`?.`) on `showLoadingDialog` or `hideLoadingDialog`.
- In `useEffect` hooks, always supply clean-up: `return () => hideLoadingDialog();`.
- **Memoize Theme Objects**: Wrap inline `theme` objects in `useMemo` when rendered inside React components (or define statically outside component body) to preserve reference stability.
