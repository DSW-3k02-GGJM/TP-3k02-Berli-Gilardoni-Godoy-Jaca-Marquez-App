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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientCreatedOrModifiedService } from '../client-created-or-modified/cli.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ApiService],
})
export class ClientFormComponent implements OnInit {
  @Input() title: string = '';
  @Input() currentClientId: number = -1;
  action: string = '';

  constructor(
    private apiService: ApiService,
    private clientCreatedOrModifiedService: ClientCreatedOrModifiedService,
    public activeModal: NgbActiveModal
  ) {}

  clientForm = new FormGroup({
    documentType: new FormControl('', [Validators.required]),
    documentID: new FormControl('', [Validators.required]),
    clientName: new FormControl('', [Validators.required]),
    clientSurname: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.clientCreatedOrModifiedService.isDataLoaded = false;

    if (this.currentClientId != -1) {
      this.apiService
        .getOne('clients', Number(this.currentClientId))
        .subscribe((response) => {
          let birthDateFormat = this.formatBirthDate(
            response.data.birthDate
          );
          this.clientForm.patchValue({
            ...response.data,
            birthDate: birthDateFormat,
          });
        });
      this.action = 'Edit';
    } else {
      this.action = 'Create';
    }
  }

  formatBirthDate(birthDateDB: string): string {
    let birthDateFormat: string = '${year}-${month}-${day}';
    birthDateFormat = birthDateFormat.replace(
      '${year}',
      birthDateDB.substring(0, 4)
    );
    birthDateFormat = birthDateFormat.replace(
      '${month}',
      birthDateDB.substring(5, 7)
    );
    birthDateFormat = birthDateFormat.replace(
      '${day}',
      birthDateDB.substring(8, 10)
    );
    return birthDateFormat;
  }

  onSubmit() {
    this.activeModal.close();
    if (this.action == 'Create') {
      this.apiService
        .create('clients', this.clientForm.value)
        .subscribe((response) => {
          this.clientCreatedOrModifiedService.notifyClientCreatedOrModified();
        });
    } else if (this.action == 'Edit') {
      this.apiService
        .update('clients', this.currentClientId, this.clientForm.value)
        .subscribe((response) => {
          this.clientCreatedOrModifiedService.notifyClientCreatedOrModified();
        });
    }
    this.clientCreatedOrModifiedService.isDataLoaded = true;
  }
}
