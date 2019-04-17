import styled from 'styled-components';

export const ReorderablePreviewList = styled.div``

export const Droppable = styled.div`
  display: flex;
`;

export const Draggable = styled.div`
  display: flex;
  padding: 10px 15px;

  > * {
    flex-grow: 1;
  }
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