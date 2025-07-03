import styled from 'styled-components/native';
import { Dialog as RnpDialog, Text } from 'react-native-paper';

export const DIALOG_PADDING = 20;
export const SPACER_SIZE = 20;

export const Dialog = styled(RnpDialog)`
    max-width: 50%;
    align-self: center;
    height: ${({ height }) => `${height}px`};
    padding: ${DIALOG_PADDING}px;
    overflow: visible;
`;

export const ContentRoot = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const HorizontalSpacer = styled.View`
    height: ${SPACER_SIZE}px;
`;

export const Message = styled(Text)`
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
    font-weight: 600;
`;

export const LoadingRoot = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
`;
