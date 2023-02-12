import React from 'react';
import { Card } from '../card';
import './card-column.css';

export const CardColumn = (props) => {
    const {
        amount,
        color,
        ...other
    } = props;

    return (
        <div className="card-column card-column__satisfaction">
            <Card color={ color } { ...other } />
            <div className="card-column__amount">
                { new Array(amount).fill().map((_, idx) => (
                    <div key={ idx } className={ `card-column__voice ${color ? color : ''}` } />
                )) }
            </div>
        </div>
    );
};
