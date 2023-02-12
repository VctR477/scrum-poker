import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Line } from './line';
import { Button } from './button';
import {
    setDataAC,
    setReadyAC,
} from '../../actions/satisfaction-actins';
import './satisfaction.css';

// Добавить ссылки на страницы

const PAGE_NAME = 'satisfaction';

export const Satisfaction = () => {
    const dispatch = useDispatch();
    const socket = useRef();

    const data = useSelector(state => state.satisfaction);
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
        average,
    } = data;

    const handleConnect = () => {
        const host = window.location.origin.replace(/^http/, 'ws');
        socket.current = new WebSocket(host);

        socket.current.onopen = function(event) {
            console.log('Socket открыт');
            const { pathname } = window.location;
            const message = {
                page: PAGE_NAME,
                type: 'onopen',
                data: { pathname },
            };
            socket.current.send(JSON.stringify(message));
        };
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
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
        <div className="page">
            <div className="page__stacks page__satisfaction">
                <Line
                    result={ isOpen ? result : {} }
                    vote={ vote }
                    onReject={ isReady ? handleReject : null }
                    ready={ ready }
                    isOpen={ isOpen }
                    average={ average }
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
    );
};
