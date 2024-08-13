import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { EntityFormComponent } from './shared/entity-form/entity-form.component'; 
import { ClientsComponent } from './clients-folder/clients/clients.component';

@NgModule({
  declarations: [
    AppComponent,
    EntityFormComponent,
    ClientsComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent], 
})
export class AppModule { }