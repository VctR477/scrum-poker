const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const uuid = require('uuid').v4;
const config = require('config');

const PORT = process.env.PORT || config.get('serverPort') || 3000 ;
const app = express();

const wss = new WebSocket.Server({ port: 3001 });

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
        // console.log(data);
        switch (type) {
            case 'ready':
                // Увеличиваем количество проголосовавших
                common.voitedPeople += 1;
                sendEveryone({
                    voitedPeople: common.voitedPeople,
                });
                Object.keys(data).forEach((stack) => {
                    if (common.result[stack][data[stack]]) {
                        common.result[stack][data[stack]] += 1;
                    } else {
                        common.result[stack][data[stack]] = 1;
                    }
                });
                // console.log(common.result);
                break;
            case 'onopen':
                if (data.pathname === '/admin') {
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
            case 'open':
                sendEveryone(common);
                break;
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
            default:
                break;
        }
    });

    // Закрытие соединения
    ws.on('close', () => {
        delete clients[id];
        common.totalPeople -= 1;
        sendEveryone({
            totalPeople: common.totalPeople,
        });
        console.log(`Client is closed ${id}`)
    })
});

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});

app.listen(PORT, () => console.log(`START --- Listening on ${ PORT }`));
