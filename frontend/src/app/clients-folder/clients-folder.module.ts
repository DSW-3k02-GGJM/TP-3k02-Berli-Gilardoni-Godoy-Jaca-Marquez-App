import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component.js';
import { ClientFormComponent } from './client-form/client-form.component.js';
import { CreatedOrModifiedService } from '../shared/created-or-modified/created-or-modified.service.js';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientsTableComponent } from './clients-table/clients-table.component.js';

@NgModule({
  declarations: [ClientFormComponent, ClientsComponent],
  imports: [CommonModule, HttpClientModule, ClientsTableComponent, ReactiveFormsModule],
  providers: [CreatedOrModifiedService],
  exports: [ClientFormComponent, ClientsComponent]
})
export class ClientsFolderModule {}