import * as http from 'http';
import * as express from 'express';
import {SyncsServer} from "syncs";
require('colors');



let app=express();
let server=http.createServer(app);
let io=new SyncsServer(server);




server.listen(8080,()=>{
    console.log("Reverse Server Started".red);
    console.log("server address " + "http://localhost:8080".blue);
});



// static file server
app.use(express.static(__dirname+'/www'));
app.get('/syncs.js',(req,res)=>{
    res.send(io.clientScript);
});


// reverse each incoming message
io.onMessage((data:any,client:any)=>{
    if(data.message){
        client.send({message:data.message.split("").reverse().join("")});
    }
})