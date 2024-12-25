export interface AvailableVehicles {
  message: string;
  data: Vehicle[];
}

export interface Vehicle {
  id: number;
  licensePlate: string;
  manufacturingYear: number;
  totalKms: number;
  color: number;
  location: Location;
  vehicleModel: VehicleModel;
}

interface Location {
  id: number;
  locationName: string;
  address: string;
  phoneNumber: string;
}

interface VehicleModel {
  id: number;
  vehicleModelName: string;
  transmissionType: string;
  passengerCount: number;
  imagePath: string;
  category: Category;
  brand: Brand;
}

interface Category {
  id: number;
  categoryName: string;
  categoryDescription: string;
  pricePerDay: number;
  depositValue: number;
}

interface Brand {
  id: number;
  brandName: string;
}
