import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service.js';
import { CategoriaCreatedOrModifiedService } from '../categoria-created-or-modified/categoria-created-or-modified.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class CategoriaFormComponent implements OnInit {
  action: string = '';
  currentCategoriaId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriaCreatedOrModifiedService: CategoriaCreatedOrModifiedService
  ) {}

  categoriaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precioPorDia: new FormControl('', [Validators.required]),
    valorDeposito: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.categoriaCreatedOrModifiedService.isDataLoaded = false;

    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.apiService
          .getOne('categorias', Number(params.id))
          .subscribe((response) => {
            this.currentCategoriaId = response.data.id;
            this.categoriaForm.patchValue(response.data);
          });
        this.action = 'Edit';
      } else {
        this.action = 'Create';
      }
    });
  }

  onSubmit() {
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
    this.navigateToCategorias();
  }

  navigateToCategorias(): void {
    this.router.navigate(['/categorias']);
  }
}
