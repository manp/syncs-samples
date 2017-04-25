///<reference path="../../../node_modules/syncs-browser/syncs.d.ts"/>
import { Injectable } from '@angular/core';


@Injectable()
export class CoreDataService {
    //Syncs Instance
    private io:Syncs=null;

    //Global Shared Variable
    public statics:any={};


    // public info:any={name:"",avatar:null,id:null};

    //current gust or user profile
    public profile:any={name:"",avatar:null,id:null,online:true};


    //list of online users
    public users:Map<string,any>=new Map();

    //list of messages by users and unread counter
    public messages:Map<string,any>=new Map();


    constructor(){
        //generate syncs instance and enable debug mode to log commands
        this.io=new Syncs();
        this.io.enableDebugMode();

        //get global shared variable that reports online users
        this.statics=this.io.globalShared('statics');



        /************ RMI INITIALIZATION **************/
        this.io.functions.setUsers=(users:any[])=>{this.setUsers(users)};
        this.io.functions.setProfile=(id:string,name:string,avatar:string,online:boolean)=>this.setProfile(id,name,avatar,online);

        /************ SUBSCRIPTION INITIALIZATION **************/
        this.io.subscribe('user-join',user=>this.addUser(user));
        this.io.subscribe('user-profile-change',user=>this.changeUserProfile(user));
        this.io.subscribe('user-exit',data=>this.users.delete(data.id));
        this.io.subscribe('message',data=>this.onMessage(data))
    }



    // set list of users
    private setUsers(users:any[]){
        this.messages.set('global',{unread:0,messages:[]})
        users.forEach(user=>{
            this.addUser(user);
        })
    }
    //add user to list of users
    private addUser(user:any){
        if(user.id!=this.profile.id){
            this.messages.set(user.id,{unread:0,messages:[]})
            this.users.set(user.id,user);
        }
    }

    //change user profile
    private changeUserProfile(profile:any){
        let user=this.users.get(profile.id);
        if(user){
            user.name=profile.name;
            user.avatar=profile.avatar;
            user.online=profile.online;
        }
    }

    // set current user profile
    private setProfile(id:string,name:string,avatar:string,online:boolean){
        this.profile.id=id;
        this.profile.name=name;
        this.profile.avatar=avatar;
        this.profile.online=online;
    }

    //edit current user profile only on client side
    public changeProfile(name:string, avatar:string,online:boolean){
        this.profile.name=name;
        this.profile.avatar=avatar;
        this.profile.online=online;
        this.io.remote.changeProfile(name,avatar,online);
    }

    //get list of message from a user
    public getMessages(id:string){
        if(this.messages.has(id)){
            return this.messages.get(id).messages;
        }
        return [];
    }

    //get number of unread messages from a user
    public getUnread(id:string){
        if(this.messages.has(id)){
            return this.messages.get(id).unread;
        }
        return 0;
    }

    //send message to server
    public sendMessage(to:string,message:string){
        this.io.publish('client-message',{to:to,message:message});
        this.addMessage(to,this.profile.id,message);
    }

    //handle incoming messages
    public onMessage(data:any){
        if(data.from==this.profile.id){
            return;
        }
        if(data.global){
            this.addMessage('global',data.from,data.message);
        }else{
            this.addMessage(data.from,data.from,data.message);
        }

    }

    //add message to list of messages
    public addMessage(to:string,from:string,message:string){
        this.messages.get(to).messages.push({message:message,from:from})
        if(from!='me'){
            this.messages.get(to).unread++;
        }
    }

    // reset number of unread messages from a client
    public resetUnread(id:string){
        if(this.messages.has(id)){
             this.messages.get(id).unread=0;
        }
    }

    //get user by id
    public getUser(id:string){
        if(id==this.profile.id){
            return {name:this.profile.name,avatar:this.profile.avatar}
        }else if(id=='global'){
            return {name:'global',online:true,avatar:1}
        }
        return this.users.get(id);
    }
    
}