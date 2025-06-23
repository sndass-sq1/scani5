import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TooltipComp = ({
    content = <div>default content</div>,
    children = 'default content',
    position = 'top',
}) => {
    return (
        <OverlayTrigger
            overlay={<Tooltip className="text-cap text-nowrap ">{content}</Tooltip>}
            container={this}
            placement={position}>
            {children}
        </OverlayTrigger>
    );
};
export default React.memo(TooltipComp);

TooltipComp.propTypes = {
    text: PropTypes.node.isRequired,
    tooltipContent: PropTypes.string.isRequired,
    position: PropTypes.string,
};
