import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect, ConnectedProps } from 'react-redux';

import { URL_LANG_PARAM } from 'locale';
import { RootState, AppDispatch, stateSlice } from 'store';
import StyledLink from 'components/common/StyledLink';

interface LocaleItemProps extends ConnectedProps<typeof connector> {
  localeId: string,
  localeTitle: string,
}

const LocaleItem = ({ localeId, localeTitle, currentLocaleId, currentDanceId, setLocaleId }: LocaleItemProps) => {
  const linkUrl = React.useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set(URL_LANG_PARAM, localeId);
    return url.href;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- In order to change url respectively with all current params
  }, [localeId, currentDanceId]);

  return (
    <StyledLink to={linkUrl}>{localeTitle}</StyledLink>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentLocaleId: state.state.localeId,
  currentDanceId: state.state.danceId,
});
const mapDispatchToProps = (dispatch: AppDispatch) => bindActionCreators({
  setLocaleId: stateSlice.actions.setLocaleId,
}, dispatch);
const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(LocaleItem);
