import * as React from 'react';
import styled from 'styled-components';

import { LocalizedString } from 'locale';
import LocaleItem from './LocaleItem';

const LOCALE_ITEMS: LocalizedString = {
  en: 'en',
  ru: 'ru',
};

const LocaleContainer = styled.div`
  display: flex;
`;

const LocaleSelect = () => {
  const items = Object.keys(LOCALE_ITEMS).map((key) => (
    <LocaleItem localeId={key} localeTitle={LOCALE_ITEMS[key]} key={key} />
  ));

  return (
    <LocaleContainer>
      {items}
    </LocaleContainer>
  );
};

export default LocaleSelect;
