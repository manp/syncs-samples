import * as http from 'http';
import * as express from 'express';
import {initializeChatService} from "./chatly";
import {SyncsServer} from "syncs";
require('colors');
/**
 *  server initialize
 **/
const app=express();
const server=http.createServer(app);
const io=new SyncsServer(server);


/**
 * make express to serve static files
 **/
app.use(express.static(__dirname+'/www'));
app.use('/node_modules',express.static(__dirname+'/node_modules'));
app.get('/syncs.js',(req,res)=>{
    res.send(io.clientScript);
})




/**
 * start web server
 **/
server.listen(8080,()=>{
    console.log('server started on '+'http://localhost:8080'.blue);
});

initializeChatService(io);