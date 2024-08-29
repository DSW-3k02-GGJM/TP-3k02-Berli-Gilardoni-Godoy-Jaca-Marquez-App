import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { SucursalCreatedOrModifiedService } from '../sucursal-created-or-modified/suc.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sucursal-form',
  standalone: true,
  templateUrl: './sucursal-form.component.html',
  styleUrl: './sucursal-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class SucursalFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentSucursalId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private sucursalCreatedOrModifiedService: SucursalCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  sucursalForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    domicilio: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.sucursalCreatedOrModifiedService.isDataLoaded = false;

    if (this.currentSucursalId != -1) {
      this.apiService
        .getOne('sucursales', Number(this.currentSucursalId))
        .subscribe((response) => {
          this.sucursalForm.patchValue(response.data);
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
  }
}
