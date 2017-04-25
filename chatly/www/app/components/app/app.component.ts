import { Component } from '@angular/core';
import {CoreDataService} from "../../services/CoreData";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app',
  moduleId: module.id,
  templateUrl: 'app.component.html'
})
export class AppComponent  {

    private profile:any;
    private statics:any={};
    private showModal=false;
    private modifyNameForm:FormGroup;
    private messagingForm:FormGroup;
    private selectedUserId='global';

    constructor(private coreData:CoreDataService,fb:FormBuilder){
        this.profile=coreData.profile;
        this.statics=coreData.statics;
        this.modifyNameForm=fb.group({
            name:new FormControl('',[Validators.required]),
            avatar:new FormControl('1',[Validators.required])
        });

        this.messagingForm=fb.group({
            message:new FormControl('',[Validators.required])
        })

    }

    public getUsers(){
        return Array.from(this.coreData.users.values());
    }
    private changeAvatar(number:number){
        this.modifyNameForm.patchValue({avatar:number.toString()})
    }
    private changeName(){
        let controls=this.modifyNameForm.controls;
        this.coreData.changeProfile(controls['name'].value,controls['avatar'].value,this.profile.online);
        this.showModal=false;
    }

    private toggleOnline(){
        this.profile.online=!this.profile.online;
        this.coreData.changeProfile(this.profile.name,this.profile.avatar,this.profile.online);

    }




    getUnreadCount(id:any){
        return this.coreData.getUnread(id);
    }
    getMessages(id:string){
        this.coreData.resetUnread(id);
        return this.coreData.getMessages(id)
    }

    sendMessage(){
        if(this.coreData.profile.id){
            this.coreData.sendMessage(this.selectedUserId,this.messagingForm.controls['message'].value)
            this.messagingForm.reset();
        }else{
            this.showModal=true;
        }
    }

    getUser(id:string){
        return this.coreData.getUser(id);
    }

}


