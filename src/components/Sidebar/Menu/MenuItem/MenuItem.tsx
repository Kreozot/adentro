import * as React from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';

import StyledLink from '../../../common/StyledLink';
import { RootState } from '../../../../store/store';
import { COLORS, MEDIA, TRANSITION_TIME } from '../../../../styles';
import { MenuItemData } from '../../../../menuList';

const Item = styled.li`
  margin: 8px;
  list-style-type: none;
  font-family: Negotiate, sans-serif;
  font-size: 16px;
`;

const MenuLink = styled(StyledLink)`
  text-decoration: none;
`;

const CurrentItem = styled.span`
  color: ${COLORS.adentroBlue};
`;

interface MenuItemProps extends ConnectedProps<typeof connector> {
  data: MenuItemData;
}

const MenuItem = ({ danceId, data }: MenuItemProps) => {
  return (
    <Item>
      {
        danceId === data.scheme
          ? (
            <CurrentItem>
              {data.title.es}
            </CurrentItem>
          )
          : (
            <MenuLink to={`/${data.scheme}`}>
              {data.title.es}
            </MenuLink>
          )
      }
    </Item>
  );
};

const mapStateToProps = (state: RootState) => ({
  danceId: state.state.danceId,
});
const connector = connect(mapStateToProps);

export default connector(MenuItem);
