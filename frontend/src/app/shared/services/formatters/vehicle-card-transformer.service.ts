// Angular
import { Injectable } from '@angular/core';

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';
import { VehicleCard } from '@core/vehicle/interfaces/vehicle-card.interface';

@Injectable({
  providedIn: 'root',
})
export class VehicleCardTransformerService {
  transformToVehicleCardFormat(v: Vehicle): VehicleCard {
    return {
      id: v.id,
      vehicleModel: v.vehicleModel?.vehicleModelName ?? '',
      category: v.vehicleModel?.category?.categoryName ?? '',
      image: v.vehicleModel?.imagePath ?? '',
      passengerCount: v.vehicleModel?.passengerCount ?? 0,
      pricePerDay: v.vehicleModel?.category?.pricePerDay ?? 0,
      deposit: v.vehicleModel?.category?.depositValue ?? 0,
      brand: v.vehicleModel?.brand?.brandName ?? '',
    };
  }
}
