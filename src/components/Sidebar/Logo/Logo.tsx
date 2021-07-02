import * as React from 'react';
import styled from 'styled-components';

import { MEDIA } from '../../../styles';
import logoImage from './logo.svg';

const Image = styled.img`
    height: 45px;

    ${MEDIA.S} {
        height: 30px;
    }
`;

const Logo = () => {
    return (
        <Image src={logoImage} />
    );
};
export default Logo;
