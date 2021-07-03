import * as React from 'react';
import { Router } from '@reach/router';

import Layout from './Layout';

const IndexPage = ({ scheme }) => {
  return (
    <Router>
      <Layout path="/" scheme="chacarera" />
      <Layout path="/:scheme" scheme={scheme} />
    </Router>
  );
};
export default IndexPage;
