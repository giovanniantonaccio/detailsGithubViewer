import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

export const LoadingIndicator = styled(ActivityIndicator).attrs({
  color: '#7159c8',
  size: 'large',
})`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;
