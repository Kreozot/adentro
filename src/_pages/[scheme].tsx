import * as React from 'react';
import { Router } from '@reach/router';

import Layout from '../components/Layout';

const IndexPage = ({ scheme }) => {
  return (
    <Router>
      <Layout path="/" scheme="chacarera" />
      <Layout path="/:scheme" scheme={scheme} />
    </Router>
  );
  // return (
  //   <Location>
  //     {({ location }) => (
  //       <Router location={location}>
  //         <Layout path="/" scheme="chacarera" />
  //         <Layout path="/:scheme" />
  //       </Router>
  //     )}
  //   </Location>
  // );
};
export default IndexPage;
