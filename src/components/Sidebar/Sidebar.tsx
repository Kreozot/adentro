import * as React from 'react';

import MenuButton from './MenuButton';
import Logo from './Logo';
import Menu from './Menu';

const Sidebar = () => {
  return (
    <div>
      <div>
        <MenuButton />
        <Logo />
      </div>
      <Menu />
    </div>
  );
};
export default Sidebar;
