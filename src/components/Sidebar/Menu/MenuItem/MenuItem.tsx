import * as React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA } from '../../../../styles';
import { MenuItemData } from '../menuList';

const Item = styled.li`

`;

interface MenuItemProps {
  active: boolean;
  data: MenuItemData;
}

const MenuItem = ({ active, data }: MenuItemProps) => {


  return (
    <Item>
      {data.title.es}
    </Item>
  );
};
export default MenuItem;
