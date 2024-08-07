import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import { ClientsTableComponent } from '../clients-table/clients-table.component';

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

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fillData();
  }

  onClientDeleted(clientId: number): void {
    this.clients = this.clients.filter((client) => client.id !== clientId);
  }

  fillData() {
    this.apiService.getAll('clientes').subscribe((response) => {
      this.clients = response.data;
    });
  }

  navigateToNewClient(): void {
    this.router.navigate(['/clientes/creacion']);
  }
}
