import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api.service.js';
import { ResClientTableComponent } from '../res-client-table/res-client-table.component.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-res-client',
  standalone: true,
  imports: [CommonModule, ResClientTableComponent],
  templateUrl: './res-client.component.html',
  styleUrl: './res-client.component.scss',
})
export class ResClientComponent implements OnInit {
  reservations: any[] = [];
  private subscription?: Subscription;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fillData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onResCancelled(): void {
    this.fillData();
  }

  fillData() {
    this.apiService.getReservationsByUser().subscribe((response) => {
      this.reservations = response.data;
    });
  }
}
