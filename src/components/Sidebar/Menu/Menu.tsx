import * as React from 'react';
import styled from 'styled-components';

import { TRANSITION_TIME, MEDIA } from '../../../styles';
import { MENU_LIST } from '../../../menuList';
import MenuItem from './MenuItem';

interface NavigationProps {
  open: boolean;
}

const Navigation = styled.nav<NavigationProps>`
  ${MEDIA.M} {
    font-size: 18px;
    transition: opacity ${TRANSITION_TIME} 0s;

    ${({ open }) => !open && `
      opacity: 0;
      visibility: hidden;
      height: 0;
      transition: visibility 0s ${TRANSITION_TIME}, opacity ${TRANSITION_TIME} 0s;
    `}
  }
`;

const MenuList = styled.ul`
  padding: 0;
`;

interface MenuProps {
  open: boolean;
}

const Menu = ({ open }: MenuProps) => {
  const items = React.useMemo(() => {
    return MENU_LIST
      .sort((a, b) => a.title.es.localeCompare(b.title.es))
      .map((menuItemData) => (
        <MenuItem data={menuItemData} key={menuItemData.scheme} />
      ));
  }, []);

  return (
    <Navigation open={open}>
      <MenuList>
        {items}
      </MenuList>
    </Navigation>
  );
};
export default Menu;
