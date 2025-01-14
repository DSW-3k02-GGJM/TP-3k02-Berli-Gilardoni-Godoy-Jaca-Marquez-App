// Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Interfaces
import { VehicleCard } from '@core/vehicle/interfaces/vehicle-card.interface';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
  imports: [CommonModule],
})
export class VehicleCardComponent {
  @Input() vehicle!: VehicleCard;
  @Input() imageServerUrl!: string;
  @Output() modelSelected = new EventEmitter<VehicleCard>();

  get completeImageUrl(): string {
    return `${this.imageServerUrl}${this.vehicle.image}`;
  }

  placeReservation(): void {
    this.modelSelected.emit(this.vehicle);
  }
}
