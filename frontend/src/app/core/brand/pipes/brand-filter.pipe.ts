// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { Brand } from '@core/brand/interfaces/brand.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class BrandFilterPipe implements PipeTransform {
  transform(value: Brand[], arg: string, key: string): Brand[] {
    if (arg.length < 3) return value;
    return value.filter((row: Brand) =>
      row[key as keyof Brand]
        .toString()
        .toLowerCase()
        .includes(arg.toLowerCase())
    );
  }
}
