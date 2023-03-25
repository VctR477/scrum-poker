import React from 'react';
import './button.css';

export const Button = (props) => {
    const {
        text,
        disabled,
        onClick = () => {},
        type,
        extraClass = '',
    } = props;

    const className = extraClass + 'button' + (type ? (' button--' + type) : '');

    return (
        <button
            className={ className }
            type="button"
            onClick={ onClick }
            disabled={ disabled }
        >
            { text }
        </button>
    );
};
