import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import StyledLink from '../../../common/StyledLink';
import { COLORS, MEDIA, TRANSITION_TIME } from '../../../../styles';
import { MenuItemData } from '../../../../menuList';

const Item = styled.li`
  margin: 8px;
  list-style-type: none;
`;

const MenuLink = styled(StyledLink)`
  text-decoration: none;
  font-family: Negotiate, sans-serif;
  font-size: 16px;
`;

interface MenuItemProps {
  active: boolean;
  data: MenuItemData;
}

const MenuItem = ({ active, data }: MenuItemProps) => {
  return (
    <Item>
      <MenuLink to={`/${data.scheme}`}>
        {data.title.es}
      </MenuLink>
    </Item>
  );
};
export default MenuItem;
