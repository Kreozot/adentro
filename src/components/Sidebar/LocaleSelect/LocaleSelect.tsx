import * as React from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../store/store';
import StyledLink from '../../../common/StyledLink';

interface LocaleSelectProps extends ConnectedProps<typeof connector> {}

const LocaleSelect = ({ localeId }: LocaleSelectProps) => {
  return (
    <div>LocaleSelect</div>
  );
};

const mapStateToProps = (state: RootState) => ({
  localeId: state.state.localeId,
});
const connector = connect(mapStateToProps);

export default connector(LocaleSelect);
