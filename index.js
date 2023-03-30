const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const uuid = require('uuid').v4;
const config = require('config');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const resultsDir = './build/results';
const cookieName = 'scrumPoker';

const getList = () => {
    if (!fs.existsSync(resultsDir)) {
        return [];
    }
    try {
        const files = fs.readdirSync(resultsDir);
        if (files && files.length) {
            let list = files
                // Обрезаем json
                .map(file => {
                    return file.replace('.json', '');
                })
                // Фильтруем только нужные
                .filter(file => {
                    const regexp = /\D/g;
                    regexp.test(file);
                    if (regexp.test(file)) {
                        return false;
                    }
                    return true;
                })
                .map(file => Number(file))
                .sort((a, b) => b - a);

            if (list.length > 10) {
                const toRemove = list.slice(10);
                list = list.slice(0, 10);
                toRemove.forEach((item) => {
                    try {
                        fs.rmSync(`./build/results/${item}.json`);
                        console.log(`Успешно удалили старый файл с результатами ${item}.json (файлы удаляются когда их больше 10 штук)`);
                    } catch (e) {
                        console.log('Ошибка при попытке удалить файл с результатами голосования');
                        console.log(e);
                    }
                })
            }

            return list;
        }
    } catch (e) {
        console.log('Ошибка чтения результатов из файлов');
        console.log(e);
    }

    return [];
};

const makeFile = (obj, cb = ()=>{}) => {
    const timeMark = new Date().getTime();

    if (!fs.existsSync(resultsDir)){
        fs.mkdirSync(resultsDir);
    }
    try {
        const json = JSON.stringify(obj);
        fs.writeFile(`./build/results/${timeMark}.json`, json, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Файл с результатами был успешно создан');
            const list = getList();
            cb({ list }, 'LIST_MESSAGE');
        });
    } catch (e) {
        console.log('Ошибка при попытке создать файл с результатом голосования');
        console.log(e);
    }
};

const PORT = process.env.PORT || config.get('serverPort') || 3000 ;
const server = express()
    .use(cookieParser())
    .use((req, res, next) => {
        // check if client sent cookie
        const cookie = req.cookies[cookieName];
        const maxAge = 1000 * 60 * 30; // 30 min
        if (cookie === undefined) {
            const id = uuid();
            res.cookie(cookieName, id, { maxAge });
            console.log('cookie created successfully');
        } else {
            res.cookie(cookieName, cookie, { maxAge });
            // yes, cookie was already present
            // console.log('cookie exists (refresh time)', cookie);
        }
        next();
    })
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
    .get('/results', (req, res) => {
        const currentFile = req?.query?.item;

        if (currentFile) {
            try {
                const rawdata = fs.readFileSync(`${resultsDir}/${currentFile}.json`);
                const result = JSON.parse(rawdata);
                res.json(result);
            } catch (e) {
                console.log('Не получилось прочитать результат из файла');
                console.log(e);
            }
        } else {
            const result = getList();
            res.json(result);
        }
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

const OLD_USERS = {};

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

        if (votes) {
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
        }

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

const getOldUser = (id, page, isAdmin) => {
    const user = OLD_USERS[id];
    if (user && user.page === page) {
        switch (page) {
            case PAGES.SCRUM: {
                CLIENTS[id] = { ...user.user, isAdmin, votes: isAdmin ? {} : user.user.votes, isReady: isAdmin ? false : user.user.isReady };
                break;
            }
            case PAGES.SATISFACTION: {
                USERS[id] = { ...user.user, isAdmin, vote: isAdmin ? null : user.user.vote, isReady: isAdmin ? false : user.user.isReady };
                break;
            }
            default:
                break;
        }
        PAGES_BY_ID[id] = page;
        return {
            user: page === PAGES.SCRUM ? CLIENTS[id] : USERS[id],
        };
    }

    return null;
};

const getUser = (id, page) => {
    switch (page) {
        case PAGES.SCRUM: {
            if (CLIENTS[id]) {
                return {
                    user: CLIENTS[id],
                };
            } else {
                return null;
            }
        }
        case PAGES.SATISFACTION: {
            if (USERS[id]) {
                return {
                    user: USERS[id],
                };
            } else {
                return null;
            }
        }
        default:
            return null;
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

    let id;

    // Сообщение от клиента
    ws.on('message', function fromClient(rawMessage, ...args) {
        try {
            const message = JSON.parse(rawMessage);
            const { type, data, page } = message;

            if (!page) {
                return;
            }
            switch (type) {
                /**
                 *  ПОДКЛЮЧЕНИЕ - ДЛЯ ОПРЕДЕЛЕНИЯ АДМИНА
                 */
                case 'onopen':
                    id = message.id;
                    const isAdmin = data.pathname === '/admin' || data.pathname === '/satisfaction/admin';
                    const oldUser = getOldUser(id, page, isAdmin) || getUser(id, page);
                    if (oldUser) {
                        console.log(`Old client reconnect ${id}`);
                        console.log(JSON.stringify({ type, data, page, oldUser }));
                        sendToThisUser(oldUser, page);
                    } else {
                        console.log(`New client ${id}`);
                        const user = addUser(id, isAdmin, page);
                        sendToThisUser(user, page);
                    }
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
                    const state = getCurrentState(page);
                    makeFile(state, sendEveryone);
                    sendEveryone(state, page);
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
        } catch (e) {
            console.log('Ошибка получения WebSocket сообщения');
            console.log(e);
        }
    });

    /**
     *  - ----- Закрытие соединения  --------
     */

    ws.on('close', () => {
        if (!id) {
            console.log(`Client closed without id - ${id}`);
            return;
        }
        console.log(`Client started to close ${id}`);

        const page = PAGES_BY_ID[id];
        const user = getUser(id, page);
        OLD_USERS[id] = {
            page,
            ...user,
        };
        deleteUser(id, page);
        sendEveryone(getCurrentState(page), page);

        console.log(`Client is closed ${id}`);
    })
});
