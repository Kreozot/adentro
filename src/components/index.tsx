import * as React from 'react';
import { Router } from '@reach/router';
import { bindActionCreators } from 'redux';
import { connect, ConnectedProps } from 'react-redux';

import { DanceId } from 'schemes';
import { AppDispatch, stateSlice } from 'store';
import Layout from './Layout';

import 'font.css';
import 'main.css';

interface IndexPageProps extends ConnectedProps<typeof connector> {
  pageContext: {
    danceId: DanceId;
  }
}

const IndexPage = ({ setDanceId, pageContext: { danceId } }: IndexPageProps) => {
  React.useEffect(() => {
    setDanceId(danceId);
  }, [setDanceId, danceId]);

  return (
    <Router>
      <Layout path="/" />
      <Layout path="/:danceId" />
    </Router>
  );
};

const mapDispatchToProps = (dispatch: AppDispatch) => bindActionCreators({
  setDanceId: stateSlice.actions.setDanceId,
}, dispatch);
const connector = connect(null, mapDispatchToProps);

export default connector(IndexPage);
