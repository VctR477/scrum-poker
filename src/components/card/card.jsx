import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chooseCard } from '../../actions';
import './card.css';

export const Card = (props) => {
    const dispatch = useDispatch();
    const {
        value,
        isChosen,
        stackName,
    } = props;

    const {
        user: {
            isAdmin,
        },
    } = useSelector(state => state);

    const handleClick = () => {
        dispatch(chooseCard({
            stackName,
            value,
        }));
    };

    return (
        <div
            className={ `card${isChosen ? ' card-dark' : ''}${isAdmin ? ' card-admin' : ''}` }
            onClick={ isAdmin ? null : handleClick }
        >
            { value }
        </div>
    );
};
