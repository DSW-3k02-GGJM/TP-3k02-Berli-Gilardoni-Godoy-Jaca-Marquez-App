import { Component, Input, NgModule, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatedOrModifiedService } from '../../shared/created-or-modified.service.js';

@Component({
  selector: 'app-entity-form',
  standalone: true,
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class EntityFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentEntityId: number = -1;
  @Input() entity: string = '';
  @Input() entityForm: FormGroup = new FormGroup({});
  action: string = '';

  constructor(
    private apiService: ApiService,
    private createdOrModifiedService: CreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.createdOrModifiedService.isDataLoaded = false;

    if (this.currentEntityId != -1) {
      this.apiService
        .getOne(this.entity, Number(this.currentEntityId))
        .subscribe((response) => {
          let fechaNacimientoFormat = this.formatBirthDate(
            response.data.fechaNacimiento
          );
          this.entityForm.patchValue({
            ...response.data,
            fechaNacimiento: fechaNacimientoFormat,
          });
        });
        this.action = 'Edit';
      } else {
        this.action = 'Create';
      }
  }

  formatBirthDate(fechaNacimientoDB: string): string {
    let fechaNacimientoFormat: string = '${year}-${month}-${day}';
    fechaNacimientoFormat = fechaNacimientoFormat.replace(
      '${year}',
      fechaNacimientoDB.substring(0, 4)
    );
    fechaNacimientoFormat = fechaNacimientoFormat.replace(
      '${month}',
      fechaNacimientoDB.substring(5, 7)
    );
    fechaNacimientoFormat = fechaNacimientoFormat.replace(
      '${day}',
      fechaNacimientoDB.substring(8, 10)
    );
    return fechaNacimientoFormat;
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action == 'Create') {
      this.apiService
        .create(this.entity, this.entityForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update(this.entity, this.currentEntityId, this.entityForm.value)
        .subscribe((response) => {
          this.createdOrModifiedService.notifyCreatedOrModified();
        });
    }
    this.createdOrModifiedService.isDataLoaded = true;
  }

  closeModal() {
    this.activeModal.close();
  }
}
