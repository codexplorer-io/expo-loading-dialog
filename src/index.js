import React, { useState, useEffect, Fragment } from 'react';
import { createStore, createHook } from 'react-sweet-state';
import {
    Portal,
    ActivityIndicator,
    useTheme,
    Button
} from 'react-native-paper';
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
        message: '',
        actions: null
    },
    actions: {
        ...actions,
        show: ({ message = '', actions = null } = {}) => ({ setState }) => setState({ isVisible: true, message, actions }),
        setMessage: message => ({ setState }) => setState({ message }),
        hide: () => ({ setState }) => setState({ isVisible: false })
    },
    name: 'LoadingDialogActions'
});

const useLoadingDialogState = createHook(Store, { selector: state => selector(state) });

export const useLoadingDialogActions = createHook(Store, { selector: null });

export const LoadingDialog = () => {
    const [{ isVisible, message, actions }] = useLoadingDialogState();
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
                    {actions?.length > 0 && actions.map(({ title, onPress }, index) => (
                        <Fragment key={index}>
                            <HorizontalSpacer height={index === 0 ? SPACER_SIZE : 10} />
                            <Button
                                mode='outlined'
                                onPress={onPress}
                                style={{ width: '100%' }}
                            >
                                {title}
                            </Button>
                        </Fragment>
                    ))}
                </ContentRoot>
            </Dialog>
        </Portal>
    );
};
