import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaCreatedOrModifiedService {
  categoriaCreatedOrModified = new Subject<void>();
  isDataLoaded = false;

  get IsDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  set IsDataLoaded(value: boolean) {
    this.isDataLoaded = value;
  }

  notifyCategoriaCreatedOrModified() {
    this.categoriaCreatedOrModified.next();
  }

  resetDataLoaded() {
    this.isDataLoaded = false;
  }
}
