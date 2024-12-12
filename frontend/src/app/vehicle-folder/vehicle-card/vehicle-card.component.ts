import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  output,
} from '@angular/core';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../service/shared.service.ts.service'; // verr
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class VehicleCardComponent implements OnInit {
  @Input() id!: number;
  @Input() vehicleModel!: any;
  @Input() categoryDescription!: string;
  @Input() image!: string;
  @Input() passengerCount!: Int16Array;
  @Input() pricePerDay!: number;
  @Input() deposit!: number;
  @Input() brand!: number;

  @Output() modelSelected = new EventEmitter<any>();
  startDate: string = '';
  endDate: string = '';

  constructor(
    private apiService: ApiService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.startDate$.subscribe((date) => (this.startDate = date));
    this.sharedService.endDate$.subscribe((date) => (this.endDate = date));
  }

  placeReservation() {
    const vehicleData = {
      vehicleModel: this.vehicleModel,
      categoryDescription: this.categoryDescription,
      passengerCount: this.passengerCount,
      pricePerDay: this.pricePerDay,
      deposit: this.deposit,
    };
    this.modelSelected.emit(vehicleData);
  }
}
