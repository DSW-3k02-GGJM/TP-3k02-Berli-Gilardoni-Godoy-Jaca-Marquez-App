// Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Services
import { SharedService } from '@shared/services/utils/shared.service';

// Interfaces
import { VehicleCard } from '../../../../shared/interfaces/vehicle-card.model';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class VehicleCardComponent implements OnInit {
  @Input() vehicle!: VehicleCard;
  @Output() modelSelected = new EventEmitter<any>();

  startDate: string = '';
  endDate: string = '';

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.startDate$.subscribe({
      next: (date) => (this.startDate = date),
    });
    this.sharedService.endDate$.subscribe({
      next: (date) => (this.endDate = date),
    });
  }

  placeReservation() {
    this.modelSelected.emit(this.vehicle);
  }
}
