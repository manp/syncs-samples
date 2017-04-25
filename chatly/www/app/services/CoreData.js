"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
///<reference path="../../../node_modules/syncs-browser/syncs.d.ts"/>
const core_1 = require('@angular/core');
let CoreDataService = class CoreDataService {
    constructor() {
        //Syncs Instance
        this.io = null;
        //Global Shared Variable
        this.statics = {};
        // public info:any={name:"",avatar:null,id:null};
        //current gust or user profile
        this.profile = { name: "", avatar: null, id: null, online: true };
        //list of online users
        this.users = new Map();
        //list of messages by users and unread counter
        this.messages = new Map();
        //generate syncs instance and enable debug mode to log commands
        this.io = new Syncs();
        this.io.enableDebugMode();
        //get global shared variable that reports online users
        this.statics = this.io.globalShared('statics');
        /************ RMI INITIALIZATION **************/
        this.io.functions.setUsers = (users) => { this.setUsers(users); };
        this.io.functions.setProfile = (id, name, avatar, online) => this.setProfile(id, name, avatar, online);
        /************ SUBSCRIPTION INITIALIZATION **************/
        this.io.subscribe('user-join', user => this.addUser(user));
        this.io.subscribe('user-profile-change', user => this.changeUserProfile(user));
        this.io.subscribe('user-exit', data => this.users.delete(data.id));
        this.io.subscribe('message', data => this.onMessage(data));
    }
    // set list of users
    setUsers(users) {
        this.messages.set('global', { unread: 0, messages: [] });
        users.forEach(user => {
            this.addUser(user);
        });
    }
    //add user to list of users
    addUser(user) {
        if (user.id != this.profile.id) {
            this.messages.set(user.id, { unread: 0, messages: [] });
            this.users.set(user.id, user);
        }
    }
    //change user profile
    changeUserProfile(profile) {
        let user = this.users.get(profile.id);
        if (user) {
            user.name = profile.name;
            user.avatar = profile.avatar;
            user.online = profile.online;
        }
    }
    // set current user profile
    setProfile(id, name, avatar, online) {
        this.profile.id = id;
        this.profile.name = name;
        this.profile.avatar = avatar;
        this.profile.online = online;
    }
    //edit current user profile only on client side
    changeProfile(name, avatar, online) {
        this.profile.name = name;
        this.profile.avatar = avatar;
        this.profile.online = online;
        this.io.remote.changeProfile(name, avatar, online);
    }
    //get list of message from a user
    getMessages(id) {
        if (this.messages.has(id)) {
            return this.messages.get(id).messages;
        }
        return [];
    }
    //get number of unread messages from a user
    getUnread(id) {
        if (this.messages.has(id)) {
            return this.messages.get(id).unread;
        }
        return 0;
    }
    //send message to server
    sendMessage(to, message) {
        this.io.publish('client-message', { to: to, message: message });
        this.addMessage(to, this.profile.id, message);
    }
    //handle incoming messages
    onMessage(data) {
        if (data.from == this.profile.id) {
            return;
        }
        if (data.global) {
            this.addMessage('global', data.from, data.message);
        }
        else {
            this.addMessage(data.from, data.from, data.message);
        }
    }
    //add message to list of messages
    addMessage(to, from, message) {
        this.messages.get(to).messages.push({ message: message, from: from });
        if (from != 'me') {
            this.messages.get(to).unread++;
        }
    }
    // reset number of unread messages from a client
    resetUnread(id) {
        if (this.messages.has(id)) {
            this.messages.get(id).unread = 0;
        }
    }
    //get user by id
    getUser(id) {
        if (id == this.profile.id) {
            return { name: this.profile.name, avatar: this.profile.avatar };
        }
        else if (id == 'global') {
            return { name: 'global', online: true, avatar: 1 };
        }
        return this.users.get(id);
    }
};
CoreDataService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], CoreDataService);
exports.CoreDataService = CoreDataService;
//# sourceMappingURL=CoreData.js.map