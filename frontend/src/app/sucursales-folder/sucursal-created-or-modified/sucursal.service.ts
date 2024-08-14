import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalCreatedOrModifiedService {
  sucursalCreatedOrModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
  }

  notifySucursalCreatedOrModified() {
    this.sucursalCreatedOrModified.next();
  }

  resetDataLoaded() {
    this.isDataLoaded = false;
  }
}
