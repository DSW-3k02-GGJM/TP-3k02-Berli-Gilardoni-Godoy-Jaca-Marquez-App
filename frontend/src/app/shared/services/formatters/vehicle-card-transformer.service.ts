// Angular
import { Injectable } from '@angular/core';

// Interfaces
import { Vehicle } from '@shared/interfaces/available-vehicles.model';
import { VehicleCard } from '@shared/interfaces/vehicle-card.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleCardTransformerService {
  transformToVehicleCardFormat(v: Vehicle): VehicleCard {
    return {
      id: v.id,
      vehicleModel: v.vehicleModel.vehicleModelName,
      category: v.vehicleModel.category.categoryName,
      image: v.vehicleModel.imagePath,
      passengerCount: v.vehicleModel.passengerCount,
      pricePerDay: v.vehicleModel.category.pricePerDay,
      deposit: v.vehicleModel.category.depositValue,
      brand: v.vehicleModel.brand.brandName,
    };
  }
}
