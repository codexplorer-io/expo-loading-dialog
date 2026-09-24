import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Animated,
    BackHandler
} from 'react-native';
import { createStore, createHook } from 'react-sweet-state';
import {
    initialState,
    actions,
    selector
} from '@codexporer.io/expo-link-stores';
import { useAppTheme } from '@codexporer.io/expo-app-theme';
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

    const [mounted, setMounted] = useState<boolean>(isVisible);
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            setMounted(true);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }).start(() => {
                setMounted(false);
            });
        }
    }, [isVisible, opacity]);

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });

        return () => {
            subscription?.remove();
        };
    }, [isVisible]);

    if (!mounted) {
        return null;
    }

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFill,
                styles.overlayContainer,
                { opacity }
            ]}
            pointerEvents={isVisible ? 'auto' : 'none'}
        >
            <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
                <View style={[styles.dialogContainer, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
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
                    {!!actions && actions.length > 0 && (
                        <View style={styles.actionsContainer}>
                            {actions.map(({ title, onPress }, index) => (
                                <Button
                                    key={index}
                                    title={title}
                                    onPress={onPress}
                                    variant={ButtonVariant.Secondary}
                                    size={ButtonSize.Medium}
                                    style={styles.actionButton}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        zIndex: 99999,
        elevation: 99999,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    dialogContainer: {
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
        shadowRadius: 8
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
        width: '100%',
        marginTop: 16,
        gap: 8,
    },
    actionButton: {
        width: '100%',
    }
});

export default LoadingDialog;
