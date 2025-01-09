// Angular
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Interfaces
import { VehicleCard } from '../../../../shared/interfaces/vehicle-card.model';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  standalone: true,
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
