import React from 'react';
import { Card } from '../card';
import './card-row.css';

export const CardRow = (props) => {
    const {
        amount,
        ...other
    } = props;

    return (
        <div className="card-column card-column__highlevel">
            <Card { ...other } />
            <div className="card-column__amount card-column__amount--highlevel">
                { new Array(amount).fill().map((_, idx) => (
                    <div key={ idx } className="card-column__voice card-column__voice--highlevel" />
                )) }
            </div>
        </div>
    );
};
