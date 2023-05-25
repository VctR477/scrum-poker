import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chooseCardAC } from '../../../actions/highlevel-actions';
import { HIGHLEVEL_SCALE } from '../../../constants';
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
    } = useSelector(state => state.highlevel);

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
            className={ `card${isChosen ? ' card-dark' : ''}${isAdmin ? ' card-admin' : ''} ${color ? color : ''} card__highlevel` }
            onClick={ isAdmin ? null : handleClick }
        >
            { HIGHLEVEL_SCALE[value] }
        </div>
    );
};
