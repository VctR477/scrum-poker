import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import { Line } from './line';
import { Button } from './button';
import {
    setDataAC,
    setReadyAC,
} from '../../actions/highlevel-actions';

import './highlevel.css';

const PAGE_NAME = 'highlevel';

export const Highlevel = () => {
    const dispatch = useDispatch();
    const socket = useRef();

    const data = useSelector(state => state.highlevel);
    const {
        isOpen,
        all,
        ready,
        result,
        user: {
            isAdmin,
            isReady,
            vote,
        },
    } = data;

    const heartbeat = () => {
        if (!socket || !socket.current) return;
        if (socket.current.readyState !== 1) return;
        socket.current.send("heartbeat");
        setTimeout(heartbeat, 500);
    }

    // TODO вынести в хук
    const handleConnect = () => {
        const host = window.location.origin.replace(/^http/, 'ws');
        socket.current = new WebSocket(host);

        socket.current.onopen = function(event) {
            const id = Cookies.get('scrumPoker');
            console.log('Socket открыт');
            const { pathname } = window.location;
            const message = {
                id,
                page: PAGE_NAME,
                type: 'onopen',
                data: { pathname },
            };
            socket.current.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.page === PAGE_NAME) {
                dispatch(setDataAC(message));
            }
        }
        socket.current.onclose= (e) => {
            console.log('Socket закрыт', e);
            console.log('--- Пробую повторное подключение ---');
            handleConnect();
        }
        socket.current.onerror = (e) => {
            console.log('Socket произошла ошибка', e);
        }

        heartbeat();
    };

    const handleReady = async () => {
        const message = {
            page: PAGE_NAME,
            type: 'ready',
            data: vote,
        };
        dispatch(setReadyAC(true));
        socket.current.send(JSON.stringify(message));
    };

    const handleOpen = async () => {
        const message = {
            page: PAGE_NAME,
            type: 'open',
        };
        socket.current.send(JSON.stringify(message));
    };

    const handleReload = async () => {
        const message = {
            type: 'reload',
            page: PAGE_NAME,
        };
        socket.current.send(JSON.stringify(message));
    };

    const handleReject = async () => {
        const message = {
            type: 'reject',
            page: PAGE_NAME,
        };
        dispatch(setReadyAC(false));
        socket.current.send(JSON.stringify(message));
    };

    useEffect(() => {
        if (!socket || !socket.current) {
            handleConnect();
        }
    }, [handleConnect, socket]);

    return (
        <div>
            <div className="nav">
                <a
                    className="link"
                    href="/"
                >
                    -> Оценка задачи
                </a>
                <a
                    className="link"
                    href="/satisfaction"
                >
                    -> Оценка спринта
                </a>
            </div>
            <div className="page">
                <div className="page__stacks page__satisfaction">
                    <Line
                        result={ isOpen ? result : {} }
                        vote={ vote }
                        onReject={ isReady ? handleReject : null }
                        ready={ ready }
                        isOpen={ isOpen }
                    />
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
                            disabled={ isReady || isOpen || !vote }
                            onClick={ isOpen ? undefined : handleReady }
                        />
                    ) }
                </div>
            </div>
        </div>
    );
};
