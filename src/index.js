import React, { useState, useEffect } from 'react';
import { createStore, createHook } from 'react-sweet-state';
import { Portal, ActivityIndicator, useTheme } from 'react-native-paper';
import {
    initialState,
    actions,
    selector
} from '@codexporer.io/expo-link-stores';
import {
    Dialog,
    ContentRoot,
    HorizontalSpacer,
    Message,
    LoadingRoot,
    DIALOG_PADDING,
    SPACER_SIZE
} from './styled';

const Store = createStore({
    initialState: {
        ...initialState,
        isVisible: false,
        message: ''
    },
    actions: {
        ...actions,
        show: ({ message = '' } = {}) => ({ setState }) => setState({ isVisible: true, message }),
        setMessage: message => ({ setState }) => setState({ message }),
        hide: () => ({ setState }) => setState({ isVisible: false })
    },
    name: 'LoadingDialogActions'
});

const useLoadingDialogState = createHook(Store, { selector: state => selector(state) });

export const useLoadingDialogActions = createHook(Store, { selector: null });

export const LoadingDialog = () => {
    const [{ isVisible, message }] = useLoadingDialogState();
    const [messageHeight, setMessageHeight] = useState(0);
    const [loadingHeight, setLoadingHeight] = useState(0);
    const theme = useTheme();

    useEffect(() => {
        messageHeight && !message && setMessageHeight(0);
    }, [message, messageHeight]);

    const onMessageLayout = ({ nativeEvent }) => {
        setMessageHeight(nativeEvent.layout.height + 10);
    };

    const onLoadingLayout = ({ nativeEvent }) => {
        setLoadingHeight(nativeEvent.layout.height + 10);
    };

    const dialogHeight = (DIALOG_PADDING * 2) + SPACER_SIZE + loadingHeight + messageHeight;

    return (
        <Portal>
            <Dialog
                visible={isVisible}
                dismissable={false}
                height={dialogHeight}
            >
                <ContentRoot>
                    <LoadingRoot onLayout={onLoadingLayout}>
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
