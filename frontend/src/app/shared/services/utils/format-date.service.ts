// Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatDateService {
  fromDashToSlash(date: string): string {
    const year: string = date.substring(0, 4);
    const month: string = date.substring(5, 7);
    const day: string = date.substring(8, 10);

    return `${day}/${month}/${year}` as string;
  }

  fromSlashToDash(date: string): string {
    const day: string = date.substring(0, 2);
    const month: string = date.substring(3, 5);
    const year: string = date.substring(6, 10);

    return `${year}-${month}-${day}` as string;
  }

  formatDateToDash(date: Date): string {
    return date.toLocaleDateString('en-CA') as string;
  }

  formatDateToSlash(date: Date): string {
    const dashDate: string = this.formatDateToDash(date);
    return this.fromDashToSlash(dashDate) as string;
  }
}
