// const express = require('express');
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const PORT = process.env.PORT || 3000;
//
// const USERS = [];
//
// const userData = {
//     isAdmin: false,
//     isOpen: false,
//     isReady: false,
//     myVotes: {
//         'Front': {
//             '8': true,
//         },
//         'Test': {
//             '3': true,
//         },
//     },
// }
//
// const common = {
//     totalPeople: 38,
//     voitedPeople: 35,
//     result: {
//         'Front': {
//             '1': 9,
//             '3': 3,
//             '8': 8,
//         },
//         'Middle': {
//             '2': 8,
//             '20': 3,
//             '13': 5,
//         },
//         'Pega': {
//             '2': 1,
//             '5': 3,
//             '40': 4,
//         },
//         'Test': {
//             '?': 4,
//             '1': 7,
//             '2': 2,
//         },
//         'Analyst': {
//             '3': 4,
//             '5': 2,
//             '8': 3,
//         },
//     },
// }
//
// express()
//     .use(express.static(path.join(__dirname, 'build')))
//     .use(cookieParser())
//     .get('/', (req, res) => {
//         console.log(req);
//         res.sendfile(__dirname + '/build/index.html');
//     })
//     .get('/admin', (req, res) => {
//         console.log(req.cookies)
//         res.sendfile(__dirname + '/build/index.html');
//     })
//     .get('/get-cookies', (req, res, next) => {
//         res.json(req.cookies);
//     })
//     .get('/data', (req, res) => {
//
//     })
//     .listen(PORT, () => console.log(`Listening on ${ PORT }`))
