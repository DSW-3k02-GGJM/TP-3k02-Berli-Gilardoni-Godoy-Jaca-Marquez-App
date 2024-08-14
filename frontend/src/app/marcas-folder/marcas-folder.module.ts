import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarcaFormComponent } from './marca-form/marca-form.component.js';
import { MarcasComponent } from './marcas/marcas.component.js';
import { CreatedOrModifiedService } from '../shared/created-or-modified/created-or-modified.service.js';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MarcasTableComponent } from './marcas-table/marcas-table.component.js';

@NgModule({
  declarations: [MarcaFormComponent, MarcasComponent],
  imports: [CommonModule, HttpClientModule, MarcasTableComponent, ReactiveFormsModule],
  providers: [CreatedOrModifiedService],
  exports: [MarcaFormComponent, MarcasComponent]
})
export class MarcasFolderModule {}