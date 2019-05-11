import styled from 'styled-components';

export const SchoolImage = styled.div`
  width: 100px;
  height: 100px;
  background-image: url('${props => props.src}');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;