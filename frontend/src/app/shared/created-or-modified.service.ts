import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreatedOrModifiedService {

  createdOrModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
  }

  notifyCreatedOrModified() {
    this.createdOrModified.next();
  }

  resetDataLoaded() {
    this.isDataLoaded = false;
  }
}
