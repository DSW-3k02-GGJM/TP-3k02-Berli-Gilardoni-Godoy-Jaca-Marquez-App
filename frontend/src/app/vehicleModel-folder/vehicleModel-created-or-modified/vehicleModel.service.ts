import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleModelCreatedOrModifiedService {
  vehicleModelCreatedOrModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
  }

  notifyVehicleModelCreatedOrModified() {
    this.vehicleModelCreatedOrModified.next();
  }

  resetDataLoaded() {
    this.isDataLoaded = false;
  }
}
