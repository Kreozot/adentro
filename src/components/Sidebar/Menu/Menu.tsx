import * as React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA } from '../../../styles';
import { MENU_LIST } from './menuList';
import MenuItem from './MenuItem';

const Navigation = styled.nav`
  padding: 0 5% 5%;
  font-family: Negotiate, sans-serif;
  font-size: 16px;
  color: ${COLORS.adentroGrey};
`;

const MenuList = styled.ul`

`;

const Menu = () => {
  const items = React.useMemo(() => {
    return MENU_LIST
      .sort((a, b) => a.title.es.localeCompare(b.title.es))
      .map((menuItemData) => (
        <MenuItem active={false} data={menuItemData} />
      ));
  }, []);

  return (
    <Navigation>
      <MenuList>
        {items}
      </MenuList>
    </Navigation>
  );
};
export default Menu;
