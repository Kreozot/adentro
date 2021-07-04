import { Link } from 'gatsby';
import styled from 'styled-components';

import { COLORS, TRANSITION_TIME } from '../../styles';

const StyledLink = styled(Link)`
  cursor: pointer;
  color: ${COLORS.adentroGrey};
  text-decoration: underline;
  transition: color ${TRANSITION_TIME},
    text-decoration-color ${TRANSITION_TIME};

  &:hover {
    color: black;
    text-decoration-color: ${COLORS.adentroBlue};
    -webkit-text-decoration-color: ${COLORS.adentroBlue};
  }
`;

export default StyledLink;
