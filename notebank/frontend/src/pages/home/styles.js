import styled from 'styled-components';
import * as pageConstants from 'constants/page'; 

export const Jumbotron = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 85vh;
`;

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  margin: 20px 0px;
  padding: ${pageConstants.CONTENT_PADDING};
`;

export const BackgroundImage = styled.div`
  background-image: url('/static/assets/background.svg');
  background-size: auto 100%;
  background-position: center;
  height: 230px;
  width: 100%;
`;