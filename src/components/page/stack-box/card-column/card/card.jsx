import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chooseCardAC } from '../../../../../actions/scrum-actions';
import './card.css';

export const Card = (props) => {
    const dispatch = useDispatch();
    const {
        value,
        isChosen,
        stackName,
        onReject,
        isOpen,
    } = props;

    const {
        user: {
            isAdmin,
        },
    } = useSelector(state => state.scrum);

    const handleClick = async () => {
        if (isOpen) {
            return;
        }
        if (onReject) {
            await onReject();
        }
        dispatch(chooseCardAC({
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
