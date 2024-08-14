import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: null})
export class CreatedOrModifiedService {

  createdOrModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    console.log('IsDataLoaded');
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
    console.log('IsDataLoaded' + value);
  }

  notifyCreatedOrModified() {
    this.createdOrModified.next();
    console.log('Created or modified');
  }

  resetDataLoaded() {
    console.log('Reset data loaded');
    this.isDataLoaded = false;
  }
}
