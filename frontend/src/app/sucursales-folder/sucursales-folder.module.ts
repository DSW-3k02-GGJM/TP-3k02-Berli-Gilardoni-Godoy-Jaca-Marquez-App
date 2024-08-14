import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SucursalFormComponent } from './sucursal-form/sucursal-form.component.js';
import { SucursalesComponent } from './sucursales/sucursales.component.js';
import { CreatedOrModifiedService } from '../shared/created-or-modified/created-or-modified.service.js';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SucursalesTableComponent } from './sucursales-table/sucursales-table.component.js';

@NgModule({
  declarations: [SucursalFormComponent, SucursalesComponent],
  imports: [CommonModule, HttpClientModule, SucursalesTableComponent, ReactiveFormsModule],
  providers: [CreatedOrModifiedService],
  exports: [SucursalFormComponent, SucursalesComponent]
})
export class SucursalesFolderModule {}