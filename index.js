const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const uuid = require('uuid').v4;
// import { SCALE, STACKS } from './src/constants.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = require('http').createServer(app);

const wss = new WebSocket.Server({ server:server });

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
        userData: {
            isAdmin: false,
            isOpen: false,
            isReady: false,
            myVotes: {},
        },
    };

    sendEveryone(common);

    console.log(`New client ${id}`);

    // Сообщение от клиента
    ws.on('message', function fromClient(rawMessage) {
        const { type, data } = JSON.parse(rawMessage);
        console.log(data);
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
                console.log(common.result);
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
    res.sendfile(__dirname + '/build/index.html');
});

server.listen(PORT, () => console.log(`START --- Listening on ${ PORT }`));
