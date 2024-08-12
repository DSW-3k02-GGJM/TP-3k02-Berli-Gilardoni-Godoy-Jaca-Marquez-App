import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service.js';
import { CategoriaCreatedOrModifiedService } from '../categoria-created-or-modified/categoria-created-or-modified.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class CategoriaFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentCategoriaId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private categoriaCreatedOrModifiedService: CategoriaCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  categoriaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precioPorDia: new FormControl('', [Validators.required]),
    valorDeposito: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.categoriaCreatedOrModifiedService.isDataLoaded = false;

    if (this.currentCategoriaId != -1) {
      this.apiService
        .getOne('categorias', Number(this.currentCategoriaId))
        .subscribe((response) => {
          this.categoriaForm.patchValue(response.data);
        });
      this.action = 'Edit';
    } else {
      this.action = 'Create';
    }
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action == 'Create') {
      this.apiService
        .create('categorias', this.categoriaForm.value)
        .subscribe((response) => {
          this.categoriaCreatedOrModifiedService.notifyCategoriaCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('categorias', this.currentCategoriaId, this.categoriaForm.value)
        .subscribe((response) => {
          this.categoriaCreatedOrModifiedService.notifyCategoriaCreatedOrModified();
        });
    }
    this.categoriaCreatedOrModifiedService.isDataLoaded = true;
  }

}
