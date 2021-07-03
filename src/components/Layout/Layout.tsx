import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

import Sidebar from '../Sidebar';
import Content from '../Content';
import Footer from '../Footer';

interface PageProps extends RouteComponentProps {
  scheme: string;
}

const Layout = ({ scheme }: PageProps) => {
  return (
    <>
      <main>
        <Sidebar />
        {scheme}
        <Content />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Layout;
