import * as React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'gatsby';

import { COLORS, MEDIA } from '../../../../styles';
import { MenuItemData } from '../../../../menuList';

const Item = styled.li`

`;

interface MenuItemProps {
  active: boolean;
  data: MenuItemData;
}

const MenuItem = ({ active, data }: MenuItemProps) => {
  return (
    <Item>
      <Link to={`/${data.scheme}`}>
        {data.title.es}
      </Link>
    </Item>
  );
};
export default MenuItem;
