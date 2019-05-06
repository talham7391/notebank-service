import styled from 'styled-components';
import * as pageConstants from 'constants/page';

export const Page = styled.div`
  min-height: 100vh;
`;

export const PageContent = styled.div`
  max-width: ${pageConstants.MAX_WIDTH};
  margin: auto;
  padding: ${pageConstants.CONTENT_PADDING};
`;