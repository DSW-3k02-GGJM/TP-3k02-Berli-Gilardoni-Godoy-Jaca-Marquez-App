import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandCreatedOrModifiedService {
  brandCreatedOrModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
  }

  notifyBrandCreatedOrModified() {
    this.brandCreatedOrModified.next();
  }

  resetDataLoaded() {
    this.isDataLoaded = false;
  }
}
