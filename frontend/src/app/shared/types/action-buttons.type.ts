// Interfaces
import { Brand } from '@core/brand/interfaces/brand.interface';
import { Category } from '@core/category/interfaces/category.interface';
import { Color } from '@core/color/interfaces/color.interface';
import { Location } from '@core/location/interfaces/location.interface';
import { User } from '@core/user/interfaces/user.interface';
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';

export type ActionButtons =
  | Brand
  | Category
  | Color
  | Location
  | User
  | Vehicle
  | VehicleModel;
