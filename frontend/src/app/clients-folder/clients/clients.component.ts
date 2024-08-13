import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ClientsTableComponent } from '../clients-table/clients-table.component';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatedOrModifiedService } from '../../shared/created-or-modified.service.js';
import { EntityFormComponent } from '../../shared/entity-form/entity-form.component.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone: true,
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  imports: [CommonModule, HttpClientModule, ClientsTableComponent,EntityFormComponent],
  providers: [ApiService, NgbActiveModal],
})
export class ClientsComponent implements OnInit {
  @ViewChild('entityForm') entityForm: EntityFormComponent;
  clients: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private createdOrModifiedService: CreatedOrModifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onClientDeleted(clientId: number): void {
    this.clients = this.clients.filter((client) => client.id !== clientId);
  }

  fillData() {
    this.subscription =
      this.createdOrModifiedService.createdOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.createdOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('clientes').subscribe((response) => {
      this.clients = response.data;
    });
  }

  newClient() {
    const modalRef = this.modalService.open(this.entityForm, { size: 'l' , centered: true , ariaLabelledBy: 'modal-basic-title' });
    modalRef.componentInstance.title = 'Nuevo Cliente';
    modalRef.componentInstance.entity = 'clientes';
    modalRef.componentInstance.entityForm = new FormGroup({
      tipoDoc: new FormControl('', [Validators.required]),
      nroDoc: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      domicilio: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      nacionalidad: new FormControl('', [Validators.required]),
    });
  }
}
