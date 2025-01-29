// Angular
import { Injectable } from '@angular/core';

// RxJS
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationModifiedService {
  reservationModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
  }

  notifyReservationModified() {
    this.reservationModified.next();
  }

  resetDataLoaded() {
    this.isDataLoaded = false;
  }
}
