import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { StackBox } from './stack-box';
import { Button } from './button';
import { STACKS } from '../../constants';
import {
    setData,
    setReady,
} from '../../actions';
import './page.css';

// TODO
// 2. Сохранять данные в случае переподключения юзера (перезагрузка страницы)

export const Page = () => {
    const dispatch = useDispatch();
    const socket = useRef();

    const data = useSelector(state => state);
    const {
        isOpen,
        all,
        ready,
        sumByStack,
        result,
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
    };

    const handleReload = async () => {
        const message = {
            type: 'reload',
        };
        socket.current.send(JSON.stringify(message));
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
                            resultByStack={ result[stack] }
                            myVotes={ votes }
                            onReject={ isReady ? handleReject : null }
                            sumByStack={ sumByStack[stack] }
                            isOpen={ isOpen }
                        />
                    );
                }) }
            </div>
            <div className="page__controls">
                <div className="page__controls-header">
                    Проголосовали
                    <br />
                    { ready } из { all }
                </div>
                { isAdmin ? (
                    <Button
                        text={ isOpen ? 'Заново' : 'Вскрываемся' }
                        disabled={ isOpen ? false : !ready }
                        onClick={ isOpen ? handleReload: handleOpen }
                        type={ isOpen ? 'repeat' : 'open' }
                    />
                ) : (
                    <Button
                        text="Я оценил"
                        disabled={ isReady || isOpen }
                        onClick={ isOpen ? undefined : handleReady }
                    />
                ) }
            </div>
        </div>
    );
};
