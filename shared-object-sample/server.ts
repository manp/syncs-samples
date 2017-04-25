import * as http from 'http';
import * as express from 'express';
import {setInterval} from "timers";
import * as process from "process";
import {SyncsServer} from "syncs";
require('colors');

let app=express();
let server=http.createServer(app);
let io=new SyncsServer(server);





server.listen(8080,()=>{
    console.log("Shared Object Server Started".red);
    console.log("server address" + " http://localhost:8080".blue);
    console.log(process.pid);
});



// static file server
app.use(express.static(__dirname+'/www'));
app.get('/syncs.js',(req,res)=>{
    res.send(io.clientScript);
});






let lastSize=0;
// time shared variable
io.shared('time').string="";
setInterval(()=>{
    io.shared('time').string=new Date().toLocaleTimeString();
    if(lastSize!=io.clients.size){
        lastSize=io.clients.size;
        console.log(io.clients.size);
    }
},1000);


// generate groups
let group1=io.group('g1');
let group2=io.group('g2');
let group3=io.group('g3');



io.functions.registerAsMaster=function(){
    let settings=this.shared('settings');
    //handle master user settings change and apply them to group settings
    settings((event)=>{
        group1.shared('settings').title=settings.title1;
        group1.shared('settings').color=settings.color1;

        group2.shared('settings').title=settings.title2;
        group2.shared('settings').color=settings.color2;

        group3.shared('settings').title=settings.title3;
        group3.shared('settings').color=settings.color3;
    })

    //set default names
    settings.title1="Avengers";
    settings.title2="Super Naturals";
    settings.title3="Nocturnal Animals";

    //set default colors
    settings.color1="red";
    settings.color2="green";
    settings.color3="blue";
}

//register clients in groups
io.functions.registerInGroup=function(name){
    this.memberGroups.forEach(group=>group.remove(this));
    io.group(name).add(this);
}


