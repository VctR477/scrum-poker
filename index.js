const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

express()
    .use(express.static(path.join(__dirname, 'build')))
    .get('/', (req, res) => {
        res.sendfile(__dirname + '/build/index.html');
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
