import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { StackBox } from '../stack-box';
import { Button } from '../button';
import { STACKS } from '../../constants';
import {
    setData,
    setReady,
} from '../../actions';
import './page.css';

export const Page = () => {
    const dispatch = useDispatch();
    const socket = useRef();

    const data = useSelector(state => state);
    const {
        totalPeople,
        voitedPeople,
        result = {},
        user: {
            isAdmin,
            isOpen,
            isReady,
            votes,
        },
    } = data;

    const connect = () => {
        socket.current = new WebSocket(`ws://${window.location.host}`)

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            dispatch(setData(message));
        }
    };

    const handleReady = async () => {
        const message = {
            type: 'ready',
            data: votes,
        };
        dispatch(setReady());
        socket.current.send(JSON.stringify(message));
    }

    useEffect(() => {
        connect();
    }, []);

    return (
        <div className="page">
            <div className="page__stacks">
                { STACKS.map((stack) => {
                    return (
                        <StackBox
                            key={ stack }
                            stackName={ stack }
                            votes={ result[stack] }
                            myVotes={ votes }
                        />
                    );
                }) }
            </div>
            <div className="page__controls">
                <div className="page__controls-header">
                    Проголосовали
                    <br />
                    { voitedPeople } из { totalPeople }
                </div>
                <Button
                    text="Я оценил"
                    disabled={ isReady }
                    onClick={ handleReady }
                />
            </div>
        </div>
    );
};
