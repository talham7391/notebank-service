import styled from 'styled-components';

export const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: scroll;
`;

export const FilesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
`;

export const DragInfo = styled.div`
  display: flex;
  justify-content: center;
`;

export const BlurAmount = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > *:nth-child(2) {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;