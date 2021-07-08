import * as React from 'react';

import MenuButton from './MenuButton';
import Logo from './Logo';
import Menu from './Menu';
import LocaleSelect from './LocaleSelect';

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
      <LocaleSelect />
      <Menu open={isMenuOpen} />
    </div>
  );
};
export default Sidebar;
