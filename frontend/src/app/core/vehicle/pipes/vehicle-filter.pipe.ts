// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { Vehicle } from '@core/vehicle/interfaces/vehicle.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class VehicleFilterPipe implements PipeTransform {
  transform(value: Vehicle[], arg: string, key: string): Vehicle[] {
    if (arg.length < 3) return value;
    return value.filter((row: Vehicle) =>
      row[key as keyof Vehicle]
        ?.toString()
        .toLowerCase()
        .includes(arg.toLowerCase())
    );
  }
}
