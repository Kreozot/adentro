import * as React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from '@reach/router';

import Sidebar from '../Sidebar';
import Content from '../Content';
import Footer from '../Footer';

const Main = styled.main`
  display: flex;
  width: 100%;
`;

interface PageProps extends RouteComponentProps {}

const Layout: React.FunctionComponent<PageProps> = () => {
  return (
    <>
      <Main>
        <Sidebar />
        <Content />
      </Main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Layout;
