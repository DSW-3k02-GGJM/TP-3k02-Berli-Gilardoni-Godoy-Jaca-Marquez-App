// Angular
import { Injectable } from '@angular/core';

// RxJS
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private startDateSource = new BehaviorSubject<string>('');
  private endDateSource = new BehaviorSubject<string>('');

  startDate$ = this.startDateSource.asObservable();
  endDate$ = this.endDateSource.asObservable();

  setStartDate(date: string) {
    this.startDateSource.next(date);
  }

  setEndDate(date: string) {
    this.endDateSource.next(date);
  }
}
