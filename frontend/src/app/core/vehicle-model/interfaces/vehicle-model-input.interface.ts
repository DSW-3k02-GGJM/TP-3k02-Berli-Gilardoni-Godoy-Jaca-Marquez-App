// Interfaces
import { Brand } from '@core/brand/interfaces/brand.interface';
import { Category } from '@core/category/interfaces/category.interface';

export interface VehicleModelInput {
  vehicleModelName: string;
  transmissionType: string;
  passengerCount: number;
  imagePath: string;
  brand?: Brand;
  category?: Category;
}
