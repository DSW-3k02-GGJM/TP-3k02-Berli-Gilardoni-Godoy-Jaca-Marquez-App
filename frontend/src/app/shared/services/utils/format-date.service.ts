// Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatDateService {
  fromDashToSlash(date: string): string {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    return `${day}/${month}/${year}`;
  }

  fromSlashToDash(date: string): string {
    const day = date.substring(0, 2);
    const month = date.substring(3, 5);
    const year = date.substring(6, 10);

    return `${year}-${month}-${day}`;
  }

  removeTimeZoneFromString(date: string): string {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    return `${year}-${month}-${day}`;
  }

  removeTimeZoneFromDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
