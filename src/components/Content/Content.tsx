import * as React from 'react';
import styled from 'styled-components';

import { MEDIA } from 'styles';

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;

  ${MEDIA.M} {
    margin-top: 64px;
  }

  ${MEDIA.S} {
    margin-top: 48px;
  }
`;

const Content = () => {
  return (
    <ContentContainer>Content</ContentContainer>
  );
};
export default Content;
