import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chooseCardAC } from '../../../actions/satisfaction-actins';
import './card.css';

export const Card = (props) => {
    const dispatch = useDispatch();
    const {
        value,
        isChosen,
        onReject,
        isOpen,
        color,
    } = props;

    const {
        user: {
            isAdmin,
        },
    } = useSelector(state => state.satisfaction);

    const handleClick = async () => {
        if (isOpen) {
            return;
        }
        if (onReject) {
            await onReject();
        }
        dispatch(chooseCardAC(value));
    };

    return (
        <div
            className={ `card${isChosen ? ' card-dark' : ''}${isAdmin ? ' card-admin' : ''} ${color ? color : ''}` }
            onClick={ isAdmin ? null : handleClick }
        >
            { value }
        </div>
    );
};
