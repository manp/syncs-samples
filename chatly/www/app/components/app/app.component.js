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
const core_1 = require('@angular/core');
const CoreData_1 = require("../../services/CoreData");
const forms_1 = require("@angular/forms");
let AppComponent = class AppComponent {
    constructor(coreData, fb) {
        this.coreData = coreData;
        this.statics = {};
        this.showModal = false;
        this.selectedUserId = 'global';
        this.profile = coreData.profile;
        this.statics = coreData.statics;
        this.modifyNameForm = fb.group({
            name: new forms_1.FormControl('', [forms_1.Validators.required]),
            avatar: new forms_1.FormControl('1', [forms_1.Validators.required])
        });
        this.messagingForm = fb.group({
            message: new forms_1.FormControl('', [forms_1.Validators.required])
        });
    }
    getUsers() {
        return Array.from(this.coreData.users.values());
    }
    changeAvatar(number) {
        this.modifyNameForm.patchValue({ avatar: number.toString() });
    }
    changeName() {
        let controls = this.modifyNameForm.controls;
        this.coreData.changeProfile(controls['name'].value, controls['avatar'].value, this.profile.online);
        this.showModal = false;
    }
    toggleOnline() {
        this.profile.online = !this.profile.online;
        this.coreData.changeProfile(this.profile.name, this.profile.avatar, this.profile.online);
    }
    getUnreadCount(id) {
        return this.coreData.getUnread(id);
    }
    getMessages(id) {
        this.coreData.resetUnread(id);
        return this.coreData.getMessages(id);
    }
    sendMessage() {
        if (this.coreData.profile.id) {
            this.coreData.sendMessage(this.selectedUserId, this.messagingForm.controls['message'].value);
            this.messagingForm.reset();
        }
        else {
            this.showModal = true;
        }
    }
    getUser(id) {
        return this.coreData.getUser(id);
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        moduleId: module.id,
        templateUrl: 'app.component.html'
    }), 
    __metadata('design:paramtypes', [CoreData_1.CoreDataService, forms_1.FormBuilder])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map