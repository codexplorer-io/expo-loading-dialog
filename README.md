# expo-loading-dialog
Loading dialog for react-native & expo.

## Platform Compatibility
iOS|Android|Web|
-|-|-|
✅|✅|❌|

## Samples

<img title="Loading dialog" src="https://github.com/codexplorer-io/expo-loading-dialog/blob/main/samples/recording.gif?raw=true">

## Prerequisites
Module requires `styled-components`, `react-sweet-state`, `react-native-paper` and some theme variable initalizations before it can be used, and to be rendered as an app parent.

Required theme variables:

- **colors.primary** - Spinner color used when dialog is displayed

```javascript
import { ThemeProvider } from 'styled-components';
import { App } from './app';

const theme = {
    colors: {
        primary: primaryColor,
        ...
    },
    ...
};

export const AppThemeWrapper = () => (
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);
```

## Usage
Before dialog can be displayed, it needs to be rendered within `App` as a descendant of theme providers:
```javascript
import { LoadingDialog } from '@codexporer.io/expo-loading-dialog';
...

export const App = () => (
    <>
        <LoadingDialog />
        ...other app components
    </>
);
```
When `LoadingDialog` component is rendered, it can be displayed from anywhere within the app:
```javascript
import { useLoadingDialogActions } from '@codexporer.io/expo-loading-dialog';
...

export const MyComponent = () => {
    const [, { show, setMessage, hide }] = useLoadingDialogActions();

    const onStartLoading = async () => {
        show({ message: 'Loading started...' });
        await sleep(3000);
        setMessage('Updating...');
        await sleep(2000);
        setMessage('Finishing...');
        await sleep(1000);
        hide();
    };

    return (
        <>
            <Button
                mode='outlined'
                onPress={onStartLoading}
            >
                Start Loading
            </Button>
            ... other components
        </>
    );
};
```

## Exports
symbol|description|
-|-|
LoadingDialog|loading dialog component|
useLoadingDialogActions|hook used to control loading dialog visibility and message|

## useLoadingDialogActions
Returns an array with `show`, `setMessage` and `hide` actions on the second index:
```
const [, { show, setMessage, hide }] = useMessageDialogActions();

...
show({ message: initialMessage });
...
setMessage(desiredNewMessageWhileDialogIsVisible);
...
hide();
```

### Show action parameters
parameter|description|
-|-|
message|optional message displayed in message dialog. If no message is passed in, spinner will be displayed. (default value: empty string)|


### Set message action parameters
parameter|description|
-|-|
message|message displayed in message dialog. If empty string is passed in, spinner will be displayed|
