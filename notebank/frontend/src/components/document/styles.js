import styled from 'styled-components';

export const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const PreviewStyledCanvas = styled.canvas.attrs(props => ({
  style: {
    width: `${props.size ? props.size.width : 0}px`,
    height: `${props.size ? props.size.height : 0}px`,
  },
}))`
  border-radius: 8px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

export const PreviewFileNameContainer = styled.div`
  display: flex;
  padding: 4px 10px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  margin-top: 15px;
`;

export const PreviewFileNameIndex = styled.div`
  width: 24px;
`;

export const PreviewFileName = styled.div`
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PreviewFileNameDelete = styled.div`
  margin-left: 10px;
  font-size: 16px;
`;