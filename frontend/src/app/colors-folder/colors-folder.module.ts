import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorsComponent } from './colors/colors.component.js';
import { ColorFormComponent } from './color-form/color-form.component.js';
import { CreatedOrModifiedService } from '../shared/created-or-modified/created-or-modified.service.js';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorsTableComponent } from './colors-table/colors-table.component.js'; 

@NgModule({
  declarations: [ColorFormComponent, ColorsComponent],
  imports: [CommonModule, HttpClientModule, ColorsTableComponent, ReactiveFormsModule],
  providers: [CreatedOrModifiedService],
  exports: [ColorFormComponent, ColorsComponent]
})
export class ColorsFolderModule {}