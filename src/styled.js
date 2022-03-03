import styled from 'styled-components/native';
import { Dialog as RnpDialog, Text } from 'react-native-paper';

export const Dialog = styled(RnpDialog)`
    max-width: 50%;
    align-self: center;
    flex: ${({ height }) => `0 0 ${height}px`};
    padding: 20px;
    padding-top: 20px;
    overflow: visible;
`;

export const ContentRoot = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const HorizontalSpacer = styled.View`
    height: 20px;
`;

export const Message = styled(Text)`
    text-align: center;
`;

export const LoadingRoot = styled.View`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
`;
