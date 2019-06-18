import styled from 'styled-components';
import * as pageConstants from 'constants/page';

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${pageConstants.MAX_WIDTH};
  margin: auto;
  padding: ${pageConstants.CONTENT_PADDING};
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  > img {
    height: 24px;
    margin-right: 12px;
  }
`;

export const LoginButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  column-gap: 16px;
  align-items: center;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 30px;
  }

  @media screen and (max-width: 630px) {
    display: none;
  }
`;

export const Menu = styled.div`
  display: none;
  
  @media screen and (max-width: 630px) {
    display: block;
  }
`;