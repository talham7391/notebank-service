import styled from 'styled-components';

export const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.08);
  position: relative;
  top: 0px;
  transition: all 0.2s;

  &:hover {
    top: -12px;
    box-shadow: 0px 16px 20px rgba(0, 0, 0, 0.1);
  }
`;