

import {Component, OnInit, Input, EventEmitter} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'modal',
    template:`
                <div class="ui modal {{_id}} " >
                  <div class="header pr">{{header}}</div>
                  <div class="content pr">
                    <ng-content select=".content"></ng-content>
                  </div>
                  <div class="actions pr">
                      <ng-content select=".action"></ng-content>
                  </div>
                </div>

            `,
})
export class ModalComponent implements OnInit {
    constructor() { }
    private _show=false;
    private _id:string;
    @Input() header="";
    @Input() set show(value:boolean){
        if(!this._id){
            this._id='modal'+Math.floor(Math.random()*1000000);
        }
        this._show=value;
        if(value){
            $('.'+this._id).modal('setting', 'closable', false).modal('show');
        }
        else{
            $('.'+this._id).modal('hide');
        }
    }
    ngOnInit() {

    }

}