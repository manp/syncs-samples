import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './components/app/app.component';
import {ModalComponent} from "./components/modal/modal.component";
import {CoreDataService} from "./services/CoreData";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports:      [ BrowserModule , FormsModule,ReactiveFormsModule],
  declarations: [ AppComponent,ModalComponent ],
  bootstrap:    [ AppComponent ],
  providers:[CoreDataService]
})
export class AppModule { }
