// alamacena las fechas del formulario de filtro de vehiculos

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {
  //almacenan las fechas de inicio y fin respectivamente.
  private startDateSource = new BehaviorSubject<Date | null>(null);
  private endDateSource = new BehaviorSubject<Date | null>(null);

  // Observables que permiten a otros componentes suscribirse a los cambios en las fechas.
  startDate$ = this.startDateSource.asObservable();
  endDate$ = this.endDateSource.asObservable();

  setStartDate(date: Date) {
    this.startDateSource.next(date);
  }

  setEndDate(date: Date) {
    this.endDateSource.next(date);
  }

  constructor() { }
}
