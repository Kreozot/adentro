import * as React from 'react';
import styled from 'styled-components';

import {
  COLORS, MEDIA, INTERVALS, BREAKPOINTS,
} from 'styles';
import MenuButton from './MenuButton';
import Logo from './Logo';
import Menu from './Menu';
import LocaleSelect from './LocaleSelect';

interface SidebarContainerProps {
  open: boolean;
}

const SidebarContainer = styled.div<SidebarContainerProps>`
  position: relative;
  background-color: ${COLORS.background};
  min-width: 200px;

  ${MEDIA.M} {
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;

    ${({ open }) => open && `
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    `}
  }

  ${MEDIA.L} {
    min-width: 120px;
  }
`;

const LogoContainer = styled.div`
  margin: ${INTERVALS.SMALL};
  display: flex;
  align-items: center;

  ${MEDIA.M} {
    cursor: pointer;
  }
`;

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuButtonClick = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= BREAKPOINTS.M) {
      setIsMenuOpen(!isMenuOpen);
    }
  }, [isMenuOpen]);

  return (
    <SidebarContainer open={isMenuOpen}>
      <LogoContainer onClick={handleMenuButtonClick}>
        <MenuButton open={isMenuOpen} />
        <Logo />
      </LogoContainer>
      <LocaleSelect open={isMenuOpen} />
      <Menu open={isMenuOpen} />
    </SidebarContainer>
  );
};
export default Sidebar;
