"use strict";
const http = require('http');
const express = require('express');
const chatly_1 = require("./chatly");
const syncs_1 = require("syncs");
require('colors');
/**
 *  server initialize
 **/
const app = express();
const server = http.createServer(app);
const io = new syncs_1.SyncsServer(server);
/**
 * make express to serve static files
 **/
app.use(express.static(__dirname + '/www'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.get('/syncs.js', (req, res) => {
    res.send(io.clientScript);
});
/**
 * start web server
 **/
server.listen(8080, () => {
    console.log('server started on ' + 'http://localhost:8080'.blue);
});
chatly_1.initializeChatService(io);
//# sourceMappingURL=server.js.map