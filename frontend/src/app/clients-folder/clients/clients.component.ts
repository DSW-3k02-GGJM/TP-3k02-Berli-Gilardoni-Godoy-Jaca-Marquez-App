import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientFormComponent } from '../client-form/client-form.component.js';
import { CreatedOrModifiedService } from '../../shared/created-or-modified/created-or-modified.service.js';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  providers: [ApiService],
})
export class ClientsComponent implements OnInit {
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
    const modalRef = this.modalService.open(ClientFormComponent, { size: 'l' , centered: true});
    modalRef.componentInstance.title = 'Nuevo Cliente'
  }
}
