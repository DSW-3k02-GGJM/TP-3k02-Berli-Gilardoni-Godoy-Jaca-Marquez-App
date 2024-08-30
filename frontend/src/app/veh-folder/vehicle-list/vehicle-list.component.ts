import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
  imports: [CommonModule, HttpClientModule, VehicleCardComponent],
  providers: [ApiService],
})
export class VehicleListComponent implements OnInit {
  response: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fillData();
  }

  fillData() {
    //this.apiService.getAll('vehiculos').subscribe((response) => {
      this.apiService.getAll('modelos').subscribe((response) => {
      this.response = response.data;
    });
  }
}
