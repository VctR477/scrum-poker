import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { StackBox } from '../stack-box';
import { Button } from '../button';
import { STACKS } from '../../constants';
import {
    setData,
    setReady,
} from '../../actions';
import './page.css';

// TODO
// 1. Менять цифры рядом со стеками сразу после нажатия "Я оценил"
// 2. Сохранять данные в случае переподключения юзера (перезагрузка страницы)
// 3. Поправить стили для мобильника

export const Page = () => {
    const dispatch = useDispatch();
    const socket = useRef();
    const [isOpen, setIsOpen] = useState(false);

    const data = useSelector(state => state);
    const {
        totalPeople,
        voitedPeople,
        result = {},
        user: {
            isAdmin,
            isReady,
            votes,
        },
    } = data;

    const connect = () => {
        const host = window.location.origin.replace(/^http/, 'ws');
        socket.current = new WebSocket(host);

        socket.current.onopen = function(event) {
            console.log('Socket открыт');
            const { pathname } = window.location;
            const message = {
                type: 'onopen',
                data: { pathname },
            };
            socket.current.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            dispatch(setData(message));
        }
        socket.current.onclose= (e) => {
            console.log('Socket закрыт', e);
        }
        socket.current.onerror = (e) => {
            console.log('Socket произошла ошибка', e);
        }
    };

    const handleReady = async () => {
        const message = {
            type: 'ready',
            data: votes,
        };
        dispatch(setReady(true));
        socket.current.send(JSON.stringify(message));
    };

    const handleOpen = async () => {
        const message = {
            type: 'open',
        };
        socket.current.send(JSON.stringify(message));
        setIsOpen(true);
    };

    const handleReload = async () => {
        const message = {
            type: 'reload',
        };
        socket.current.send(JSON.stringify(message));
        setIsOpen(false);
    };

    const handleReject = async () => {
        const message = {
            type: 'reject',
        };
        dispatch(setReady(false));
        socket.current.send(JSON.stringify(message));
    };

    useEffect(() => {
        if (!socket || !socket.current) {
            connect();
        }
    }, [connect, socket]);

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
                            onReject={ isReady ? handleReject : null }
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
                { isAdmin ? (
                    <Button
                        text={ isOpen ? 'Заново' : 'Вскрываемся' }
                        disabled={ !voitedPeople }
                        onClick={ isOpen ? handleReload: handleOpen }
                        type={ isOpen ? 'repeat' : 'open' }
                    />
                ) : (
                    <Button
                        text="Я оценил"
                        disabled={ isReady }
                        onClick={ handleReady }
                    />
                ) }
            </div>
        </div>
    );
};
