import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';

@Component({
  selector: 'app-sucursal-form',
  templateUrl: './sucursal-form.component.html',
  styleUrl: './sucursal-form.component.scss',
  providers: [ApiService],
})
export class SucursalFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentSucursalId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private createdOrModifiedService: CreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  sucursalForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    domicilio: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.createdOrModifiedService.isDataLoaded = false;

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
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('sucursales', this.currentSucursalId, this.sucursalForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    }
    this.createdOrModifiedService.isDataLoaded = true;
  }

}
