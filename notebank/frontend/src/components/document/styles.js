import styled from 'styled-components';

export const PreviewContainer = styled.div`
  display: grid;
  row-gap: 15px;
  justify-items: center;
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

export const PreviewFileName = styled.div`
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;