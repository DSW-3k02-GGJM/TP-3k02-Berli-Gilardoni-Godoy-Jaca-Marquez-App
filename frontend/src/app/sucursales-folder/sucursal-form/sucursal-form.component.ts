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
import { ApiService } from '../../service/api.service';
import { SucursalCreatedOrModifiedService } from '../sucursal-created-or-modified/sucursal-created-or-modified.service';

@Component({
  selector: 'app-sucursal-form',
  standalone: true,
  templateUrl: './sucursal-form.component.html',
  styleUrl: './sucursal-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class SucursalFormComponent implements OnInit {
  action: string = '';
  currentSucursalId: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sucursalCreatedOrModifiedService: SucursalCreatedOrModifiedService
  ) {}

  sucursalForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    domicilio: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.sucursalCreatedOrModifiedService.isDataLoaded = false;

    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.apiService
          .getOne('sucursales', Number(params.id))
          .subscribe((response) => {
            this.currentSucursalId = response.data.id;
            this.sucursalForm.patchValue(response.data);
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
        .create('sucursales', this.sucursalForm.value)
        .subscribe((response) => {
          this.sucursalCreatedOrModifiedService.notifySucursalCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('sucursales', this.currentSucursalId, this.sucursalForm.value)
        .subscribe((response) => {
          this.sucursalCreatedOrModifiedService.notifySucursalCreatedOrModified();
        });
    }
    this.sucursalCreatedOrModifiedService.isDataLoaded = true;
    this.navigateToSucursales();
  }

  navigateToSucursales(): void {
    this.router.navigate(['/sucursales']);
  }
}
