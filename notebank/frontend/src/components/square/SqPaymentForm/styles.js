import styled from 'styled-components';

export const SqPaymentForm = styled.div`
  position: relative;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 32px;
  position: absolute;
  left: 50%;
  top: 50%;
  tranform: translate(-50%, -50%);
`;

export const PaymentFieldsContainer = styled.div`
  opacity: ${props => props.show ? '1' : '0'};
  transition: all 0.3s;
`;