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
    const id = uuid();
    clients[id] = {
        ws,
        data: {
            common,
            userData: {
                isAdmin: false,
                isOpen: false,
                isReady: false,
                myVotes: {},
            }
        },
    };
    console.log(`New client ${id}`);
    // ws.send(JSON.stringify({ x: 'Welcome New Client!'}));

    ws.on('message', function fromClient(rawMessage) {
        console.log('RAWWW from CLIENT: ',rawMessage);
        const message = JSON.parse(rawMessage);
        console.log('from CLIENT: ', message);
        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(message);
        //     }
        // });
    });

    ws.on('close', () => {
        delete clients[id];
        console.log(`Client is closed ${id}`)
    })
});

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendfile(__dirname + '/build/index.html');
});

server.listen(PORT, () => console.log(`START --- Listening on ${ PORT }`));
