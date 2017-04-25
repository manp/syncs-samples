

import {SyncsServer, SyncsClient} from "syncs";
/**
 * SyncsSharedObject for reporting statics to users
 * @type {any}
 */
let statics:any=null;


/**
 * Syncs Instance
 */
let io:SyncsServer=null;
/**
 * initialize real-time functionality
 * @param io
 */
export function initializeChatService(syncsInstance:SyncsServer){
    io=syncsInstance
    //initialize statics
    statics=io.shared('statics');
    statics.gusts=0;
    statics.users=0;

    //initialize onClientConnection
    io.onConnection(onClientConnect)

    //initialize onReconnection

    io.onReConnection(onClientReconnection)
    // initialize onClientDisconnect
    io.onClientDisconnect(onClientDisconnect)

    //initialize onClientClose
    io.onClientClose(onClientClose);


    //initialize RMI methods
    io.functions.changeProfile=changeProfile;


    //Subscriptions
    io.subscribe('client-message',onClientMessage);
}


/**
 * handle client connection
 * @param client
 */
function onClientConnect(client:SyncsClient){
        onGustJoin(client);
}

/**
 * handle client reconnection
 * this client can be user or guest
 * @param client
 */
function onClientReconnection(client:SyncsClient){
    if(client.data.id){
        onUserJoin(client);
    }else{
        onGustJoin(client);
    }
}
/**
 * handle client close
 * it will only change online status of client
 * @param client
 */
function onClientDisconnect(client:SyncsClient){
    if(client.data.id){
        client.data.online=false;
        publishUserProfileChange(client);
        statics.users--;
    }else{
        statics.guests--;
    }
}
/**
 * handle client close
 * when client can not establish connection, or on exit
 * @param client
 */
function onClientClose(client:SyncsClient){
    if(client.data.id){
        publishUserExit(client);
    }
}


/**
 * handle user rejoin
 * @param client
 */
function onUserJoin(client:SyncsClient){
    //send user profile
    sendProfile(client);
    //update statics
    statics.users++;

    //send list of users to this new guest
    sendUsersList(client);
}
function onGustJoin(client:SyncsClient){
    //Generate Profile Name
    client.data.name="Guest User";
    client.data.id=null;
    client.data.avatar="1";
    client.data.online=true;

    //send Profile information
    sendProfile(client);

    //add guest client to guests group
    io.group('guests').add(client);

    //update statics
    statics.guests++;

    //send list of users to this new guest
    sendUsersList(client);
}

/**
 * send user or guest profile to client side
 * @param client
 */
function sendProfile(client:SyncsClient){
    client.remote.setProfile(client.data.id,client.data.name,client.data.avatar,client.data.online);
}

/**
 * send list of Users to all online users
 * @param client
 */
function sendUsersList(client:SyncsClient){
    client.remote.setUsers(getUsersList());
}

/**
 * publish user profile change to all online clients
 * @param user
 */
function publishUserProfileChange(user:SyncsClient){
    io.publish('user-profile-change',{name:user.data.name,id:user.data.id,avatar:user.data.avatar,online:user.data.online});
}
function publishUserExit(user:SyncsClient){
    io.publish('user-exit',{id:user.data.id})
}

/**
 * register guest in users list
 * @param guest
 */
function registerGuest(guest:SyncsClient){
    guest.data.online=true;
    guest.data.id=guest.socketId;
    io.group('guests').remove(guest);
    io.group('users').add(guest);

    sendProfile(guest);

    statics.guests--;
    statics.users++;
}

/**
 * Publis user join event
 * @param user
 */
function publishUserJoin(user:SyncsClient){
    io.publish('user-join',{name:user.data.name,id:user.data.id,avatar:user.data.avatar,online:user.data.online});
}




/**
 * generates list of users
 * @returns {any[]}
 */
function getUsersList(){
    return [... io.group('users').clients].map(user=> {
        return {name: user.data.name, id: user.data.id, avatar: user.data.avatar, online: user.data.online}
    });
}

/**
 * get specific user
 * @param id
 * @returns {SyncsClient|null}
 */
function getUser(id:string):SyncsClient{
    let result=null;

    io.group('users').clients.forEach(client=>{
        if(client.data.id==id){
            result=client;
            return;
        }
    })
    return result;
}

/************* RMI Methods ***************/
function changeProfile(name:string,avatar:string,online:boolean){
    this.data.name=name;
    this.data.avatar=avatar;
    this.data.online=online;

    if(this.data.id){
        publishUserProfileChange(this)
    }else{
        registerGuest(this);
        publishUserJoin(this);
    }

}

/************ Message Passing ***************/
function onClientMessage(data:any,client:SyncsClient){
    //reject gust users to send message
    if(!client.data.id){
        return;
    }


    if(data.to=='global'){
        publishGlobalMessage(client.data.id,data.message);
    }else{
        publishDirectMessage(data.to,client.data.id,data.message);
    }
}
function publishGlobalMessage(from:string,message:string){
    io.publish('message',{from:from,message:message,global:true});
}
function publishDirectMessage(to:string,from:string,message:string){
    let user=getUser(to);
    if(user){
        user.publish('message',{from:from,message:message,global:false});
    }
}
