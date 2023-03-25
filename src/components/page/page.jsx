import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { StackBox } from './stack-box';
import { Button } from './button';
import { Results } from './results';
import { STACKS } from '../../constants';
import {
    setDataAC,
    setReadyAC,
} from '../../actions/scrum-actions';
import { setList } from '../../actions/results-actions';
import './page.css';

// TODO

// 1. сделать чтобы хранились только последнии 10, а остальные удалялись
// 2.  Сохранять данные в случае переподключения юзера (перезагрузка страницы)

const PAGE_NAME = 'scrum';
const LIST_MESSAGE = 'LIST_MESSAGE';

export const Page = () => {
    const dispatch = useDispatch();
    const socket = useRef();

    const data = useSelector(state => state.scrum);
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

            if (message.page === LIST_MESSAGE) {
                dispatch(setList(message.list));
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
            data: votes,
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
            page: PAGE_NAME,
            type: 'reload',
        };
        socket.current.send(JSON.stringify(message));
    };

    const handleReject = async () => {
        const message = {
            page: PAGE_NAME,
            type: 'reject',
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
            <a
                className="link"
                href="/satisfaction"
            >
                 -> Оценка спринта
            </a>
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
                            disabled={ isReady || isOpen || (Object.keys(votes).length === 0) }
                            onClick={ isOpen ? undefined : handleReady }
                        />
                    ) }
                </div>
                {
                    isAdmin && (
                        <Results />
                    )
                }
            </div>
        </div>
    );
};
