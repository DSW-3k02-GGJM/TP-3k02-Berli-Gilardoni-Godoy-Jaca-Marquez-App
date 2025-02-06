// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { Reservation } from '@core/reservation/interfaces/reservation.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class ReservationFilterPipe implements PipeTransform {
  transform(value: Reservation[], arg: string, key: string): Reservation[] {
    if (arg.length < 3) return value;
    return value.filter((row: Reservation) => {
      const fieldValue = this.getNestedProperty(row, key);
      return fieldValue?.toString().toLowerCase().includes(arg.toLowerCase());
    });
  }

  private getNestedProperty<T>(obj: T, path: string): string | undefined {
    return path.split('.').reduce<string | undefined>((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return acc[part as keyof T] as string;
      }
      return undefined;
    }, obj as string);
  }
}
