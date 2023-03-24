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
    .get('/satisfaction', (req, res) => {
        res.sendFile(__dirname + '/build/index.html');
    })
    .get('/satisfaction/admin', (req, res) => {
        res.sendFile(__dirname + '/build/index.html');
    })
    .listen(PORT, () => console.log(`START --- Listening on ${ PORT }`));

const wss = new WebSocket.Server({ server: server });

const PAGES = {
    SCRUM: 'scrum',
    SATISFACTION: 'satisfaction',
};

// CLIENTS[clientId] = {
//     isAdmin: false,
//     isReady: false,
//     votes: {},
// };
const CLIENTS = {};

// USERS[clientId] = {
//     isAdmin: false,
//     isReady: false,
//     votes: null | '1' | '2' ...
// };
const USERS = {};

const INITIAL_STATE = {
    satisfaction: {
        isOpen: false,
        all: 0,
        ready: 0,
        result: {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 0,
            '10': 0,
        },
    },
    scrum: {
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
    },
};

/**
 *
 * Возращает общие данные для фронта
 */

const getDataByClients = (page) => {
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
            if (INITIAL_STATE[page].isOpen) {
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
        isOpen: INITIAL_STATE[page].isOpen,
        all,
        ready,
        sumByStack,
        result,
    };
};

const getDataByUsers = (page) => {
    const result = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
    };

    let sum = 0;

    const { all, ready } = Object.keys(USERS).reduce((acc, userId ) => {
        if (USERS[userId].isAdmin) {
            return acc;
        }

        if (USERS[userId].isReady) {
            acc.ready += 1;
        }
        acc.all += 1;
        if (USERS[userId].vote) {
            sum = sum + Number(USERS[userId].vote);
            result[USERS[userId].vote] += 1;
        }

        return acc;
    }, { all: 0, ready: 0 });

    const isOpen = INITIAL_STATE[page].isOpen;

    return {
        isOpen,
        all,
        ready,
        result,
        average: isOpen ? (sum/ready).toFixed(2) : 0,
    };
};
const getCurrentState = (page) => {
    switch (page) {
        case PAGES.SCRUM: {
            return getDataByClients(page);
        }
        case PAGES.SATISFACTION: {
            return getDataByUsers(page);
        }
        default:
            return getDataByClients(page);
    }
};

const PAGES_BY_ID = {};

const addUser = (id, isAdmin = false, page) => {
    PAGES_BY_ID[id] = page;
    switch (page) {
        case PAGES.SCRUM: {
            CLIENTS[id] = {
                isAdmin,
                isReady: false,
                votes: {},
            };
            return {
                user: CLIENTS[id],
            };
        }
        case PAGES.SATISFACTION: {
            USERS[id] = {
                isAdmin,
                isReady: false,
                vote: null,
            };
            return {
                user: USERS[id],
            };
        }
        default:
            break;
    }
};

const setUserReady = (id, votes, page) => {
    switch (page) {
        case PAGES.SCRUM: {
            CLIENTS[id] = {
                isAdmin: false,
                isReady: true,
                votes,
            };
            return {
                user: CLIENTS[id],
            };
        }
        case PAGES.SATISFACTION: {
            USERS[id] = {
                isAdmin: false,
                isReady: true,
                vote: votes,
            };
            return {
                user: USERS[id],
            };
        }
        default:
            break;
    }
};

const clearUsers = (page) => {
    switch (page) {
        case PAGES.SCRUM: {
            Object.keys(CLIENTS).forEach((clientId) => {
                CLIENTS[clientId].isReady = false;
                CLIENTS[clientId].votes = {};
            });
        }
            break;
        case PAGES.SATISFACTION: {
            Object.keys(USERS).forEach((clientId) => {
                USERS[clientId].isReady = false;
                USERS[clientId].vote = null;
            });
        }
            break;
        default:
            break;
    }
};

const rejectVote = (id, page) => {
    switch (page) {
        case PAGES.SCRUM: {
            CLIENTS[id] = {
                isAdmin: false,
                isReady: false,
                votes: {},
            };
        }
            break;
        case PAGES.SATISFACTION: {
            USERS[id] = {
                isAdmin: false,
                isReady: false,
                vote: null,
            };
        }
            break;
        default:
            break;
    }
};

const deleteUser = (id, page) => {
    delete PAGES_BY_ID[id];
    switch (page) {
        case PAGES.SCRUM: {
            delete CLIENTS[id];
        }
            break;
        case PAGES.SATISFACTION: {
            delete USERS[id];
        }
            break;
        default:
            break;
    }
};

wss.on('connection', function connection(ws) {
    function sendEveryone(message, page) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ ...message, page }));
            }
        });
    }

    function sendToThisUser(message, page) {
        ws.send(JSON.stringify({ ...message, page }));
    }

    const id = uuid();

    console.log(`New client ${id}`);

    // Сообщение от клиента
    ws.on('message', function fromClient(rawMessage) {
        const { type, data, page } = JSON.parse(rawMessage);

        if (!page) {
            return;
        }
        switch (type) {
            /**
             *  ПОДКЛЮЧЕНИЕ - ДЛЯ ОПРЕДЕЛЕНИЯ АДМИНА
             */
            case 'onopen':
                const isAdmin = data.pathname === '/admin' || data.pathname === '/satisfaction/admin';
                const user = addUser(id, isAdmin, page);
                sendToThisUser(user, page);
                sendEveryone(getCurrentState(page), page);
                break;


            /**
             *  КЛИК ПО "Я ОЦЕНИЛ"
             */
            case 'ready':
                setUserReady(id, data, page);
                sendEveryone(getCurrentState(page), page);
                break;

            /**
             *  ВСКРЫТИЕ
             */
            case 'open':
                INITIAL_STATE[page].isOpen = true;
                sendEveryone(getCurrentState(page), page);
                break;

            /**
             *  ПЕРЕЗАПУСК
             */
            case 'reload':
                INITIAL_STATE[page].isOpen = false;
                clearUsers(page);
                const common = getCurrentState(page);

                const votes = page === PAGES.SCRUM ? { votes: {} } : { vote: null };

                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            ...common,
                            user: {
                                isAdmin: client === ws,
                                isReady: false,
                                ...votes,
                            },
                            page,
                        }));
                    }
                });
                break;

            /**
             *  ОТМЕНА ГОЛОСА
             */
            case 'reject':
                rejectVote(id, page);
                sendEveryone(getCurrentState(page), page);
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

        const page = PAGES_BY_ID[id];
        deleteUser(id, page);
        sendEveryone(getCurrentState(page), page);

        console.log(`Client is closed ${id}`);
    })
});
