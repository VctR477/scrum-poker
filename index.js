const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const config = require('config');

const PORT = process.env.PORT || config.get('serverPort') || 3000 ;
const server = express()
    .use(express.static(path.join(__dirname, 'build')))
    .get('/', (req, res) => {
        res.sendFile(__dirname + '/build/index.html');
    })
    .get('/admin', (req, res) => {
        res.sendFile(__dirname + '/build/index.html');
    })
    .listen(PORT, () => console.log(`START --- Listening on ${ PORT }`));

const wss = new WebSocket.Server({ server: server });


// CLIENTS[clientId] = {
//     isAdmin: false,
//     isReady: false,
//     votes: {},
// };
const CLIENTS = {};

const INITIAL_STATE = {
    isOpen: false,
    all: 0,
    ready: 0,
    sumByStack: {
        Front: 0,
        Middle: 0,
        Pega: 0,
        Test: 0,
        Analyst: 0,
    },
    result: {
        Front: {},
        Middle: {},
        Pega: {},
        Test: {},
        Analyst: {},
    },
};

/**
 *
 * Возращает общие данные для фронта
 */
const getCurrentState = () => {
    const sumByStack = {
        Front: 0,
        Middle: 0,
        Pega: 0,
        Test: 0,
        Analyst: 0,
    };

    const result = {
        Front: {},
        Middle: {},
        Pega: {},
        Test: {},
        Analyst: {},
    };

    /**
     *  Считаем кол-во всех и выбравших значение юзеров
     */
    const { all, ready } = Object.keys(CLIENTS).reduce((acc, clientId) => {
        if (CLIENTS[clientId].isAdmin) {
            return acc;
        }

        if (CLIENTS[clientId].isReady) {
            acc.ready += 1;
        }
        acc.all += 1;

        /**
         *  Считаем голоса
         */
        const votes = CLIENTS[clientId].votes;
        Object.keys(votes).forEach((stack) => {
            /**
             * Общее кол-во по каждому стеку
             */
            sumByStack[stack] += 1;
            /**
             * Если результаты открыты, считаем подробно
             */
            if (INITIAL_STATE.isOpen) {
                if (result[stack][votes[stack]]) {
                    result[stack][votes[stack]] += 1;
                } else {
                    result[stack][votes[stack]] = 1;
                }
            }
        });

        return acc;
    }, { all: 0, ready: 0 });

    return {
        isOpen: INITIAL_STATE.isOpen,
        all,
        ready,
        sumByStack,
        result,
    };
};

const addUser = (id, isAdmin = false) => {
    CLIENTS[id] = {
        isAdmin,
        isReady: false,
        votes: {},
    };
};

const setUserReady = (id, votes) => {
    CLIENTS[id] = {
        isAdmin: false,
        isReady: true,
        votes,
    };
};

const clearUsers = () => {
    Object.keys(CLIENTS).forEach((clientId) => {
        CLIENTS[clientId].isReady = false;
        CLIENTS[clientId].votes = {};
    });
};

const rejectVote = (id) => {
    CLIENTS[id] = {
        isAdmin: false,
        isReady: false,
        votes: {},
    };
};

const getUser = (id) => ({
    user: CLIENTS[id],
});

const deleteUser = (id) => {
    delete CLIENTS[id];
};

wss.on('connection', function connection(ws) {
    function sendEveryone(message) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    function sendToThisUser(message) {
        ws.send(JSON.stringify(message));
    }

    const id = uuid();

    console.log(`New client ${id}`);

    // Сообщение от клиента
    ws.on('message', function fromClient(rawMessage) {
        const { type, data } = JSON.parse(rawMessage);
        switch (type) {
            /**
             *  ПОДКЛЮЧЕНИЕ - ДЛЯ ОПРЕДЕЛЕНИЯ АДМИНА
             */
            case 'onopen':
                addUser(id, data.pathname === '/admin');
                sendToThisUser(getUser(id));
                sendEveryone(getCurrentState());
                break;


            /**
             *  КЛИК ПО "Я ОЦЕНИЛ"
             */
            case 'ready':
                setUserReady(id, data);
                sendEveryone(getCurrentState());
                break;

            /**
             *  ВСКРЫТИЕ
             */
            case 'open':
                INITIAL_STATE.isOpen = true;
                sendEveryone(getCurrentState());
                break;

            /**
             *  ПЕРЕЗАПУСК
             */
            case 'reload':
                INITIAL_STATE.isOpen = false;
                clearUsers();
                const common = getCurrentState();

                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            ...common,
                            user: {
                                isAdmin: client === ws,
                                isReady: false,
                                votes: {},
                            },
                        }));
                    }
                });
                break;

            /**
             *  ОТМЕНА ГОЛОСА
             */
            case 'reject':
                rejectVote(id);
                sendEveryone(getCurrentState());
                break;
            default:
                break;
        }
    });

    /**
     *  - ----- Закрытие соединения  --------
     */

    ws.on('close', () => {
        console.log(`Client started to close ${id}`);

        deleteUser(id);
        sendEveryone(getCurrentState());

        console.log(`Client is closed ${id}`);
    })
});
