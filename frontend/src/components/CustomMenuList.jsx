import React from 'react';
import { components } from 'react-select';
import PropTypes from 'prop-types';

export const CustomMenuList = React.memo((props) => {
    const { children } = props;

    return (
        <div>
            <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}></div>
            <components.MenuList {...props}>{children}</components.MenuList>
        </div>
    );
});

// CustomMenuList.propTypes = {
//     props: PropTypes.shape({
//         children: PropTypes.shape .isRequired
//       }).isRequired,
// }
