import * as React from 'react';
import styled from 'styled-components';

import { MEDIA, TRANSITION_TIME } from 'styles';
import { LocalizedString } from 'locale';
import LocaleItem from './LocaleItem';

const LOCALE_ITEMS: LocalizedString = {
  en: 'en',
  ru: 'ru',
};

interface LocaleContainerProps {
  open: boolean;
}

const LocaleContainer = styled.div<LocaleContainerProps>`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  ${MEDIA.M} {
    width: auto;
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 1.3em;

    transition: opacity ${TRANSITION_TIME} 0s;

    ${({ open }) => !open && `
      opacity: 0;
      visibility: hidden;
      height: 0;
      transition: visibility 0s ${TRANSITION_TIME}, opacity ${TRANSITION_TIME} 0s;
    `}
  }
`;

interface LocaleSelectProps {
  open: boolean;
}

const LocaleSelect = ({ open }: LocaleSelectProps) => {
  const items = Object.keys(LOCALE_ITEMS).map((key) => (
    <LocaleItem localeId={key} localeTitle={LOCALE_ITEMS[key]} key={key} />
  ));

  return (
    <LocaleContainer open={open}>
      {items}
    </LocaleContainer>
  );
};

export default LocaleSelect;
