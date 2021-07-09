import * as React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA } from 'styles';
import MenuButton from './MenuButton';
import Logo from './Logo';
import Menu from './Menu';
import LocaleSelect from './LocaleSelect';

const SidebarContainer = styled.div`
  background-color: ${COLORS.background};
  min-width: 120px;

 ${MEDIA.M} {
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
  }

  &--open {
    height: 100%;
    overflow: scroll;
  }
`;

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuButtonClick = React.useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  return (
    <SidebarContainer>
      <div>
        <MenuButton onClick={handleMenuButtonClick} open={isMenuOpen} />
        <Logo />
      </div>
      <LocaleSelect />
      <Menu open={isMenuOpen} />
    </SidebarContainer>
  );
};
export default Sidebar;
