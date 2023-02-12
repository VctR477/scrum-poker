import React from 'react';
import { Card } from '../card';
import './card-column.css';

export const CardColumn = (props) => {
    const {
        amount,
        ...other
    } = props;

    return (
        <div className="card-column card-column__satisfaction">
            <Card { ...other } />
            <div className="card-column__amount">
                { new Array(amount).fill().map((_, idx) => (
                    <div key={ idx } className="card-column__voice" />
                )) }
            </div>
        </div>
    );
};
