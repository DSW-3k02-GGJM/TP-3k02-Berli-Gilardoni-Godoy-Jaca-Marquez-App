// Angular
import { Pipe, PipeTransform } from '@angular/core';

// Interfaces
import { Color } from '@core/color/interfaces/color.interface';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class ColorFilterPipe implements PipeTransform {
  transform(value: Color[], arg: string, key: string): Color[] {
    if (arg.length < 3) return value;
    return value.filter((row: Color) =>
      row[key as keyof Color]
        .toString()
        .toLowerCase()
        .includes(arg.toLowerCase())
    );
  }
}
