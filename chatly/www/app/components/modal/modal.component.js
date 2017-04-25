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
let ModalComponent = class ModalComponent {
    constructor() {
        this._show = false;
        this.header = "";
    }
    set show(value) {
        if (!this._id) {
            this._id = 'modal' + Math.floor(Math.random() * 1000000);
        }
        this._show = value;
        if (value) {
            $('.' + this._id).modal('setting', 'closable', false).modal('show');
        }
        else {
            $('.' + this._id).modal('hide');
        }
    }
    ngOnInit() {
    }
};
__decorate([
    core_1.Input(), 
    __metadata('design:type', Object)
], ModalComponent.prototype, "header", void 0);
__decorate([
    core_1.Input(), 
    __metadata('design:type', Boolean), 
    __metadata('design:paramtypes', [Boolean])
], ModalComponent.prototype, "show", null);
ModalComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'modal',
        template: `
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
    }), 
    __metadata('design:paramtypes', [])
], ModalComponent);
exports.ModalComponent = ModalComponent;
//# sourceMappingURL=modal.component.js.map