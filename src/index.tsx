import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { createStore, createHook } from 'react-sweet-state';
import {
    initialState,
    actions,
    selector
} from '@codexporer.io/expo-link-stores';
import { useAppTheme } from '@codexporer.io/expo-app-theme';
import { Dialog } from '@codexporer.io/expo-dialog';
import { Button, ButtonVariant, ButtonSize } from '@codexporer.io/expo-button';

export interface LoadingDialogActionOption {
    title: string;
    onPress: () => void;
}

export interface ShowLoadingDialogOptions {
    message?: string;
    actions?: LoadingDialogActionOption[] | null;
}

export interface LoadingDialogState {
    isVisible: boolean;
    message: string;
    actions: LoadingDialogActionOption[] | null;
}

const Store = createStore({
    initialState: {
        ...initialState,
        isVisible: false,
        message: '',
        actions: null as LoadingDialogActionOption[] | null
    },
    actions: {
        ...actions,
        show: ({ message = '', actions = null }: ShowLoadingDialogOptions = {}) => ({ setState, getState }: any) => {
            const current = getState();
            if (current.message !== message || current.actions !== actions) {
                setState({ isVisible: true, message, actions });
            }
        },
        setMessage: (message: string) => ({ setState, getState }: any) => {
            if (getState().message !== message) {
                setState({ message });
            }
        },
        hide: () => ({ setState, getState }: any) => {
            const current = getState();
            if (current.isVisible || current.message || current.actions) {
                setState({ isVisible: false, message: '', actions: null });
            }
        }
    },
    name: 'LoadingDialogActions'
});

const useLoadingDialogState = createHook(Store, { selector: (state: any) => selector(state) });

export const useLoadingDialogActions = createHook(Store, { selector: null });

export const LoadingDialog: React.FC = () => {
    const [{ isVisible, message, actions }] = useLoadingDialogState();
    const theme = useAppTheme();

    return (
        <Dialog
            visible={isVisible}
            dismissOnBackdropPress={false}
            dismissOnHardwareBackPress={false}
            trapHardwareBackPress={true}
            style={styles.dialogContainer}
        >
            <View style={styles.spinnerContainer}>
                <ActivityIndicator
                    animating
                    color={theme.primary}
                    size="large"
                />
            </View>
            {!!message && (
                <Text style={[styles.message, { color: theme.text }]}>
                    {message}
                </Text>
            )}
            {actions && actions.length > 0 && (
                <View style={styles.actionsContainer}>
                    {actions.map(({ title, onPress }: LoadingDialogActionOption, index: number) => (
                        <Button
                            key={index}
                            title={title}
                            onPress={onPress}
                            variant={ButtonVariant.Secondary}
                            size={ButtonSize.Small}
                        />
                    ))}
                </View>
            )}
        </Dialog>
    );
};

const styles = StyleSheet.create({
    dialogContainer: {
        width: undefined,
        minWidth: 160,
        minHeight: 140,
        maxWidth: 280,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    spinnerContainer: {
        padding: 8
    },
    message: {
        marginTop: 16,
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 22
    },
    actionsContainer: {
        marginTop: 16,
        gap: 8,
        alignSelf: 'stretch'
    },
});

export default LoadingDialog;
