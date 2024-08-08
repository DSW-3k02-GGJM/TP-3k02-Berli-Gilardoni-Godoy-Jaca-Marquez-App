import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service.js';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss',
  providers: [ApiService],
})
export class CategoriaFormComponent {
  action: string = '';
  currentCategoriaId: any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  categoriaForm = new FormGroup({
    nombre : new FormControl('', [Validators.required]),
    descripcion : new FormControl('', [Validators.required]),
    precioPorDia : new FormControl('', [Validators.required]),
    valorDeposito : new FormControl('', [Validators.required]),
  })

  ngOnInit(): void {
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
      this.apiService.create('categorias', this.categoriaForm.value).subscribe((response) => {});
    } else if (this.action == 'Edit') {
      this.apiService
        .update('categorias', this.currentCategoriaId, this.categoriaForm.value)
        .subscribe((response) => {});
    }
  }

  navigateToCategorias(): void {
    this.router.navigate(['/categorias']);
  }
}