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

const clients = {};

const common = {
    totalPeople: 0,
    voitedPeople: 0,
    result: {
        'Front': {},
        'Middle': {},
        'Pega': {},
        'Test': {},
        'Analyst': {},
    },
}

wss.on('connection', function connection(ws) {
    function sendEveryone(message) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    const id = uuid();

    // Увеличиваем число подключаемых людей
    common.totalPeople += 1;
    clients[id] = {
        ws,
        user: {
            isAdmin: false,
            isReady: false,
            votes: {},
        },
    };

    ws.send(JSON.stringify({
        user: clients[id].user,
    }));
    sendEveryone({
        totalPeople: common.totalPeople,
        voitedPeople: common.voitedPeople,
    });

    console.log(`New client ${id}`);

    // Сообщение от клиента
    ws.on('message', function fromClient(rawMessage) {
        const { type, data } = JSON.parse(rawMessage);
        switch (type) {
            /**
             *  КЛИК ПО "Я ОЦЕНИЛ"
             */
            case 'ready':
                // Увеличиваем количество проголосовавших
                common.voitedPeople += 1;
                sendEveryone({
                    voitedPeople: common.voitedPeople,
                });
                clients[id].user.votes = data;
                clients[id].user.isReady = true;
                // Object.keys(data).forEach((stack) => {
                //     if (common.result[stack][data[stack]]) {
                //         common.result[stack][data[stack]] += 1;
                //     } else {
                //         common.result[stack][data[stack]] = 1;
                //     }
                // });
                break;

            /**
             *  ПОДКЛЮЧЕНИЕ - ДЛЯ ОПРЕДЕЛЕНИЯ АДМИНА
             */
            case 'onopen':
                if (data.pathname === '/admin') {
                    clients[id].user.isAdmin = true;
                    common.totalPeople -= 1;
                    ws.send(JSON.stringify({
                        user: {
                            isAdmin: true,
                            isReady: false,
                            votes: {},
                        }
                    }));
                    sendEveryone({
                        totalPeople: common.totalPeople,
                    });
                }
                break;

            /**
             *  ВСКРЫТИЕ
             */
            case 'open':
                sendEveryone(common);
                break;

            /**
             *  ПЕРЕЗАПУСК
             */
            case 'reload':
                common.voitedPeople = 0;
                common.result = {
                    'Front': {},
                    'Middle': {},
                    'Pega': {},
                    'Test': {},
                    'Analyst': {},
                };
                const message = {
                    ...common,
                    user: {
                        isAdmin: false,
                        isReady: false,
                        votes: {},
                    },
                };
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        if (client !== ws) {
                            client.send(JSON.stringify(message));
                        } else {
                            client.send(JSON.stringify({
                                ...common,
                                user: {
                                    isAdmin: true,
                                    isReady: false,
                                    votes: {},
                                },
                            }));
                        }
                    }
                });
                break;

            /**
             *  ОТМЕНА ГОЛОСА
             */
            case 'reject':
                common.voitedPeople -= 1;
                sendEveryone({
                    voitedPeople: common.voitedPeople,
                });
                clients[id].user.votes = {};
                break;
            default:
                break;
        }
    });

    /**
     *  - ----- Закрытие соединения  --------
     */

    ws.on('close', () => {

        /**
         *  ADMIN
         */
        if (clients[id].user.isAdmin) {
            delete clients[id];
            console.log(`Admin is closed ${id}`);
            return;
        }


        /**
         *  CLIENT
         */
        common.totalPeople -= 1;
        if (clients[id].user.isReady) {
            common.voitedPeople -= 1;
        }
        delete clients[id];
        sendEveryone({
            totalPeople: common.totalPeople,
            voitedPeople: common.voitedPeople,
        });
        console.log(`Client is closed ${id}`);
    })
});
