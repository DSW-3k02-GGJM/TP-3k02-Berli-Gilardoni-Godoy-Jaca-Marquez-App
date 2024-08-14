import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeloFormComponent } from './modelo-form/modelo-form.component.js';
import { ModelosComponent } from './modelos/modelos.component.js';
import { CreatedOrModifiedService } from '../shared/created-or-modified/created-or-modified.service.js';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelosTableComponent } from './modelos-table/modelos-table.component.js';

@NgModule({
  declarations: [ModeloFormComponent, ModelosComponent],
  imports: [CommonModule, HttpClientModule, ModelosTableComponent, ReactiveFormsModule],
  providers: [CreatedOrModifiedService],
  exports: [ModeloFormComponent, ModelosComponent]
})
export class ModelosFolderModule {}