import React, { createContext, useContext } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { createStore, createHook } from 'react-sweet-state';
import {
    initialState,
    actions,
    selector
} from '@codexporer.io/expo-link-stores';

const Store = createStore({
    initialState: {
        ...initialState,
        isVisible: false,
        message: '',
        actions: null
    },
    actions: {
        ...actions,
        show: ({ message = '', actions = null } = {}) => ({ setState, getState }) => {
            const current = getState();
            if (!current.isVisible || current.message !== message || current.actions !== actions) {
                setState({ isVisible: true, message, actions });
            }
        },
        setMessage: message => ({ setState, getState }) => {
            if (getState().message !== message) {
                setState({ message });
            }
        },
        hide: () => ({ setState, getState }) => {
            const current = getState();
            if (current.isVisible || current.message || current.actions) {
                setState({ isVisible: false, message: '', actions: null });
            }
        }
    },
    name: 'LoadingDialogActions'
});

const useLoadingDialogState = createHook(Store, { selector: state => selector(state) });

export const useLoadingDialogActions = createHook(Store, { selector: null });

const LoadingDialogContext = createContext(null);

export const LoadingDialogProvider = ({ children, theme }) => {
    return (
        <LoadingDialogContext.Provider value={theme}>
            {children}
            <LoadingDialog />
        </LoadingDialogContext.Provider>
    );
};

const useLoadingDialogTheme = () => {
    const context = useContext(LoadingDialogContext);
    if (!context) {
        throw new Error('useLoadingDialogTheme must be used within a LoadingDialogProvider with a mandatory theme prop.');
    }
    return context;
};

const LoadingDialog = () => {
    const [{ isVisible, message, actions }] = useLoadingDialogState();
    const theme = useLoadingDialogTheme();
    const { colors } = theme;

    if (!isVisible) {
        return null;
    }

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={[styles.overlay, { backgroundColor: colors.overlayBackground }]}>
                <View style={[styles.dialogContainer, { backgroundColor: colors.dialogBackground, shadowColor: colors.shadowColor }]}>
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator
                            animating
                            color={colors.spinner}
                            size="large"
                        />
                    </View>
                    {!!message && (
                        <Text style={[styles.message, { color: colors.messageText }]}>
                            {message}
                        </Text>
                    )}
                    {actions?.length > 0 && actions.map(({ title, onPress }, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={[
                                styles.button,
                                {
                                    backgroundColor: colors.buttonBackground,
                                    borderColor: colors.buttonBorder
                                }
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                                {title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    dialogContainer: {
        minWidth: 140,
        minHeight: 140,
        maxWidth: 400,
        aspectRatio: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4
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
    button: {
        width: '100%',
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600'
    }
});
