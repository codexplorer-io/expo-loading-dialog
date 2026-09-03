import * as React from 'react';

export interface LoadingDialogThemeColors {
    dialogBackground: string;
    spinner: string;
    messageText: string;
    buttonText: string;
    buttonBackground: string;
    buttonBorder: string;
    overlayBackground: string;
    shadowColor?: string;
}

export interface LoadingDialogTheme {
    colors: LoadingDialogThemeColors;
}

export interface LoadingDialogProviderProps {
    children: React.ReactNode;
    theme: LoadingDialogTheme;
}

export declare const LoadingDialogProvider: React.FC<LoadingDialogProviderProps>;

export interface LoadingDialogActionOption {
    title: string;
    onPress: () => void;
}

export interface ShowLoadingDialogOptions {
    message?: string;
    actions?: LoadingDialogActionOption[] | null;
}

export interface LoadingDialogActions {
    show: (options?: ShowLoadingDialogOptions) => void;
    setMessage: (message: string) => void;
    hide: () => void;
}

export declare function useLoadingDialogActions(): [null, LoadingDialogActions];
