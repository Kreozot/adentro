import * as React from 'react';
import { Router } from '@reach/router';

import Layout from './Layout';

import 'font.css';
import 'main.css';

const IndexPage = ({ scheme }) => {
  return (
    <Router>
      <Layout path="/" scheme="chacarera" />
      <Layout path="/:scheme" scheme={scheme} />
    </Router>
  );
};
export default IndexPage;
