import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ClientsTableComponent } from '../clients-table/clients-table.component';
import { ClientCreatedOrModifiedService } from '../client-created-or-modified/client-created-or-modified.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  imports: [CommonModule, HttpClientModule, ClientsTableComponent],
  providers: [ApiService],
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  private subscription?: Subscription;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private clientCreatedOrModifiedService: ClientCreatedOrModifiedService
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
    this.apiService.getAll('clientes').subscribe((response) => {
      this.clients = response.data;
    });
  }

  navigateToNewClient(): void {
    this.router.navigate(['/clientes/creacion']);
  }
}
