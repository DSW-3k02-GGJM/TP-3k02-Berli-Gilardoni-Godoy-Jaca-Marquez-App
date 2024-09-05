import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ClientsTableComponent } from '../clients-table/clients-table.component';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientFormComponent } from '../client-form/client-form.component';
import { ClientCreatedOrModifiedService } from '../client-created-or-modified/cli.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  imports: [CommonModule, HttpClientModule, ClientsTableComponent],
  providers: [ApiService],
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private clientCreatedOrModifiedService: ClientCreatedOrModifiedService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    this.clientCreatedOrModifiedService.resetDataLoaded();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onClientDeleted(clientId: number): void {
    this.clients = this.clients.filter((client) => client.id !== clientId);
  }

  fillData() {
    this.subscription =
      this.clientCreatedOrModifiedService.clientCreatedOrModified.subscribe(
        () => {
          this.loadData();
        }
      );

    if (!this.clientCreatedOrModifiedService.isDataLoaded) {
      this.loadData();
    }
  }

  loadData() {
    this.apiService.getAll('clients').subscribe((response) => {
      this.clients = response.data;
    });
  }

  newClient() {
    const modalRef = this.modalService.open(ClientFormComponent, {
      size: 'l',
      centered: true,
    });
    modalRef.componentInstance.title = 'Nuevo Cliente';
  }
}
