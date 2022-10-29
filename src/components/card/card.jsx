import React from 'react';
import './card.css';

export const Card = (props) => {
    const {
        value,
        isChosen,
    } = props;
    return (
        <div className={ `card${isChosen ? ' card-dark' : ''}` }>
            { value }
        </div>
    );
};
