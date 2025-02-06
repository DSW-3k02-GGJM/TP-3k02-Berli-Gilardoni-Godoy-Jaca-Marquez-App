// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { VehicleModel } from '@core/vehicle-model/interfaces/vehicle-model.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
@Pipe({
  name: 'filter',
  standalone: true,
})
export class VehicleModelFilterPipe implements PipeTransform {
  transform(value: VehicleModel[], arg: string, key: string): VehicleModel[] {
    if (arg.length < 3) return value;
    return value.filter((row: VehicleModel) =>
      row[key as keyof VehicleModel]
        ?.toString()
        .toLowerCase()
        .includes(arg.toLowerCase())
    );
  }
}
