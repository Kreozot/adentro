import * as React from 'react';

import MenuButton from './MenuButton';
import Logo from './Logo';
import Menu from './Menu';

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleMenuButtonClick = React.useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  return (
    <div>
      <div>
        <MenuButton onClick={handleMenuButtonClick} open={isMenuOpen} />
        <Logo />
      </div>
      <Menu open={isMenuOpen} />
    </div>
  );
};
export default Sidebar;
