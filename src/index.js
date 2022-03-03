import React, { useState, useEffect } from 'react';
import { createStore, createHook } from 'react-sweet-state';
import { Portal, ActivityIndicator, useTheme } from 'react-native-paper';
import {
    Dialog,
    ContentRoot,
    HorizontalSpacer,
    Message,
    LoadingRoot
} from './styled';

const Store = createStore({
    initialState: {
        isVisible: false,
        message: ''
    },
    actions: {
        show: ({ message = '' } = {}) => ({ setState }) => setState({ isVisible: true, message }),
        setMessage: message => ({ setState }) => setState({ message }),
        hide: () => ({ setState }) => setState({ isVisible: false })
    },
    name: 'LoadingDialogActions'
});

const useLoadingDialogState = createHook(Store);

export const useLoadingDialogActions = createHook(Store, { selector: null });

const LOADING_SIZE = 40;
const DIALOG_PADDING = 20 * 2;

export const LoadingDialog = () => {
    const [{ isVisible, message }] = useLoadingDialogState();
    const [messageHeight, setMessageHeight] = useState(0);
    const theme = useTheme();

    useEffect(() => {
        messageHeight && !message && setMessageHeight(0);
    }, [message, messageHeight]);

    const onMessageLayout = ({
        nativeEvent: { layout: { height } }
    }) => {
        setMessageHeight(height + 10);
    };

    const dialogHeight = DIALOG_PADDING + LOADING_SIZE + messageHeight;

    return (
        <Portal>
            <Dialog
                visible={isVisible}
                dismissable={false}
                height={dialogHeight}
            >
                <ContentRoot>
                    <LoadingRoot>
                        <ActivityIndicator
                            animating
                            color={theme.colors.primary}
                            size='large'
                        />
                    </LoadingRoot>
                    {!!message && (
                        <>
                            <HorizontalSpacer />
                            <Message onLayout={onMessageLayout}>
                                {message}
                            </Message>
                        </>
                    )}
                </ContentRoot>
            </Dialog>
        </Portal>
    );
};
