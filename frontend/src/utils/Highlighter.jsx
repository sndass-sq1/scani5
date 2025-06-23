import React from 'react';
import PropTypes from 'prop-types';

export const Highlighter = ({ searchVal = '', text = '' }) => {
    text = text.trim() ?? '';
    searchVal = searchVal.trim() ?? '';
    text = text.toString();
    if (text.trim() !== '' && searchVal.trim() !== '') {
        const escapedHighlight = searchVal.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));

        return parts.map((part, index) =>
            part.toLowerCase() === searchVal.toLowerCase() ? (
                <span className="bg-high-ligher" key={`${index}-searchkey`}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    } else {
        return text;
    }
};

Highlighter.propTypes = {
    searchVal: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};
