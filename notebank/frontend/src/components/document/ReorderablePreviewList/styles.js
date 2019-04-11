import styled from 'styled-components';

export const ReorderablePreviewList = styled.div``

export const RedBox = styled.div`
  background-color: ${props => props.color};
  width: 150px;
  height: 50px;
`;

export const Droppable = styled.div`
  display: flex;
`;


export const Draggable = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const Badge = styled.div`
  margin-bottom: 14px;
`;

export const Delete = styled.div`
  margin-top: 12px;
  display: grid;
  justify-items: center;
  row-gap: 10px;
`;