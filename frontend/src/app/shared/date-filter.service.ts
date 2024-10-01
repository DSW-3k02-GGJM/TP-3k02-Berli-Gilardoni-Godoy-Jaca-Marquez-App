// alamacena las fechas del formulario de filtro de vehiculos

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {
  private startDateSource = new BehaviorSubject<Date | null>(null);
  private endDateSource = new BehaviorSubject<Date | null>(null);

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
