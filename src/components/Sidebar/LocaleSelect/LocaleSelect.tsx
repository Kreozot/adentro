import * as React from 'react';
import styled from 'styled-components';

import { LocalizedString } from 'locale';
import LocaleItem from './LocaleItem';

const LOCALE_ITEMS: LocalizedString = {
  en: 'en',
  ru: 'ru',
};

const LocaleSelect = () => {
  return Object.keys(LOCALE_ITEMS).map((key) => (
    <LocaleItem localeId={key} localeTitle={LOCALE_ITEMS[key]} key={key} />
  ));
};

export default LocaleSelect;
