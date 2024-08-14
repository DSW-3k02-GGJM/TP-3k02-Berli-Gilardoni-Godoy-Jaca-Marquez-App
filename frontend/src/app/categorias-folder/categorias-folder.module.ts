import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component.js';
import { CategoriasComponent } from './categorias/categorias.component.js';
import { CreatedOrModifiedService } from '../shared/created-or-modified/created-or-modified.service.js';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriasTableComponent } from './categorias-table/categorias-table.component.js';

@NgModule({
  declarations: [CategoriaFormComponent, CategoriasComponent],
  imports: [CommonModule, HttpClientModule, CategoriasTableComponent, ReactiveFormsModule],
  providers: [CreatedOrModifiedService],
  exports: [CategoriaFormComponent, CategoriaFormComponent]
})
export class CategoriasFolderModule {}