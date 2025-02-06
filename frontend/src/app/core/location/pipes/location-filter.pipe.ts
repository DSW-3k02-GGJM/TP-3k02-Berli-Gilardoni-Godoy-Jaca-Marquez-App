// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { Location } from '@core/location/interfaces/location.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class LocationFilterPipe implements PipeTransform {
  transform(value: Location[], arg: string, key: string): Location[] {
    if (arg.length < 3) return value;
    return value.filter((row: Location) =>
      row[key as keyof Location]
        .toString()
        .toLowerCase()
        .includes(arg.toLowerCase())
    );
  }
}
