import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientCreatedOrModifiedService {
  clientCreatedOrModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
  }

  notifyClientCreatedOrModified() {
    this.clientCreatedOrModified.next();
  }

  resetDataLoaded() {
    this.isDataLoaded = false;
  }
}
