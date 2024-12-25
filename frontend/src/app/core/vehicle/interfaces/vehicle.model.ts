export interface Vehicle {
  id: string;
  licensePlate: string;
  manufacturingYear: number;
  totalKms: number;
  location: Location;
  color: Color;
  vehicleModel: VehicleModel;
}

interface Location {
  id: string;
  locationName: string;
  address: string;
  phoneNumber: string;
}

interface Color {
  id: string;
  colorName: string;
}

interface VehicleModel {
  id: string;
  vehicleModelName: string;
  transmissionType: string;
  passengerCount: number;
  imagePath: string;
}
