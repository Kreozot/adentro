import * as React from 'react';
import styled from 'styled-components';

import { COLORS, MEDIA } from '../../../styles';

const BURGER_BASIS = '5px';

interface BurgerButtonProps {
  open: boolean;
}

const Stripe = styled.span`
  display: block;
  position: absolute;
  height: ${BURGER_BASIS};
  width: 100%;
  background: ${COLORS.adentroGrey};
  border-radius: ${BURGER_BASIS};
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: .25s ease-in-out;
`;

const Stripe1 = styled(Stripe)`
  top: 0px;
  transform-origin: left center;
`;

const Stripe2 = styled(Stripe)`
  top: calc(${BURGER_BASIS} * 2);
  transform-origin: left center;
`;

const Stripe3 = styled(Stripe)`
  top: calc(${BURGER_BASIS} * 4);
  transform-origin: left center;
`;

const BurgerButton = styled.span<BurgerButtonProps>`
  width: 30px;
  height: calc(${BURGER_BASIS} * 5);
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
  cursor: pointer;
  margin: 5px 15px 0 10px;
  display: none;

  ${MEDIA.M} {
    display: inline-block;
  }

  > ${Stripe1} {
    ${(props) => (props.open ? `
      transform: rotate(45deg);
      top: -1px;
      left: 8px;
    ` : '')}
  }

  > ${Stripe2} {
    ${(props) => (props.open ? `
      width: 0%;
      opacity: 0;
    ` : '')}
  }

  > ${Stripe3} {
    ${(props) => (props.open ? `
      transform: rotate(-45deg);
      left: 8px;
    ` : '')}
  }
`;

const MenuButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <BurgerButton open={isOpen} onClick={handleClick}>
      <Stripe1 />
      <Stripe2 />
      <Stripe3 />
    </BurgerButton>
  );
};
export default MenuButton;
