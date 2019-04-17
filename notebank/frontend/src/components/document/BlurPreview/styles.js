import styled from 'styled-components';

export const BlurPreview = styled.div`
  position: relative;
  margin-top: 10px;
  margin-left: 10px;
`;

export const PreviewPage = styled.div`
  width: 65px;
  height: ${Math.trunc(11 / 8.5 * 65)}px;
  border-radius: 8px;
  ${props => props.shadow ? 'box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.02)' : ''};
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #e4e4e4;

  ${props => {
    if (props.first) {
      return `
        overflow: hidden;

        &::after {
          width: 100%;
          height: ${props.percent}%;
          background-color: white;
          content: '';
          display: block;
          transition: all 0.2s;
        }
      `;
    }
  }}
  
  ${props => {
    if (props.base) return;

    const top = props.index * -5;
    const left = props.index * -5;

    return `
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      z-index: ${props.index};
    `;
  }}
`;