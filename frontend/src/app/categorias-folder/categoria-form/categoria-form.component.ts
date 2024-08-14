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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss',
  providers: [ApiService],
})
export class CategoriaFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentCategoriaId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private createdOrModifiedService: CreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  categoriaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precioPorDia: new FormControl('', [Validators.required]),
    valorDeposito: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.createdOrModifiedService.isDataLoaded = false;

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
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('categorias', this.currentCategoriaId, this.categoriaForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    }
    this.createdOrModifiedService.isDataLoaded = true;
  }

}
