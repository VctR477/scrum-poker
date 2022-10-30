import React from 'react';
import { useDispatch } from 'react-redux';
import { chooseCard } from '../../actions';
import './card.css';

export const Card = (props) => {
    const dispatch = useDispatch();
    const {
        value,
        isChosen,
        stackName,
    } = props;

    const handleClick = () => {
        dispatch(chooseCard({
            stackName,
            value,
        }));
    };


    return (
        <div
            className={ `card${isChosen ? ' card-dark' : ''}` }
            onClick={ handleClick }
        >
            { value }
        </div>
    );
};
