import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (arg.length < 3) return value;
    const result = [];
    for (const row of value) {
      if (row.colorName.toLowerCase().indexOf(arg.toLowerCase()) > -1) { //TODO: Ver como hacemos los filtros, por ahora solo andaria color
        result.push(row);
      }
    }
    return result;
  }
}
